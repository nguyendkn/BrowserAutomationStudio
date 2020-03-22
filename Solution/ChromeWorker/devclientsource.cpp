#include "devclientsource.h"
#include <thread>
#include "log.h"
#include "startwith.h"
#include "websocketpp/config/asio_no_tls_client.hpp"
#include "websocketpp/client.hpp"

#define NONE_DETECTOR_DEBUG

DevClientSource::DevClientSource()
{

}


void DevClientSource::OnRequestComplete(CefRefPtr<CefURLRequest> request)
{
    std::string Res(WebsocketRequestData.begin(),WebsocketRequestData.end());
    try
    {
        picojson::value v;
        picojson::parse(v, Res);
        picojson::value::array a = v.get<picojson::value::array>();
        for(picojson::value& Item: a)
        {
            picojson::value::object ItemObject = Item.get<picojson::value::object>();
            std::string Url = ItemObject["url"].get<std::string>();

            if(!starts_with(Url,"file:///"))
            {
                std::string Endpoint = ItemObject["webSocketDebuggerUrl"].get<std::string>();
                #ifdef DETECTOR_DEBUG
                    DETECTOR_LOG("Found endpoint " + Endpoint);
                #endif
                Start(Endpoint);
                return;
            }
        }
    }catch(...)
    {

    }
}

void DevClientSource::OnUploadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total)
{
}

void DevClientSource::OnDownloadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total)
{
}

void DevClientSource::OnDownloadData(CefRefPtr<CefURLRequest> request, const void* data, size_t data_length)
{
    WebsocketRequestData.insert(WebsocketRequestData.end(),(char *)data,(char *)data + data_length);
}

bool DevClientSource::GetAuthCredentials(bool isProxy, const CefString& host, int port, const CefString& realm, const CefString& scheme, CefRefPtr<CefAuthCallback> callback)
{
    return false;
}

int DevClientSource::Send(const std::string& Method)
{
    picojson::value::object res;
    res["id"] = picojson::value((double)TaskId);
    int SentTask = TaskId;
    res["method"] = picojson::value(Method);
    std::string Data = picojson::value(res).serialize();
    TaskId++;

    Client.send(ConnectionHandle,Data,websocketpp::frame::opcode::text);
    return SentTask;
}

int DevClientSource::Send(const std::string& Method, const picojson::object& Params)
{
    picojson::value::object res;
    res["id"] = picojson::value((double)TaskId);
    int SentTask = TaskId;
    res["method"] = picojson::value(Method);
    res["params"] = picojson::value(Params);
    std::string Data = picojson::value(res).serialize();
    TaskId++;

    Client.send(ConnectionHandle,Data,websocketpp::frame::opcode::text);
    return SentTask;
}


void DevClientSource::OnMessage(ClientClass* Client, HandleClass Handle, MessageClass Message)
{
    try
    {
        picojson::value v;

        picojson::parse(v, Message->get_payload());

        picojson::value::object o = v.get<picojson::value::object>();


        if(o["id"].is<double>())
        {
            int ObtainedId = (int)o["id"].get<double>();
            {
                std::lock_guard<std::mutex> lock(DataMutex);
                if(IsStoppingDebugger && ObtainedId == DebuggerCloseRequest)
                {
                    if(IsStoppingDebuggerBecauseSuccess)
                    {
                        IsSuccessEnding = true;
                        if(Timeout)
                        {
                            Timeout->cancel();
                        }
                        return;
                    }else
                    {
                        #ifdef DETECTOR_DEBUG
                            DETECTOR_LOG("Received disable debugger responce after timeout");
                        #endif
                        if(!NextSourceUrl.empty())
                        {
                            StartNextIfNeeded();
                        }else
                        {
                            IsBusy = false;
                            NextSourceUrl.clear();
                            CurrentTaskId = -1;
                            NextLineNumber = -1;
                            NextColumnNumber = -1;
                            CurrentScriptSourceResult.clear();
                            CurrentSourceUrl.clear();
                            CurrentLineNumber = -1;
                            CurrentColumnNumber = -1;
                            CurrentSourceLineNumber = -1;
                            CurrentSourceColumnNumber = -1;
                            IsStoppingDebugger = false;
                            IsStoppingDebuggerBecauseSuccess = false;
                            DebuggerCloseRequest = -1;
                            NextSourceUrl.clear();
                            NextLineNumber = -1;
                            NextColumnNumber = -1;
                            IsSuccessEnding = false;
                            IsFinished = true;
                            return;
                        }
                    }
                }
            }



            {
                std::lock_guard<std::mutex> lock(DataMutex);
                bool IsCurrent = CurrentTaskId == ObtainedId;
                #ifdef DETECTOR_DEBUG
                    DETECTOR_LOG("Source result from browser, expected = " + std::to_string(CurrentTaskId) + ", got = " + std::to_string(ObtainedId));
                #endif

                if(IsCurrent)
                {
                    picojson::value::object Result = o["result"].get<picojson::value::object>();
                    std::string ScriptSource = Result["scriptSource"].get<std::string>();
                    #ifdef DETECTOR_DEBUG
                        DETECTOR_LOG("Source from browser is same as expected, length = " + std::to_string(ScriptSource.size()));
                        DETECTOR_LOG("Sending disable debugger request");
                    #endif


                    CurrentScriptSourceResult =
                            CurrentSourceUrl + std::string(":") + std::to_string(CurrentSourceLineNumber) + std::string(":") + std::to_string(CurrentSourceColumnNumber) + std::string("\n") +
                            ScriptSource;

                    CurrentTaskId = -1;
                    CurrentLineNumber = -1;
                    CurrentColumnNumber = -1;
                    CurrentSourceLineNumber = -1;
                    CurrentSourceColumnNumber = -1;
                    CurrentSourceUrl.clear();
                    IsStoppingDebugger = true;
                    IsStoppingDebuggerBecauseSuccess = true;
                    DebuggerCloseRequest = Send("Debugger.disable");

                }

            }

            return;
        }

        if(o["method"].is<std::string>())
        {
            std::string Method = o["method"].get<std::string>();

            if(Method == "Debugger.scriptParsed")
            {

                picojson::value::object Params = o["params"].get<picojson::value::object>();
                std::string Url = Params["url"].get<std::string>();

                if(!Url.empty())
                {
                    std::string ScriptId = Params["scriptId"].get<std::string>();
                    int ReceivedLineStart = Params["startLine"].get<double>() + 1;
                    int ReceivedColumnStart = Params["startColumn"].get<double>() + 1;
                    int ReceivedLineEnd = Params["endLine"].get<double>() + 1;
                    int ReceivedColumnEnd = Params["endColumn"].get<double>() + 1;

                    #ifdef DETECTOR_DEBUG
                       DETECTOR_LOG("Script parsed for url " + Url + ", script id = " + ScriptId);
                    #endif

                    {
                        std::lock_guard<std::mutex> lock(DataMutex);
                        if(
                                //Url matches
                                (Url == CurrentSourceUrl)
                                //and
                                &&
                                //Source location matches
                                (
                                    CurrentLineNumber > ReceivedLineStart && CurrentLineNumber < ReceivedLineEnd
                                    ||
                                    CurrentLineNumber == ReceivedLineStart && CurrentColumnNumber >= ReceivedColumnStart
                                    ||
                                    CurrentLineNumber == ReceivedLineEnd && CurrentColumnNumber < ReceivedColumnEnd
                                )
                           )
                        {
                            CurrentSourceLineNumber = ReceivedLineStart;
                            CurrentSourceColumnNumber = ReceivedColumnStart;
                            picojson::value::object Request;
                            Request["scriptId"] = picojson::value(ScriptId);
                            CurrentTaskId = Send("Debugger.getScriptSource",Request);
                            #ifdef DETECTOR_DEBUG
                                DETECTOR_LOG("Script found, starting request " + std::to_string(CurrentTaskId));
                            #endif
                        }

                    }


                }
            }
            return;
        }


    }catch(const std::exception& e)
    {
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Error " + std::string(e.what()));
        #endif
    }catch(...)
    {
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Unknown error ");
        #endif

    }
}

void DevClientSource::OnTimeout()
{
    std::lock_guard<std::mutex> lock(DataMutex);

    if(IsSuccessEnding)
    {
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Received disable debugger responce");
        #endif

        IsStoppingDebugger = false;
        IsBusy = false;
        IsFinished = true;

        StartNextIfNeeded();


    }else
    {
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Timeout, closing debugger");
        #endif
        IsStoppingDebugger = true;
        IsStoppingDebuggerBecauseSuccess = false;
        DebuggerCloseRequest = Send("Debugger.disable");

    }
}

void DevClientSource::StartNextIfNeeded()
{
    if(!NextSourceUrl.empty())
    {
        IsBusy = true;

        NextColumnNumber = -1;
        CurrentScriptSourceResult.clear();
        CurrentSourceUrl = NextSourceUrl;
        CurrentLineNumber = NextLineNumber;
        CurrentColumnNumber = NextColumnNumber;
        CurrentSourceLineNumber = -1;
        CurrentSourceColumnNumber = -1;
        IsStoppingDebugger = false;
        DebuggerCloseRequest = -1;
        IsSuccessEnding = false;
        IsFinished = false;
        NextSourceUrl.clear();
        CurrentTaskId = -1;
        NextLineNumber = -1;
        IsStoppingDebuggerBecauseSuccess = false;
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Another request is pending, url = " + CurrentSourceUrl + ", starting debugger.");
        #endif
        if(Timeout)
        {
            Timeout->cancel();
            Timeout->expires_after(std::chrono::seconds(5));
            Timeout->async_wait(std::bind(
                                    &DevClientSource::OnTimeout,
                                    this
                                ));
        }
        Send("Debugger.enable");
    }
}


void DevClientSource::Start(int RemoteDebuggingPort)
{
    if(IsStarted)
        return;
    IsStarted = true;
    #ifdef DETECTOR_DEBUG
        DETECTOR_LOG("Start for port " + std::to_string(RemoteDebuggingPort));
    #endif
    WebsocketEndpoint = CefRequest::Create();
    WebsocketEndpoint->SetURL(std::string("http://127.0.0.1:") + std::to_string(RemoteDebuggingPort) + std::string("/json"));
    WebsocketEndpoint->SetMethod("GET");
    WebsocketEndpoint->SetFlags(UR_FLAG_SKIP_CACHE);
    WebsocketRequest = CefURLRequest::Create(WebsocketEndpoint,this,NULL);

}

void DevClientSource::Start(const std::string& Endpoint)
{
    try
    {
        //Detailed logs
        //Client.set_access_channels(websocketpp::log::alevel::all);
        //Client.clear_access_channels(websocketpp::log::alevel::frame_payload);

        Client.set_access_channels(websocketpp::log::alevel::none);

        //Init
        Client.init_asio();

        //Callbacks
        Client.set_message_handler(
                    std::bind(
                        &DevClientSource::OnMessage,
                        this,
                        &Client,
                        websocketpp::lib::placeholders::_1,
                        websocketpp::lib::placeholders::_2
                    )
                  );

        //Connect
        websocketpp::lib::error_code ec;
        websocketpp::client<websocketpp::config::asio_client>::connection_ptr Connection = Client.get_connection(Endpoint, ec);
        ConnectionHandle = Connection->get_handle();
        Client.connect(Connection);
        Timeout = new asio::steady_timer(Client.get_io_service());

        //Start working thread
        new std::thread(&ClientClass::run,&Client);

    }catch(...)
    {
        //Ingore every error
    }
}

bool DevClientSource::GetSourceFromUrlStart(const std::string& Url, int LineNumber, int ColumnNumber)
{
    std::lock_guard<std::mutex> lock(DataMutex);
    #ifdef DETECTOR_DEBUG
        DETECTOR_LOG("Request from client to get source for url " + Url);
    #endif
    if(IsBusy)
    {
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Busy, will try again later.");
        #endif
        NextSourceUrl = Url;
        NextLineNumber = LineNumber;
        NextColumnNumber = ColumnNumber;
    }else
    {
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Free, starting request.");
        #endif
        IsBusy = true;
        NextSourceUrl.clear();
        CurrentTaskId = -1;
        NextLineNumber = -1;
        NextColumnNumber = -1;
        CurrentScriptSourceResult.clear();
        CurrentSourceUrl = Url;
        CurrentLineNumber = LineNumber;
        CurrentColumnNumber = ColumnNumber;
        CurrentSourceLineNumber = -1;
        CurrentSourceColumnNumber = -1;
        IsStoppingDebugger = false;
        DebuggerCloseRequest = -1;
        IsFinished = false;
        IsStoppingDebuggerBecauseSuccess = true;
        IsSuccessEnding = false;
        if(Timeout)
        {
            Timeout->cancel();
            Timeout->expires_after(std::chrono::seconds(5));
            Timeout->async_wait(std::bind(
                                    &DevClientSource::OnTimeout,
                                    this
                                ));
        }
        //Start debugger
        Send("Debugger.enable");
    }

    return true;
}

bool DevClientSource::GetSourceFromUrlEnd(std::string& Result)
{
    std::lock_guard<std::mutex> lock(DataMutex);

    if(IsFinished)
    {
        Result = CurrentScriptSourceResult;
        #ifdef DETECTOR_DEBUG
            DETECTOR_LOG("Send responce to client, length = " + std::to_string(CurrentScriptSourceResult.size()));
        #endif
        CurrentScriptSourceResult.clear();
        IsFinished = false;
        return true;
    }


    return false;
}

