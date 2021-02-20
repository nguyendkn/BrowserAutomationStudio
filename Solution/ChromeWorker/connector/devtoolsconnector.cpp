#include "devtoolsconnector.h"
#include <string>
#include <set>
#include <random>
#include <chrono>
#include <windows.h>
#include "converter.h"
#include "json/picojson.h"
#include "devtoolsactionwebsocketquery.h"
#include "match.h"
#include "fileutils.h"
#include "startwith.h"

using namespace std::placeholders;
using namespace std::chrono;


void DevToolsConnector::Initialize
(
        std::shared_ptr<ISimpleHttpClientFactory> SimpleHttpClientFactory,
        std::shared_ptr<IWebSocketClientFactory> WebSocketClientFactory,
        int Port, const std::string& UniqueProcessId, const std::string& ParentProcessId, const std::string& ChromeExecutableLocation,
        const std::string& ConstantStartupScript,
        const std::vector<std::pair<std::string,std::string> >& CommandLineAdditional
)
{
    this->CommandLineAdditional = CommandLineAdditional;
    this->SimpleHttpClientFactory = SimpleHttpClientFactory;
    this->WebSocketClientFactory = WebSocketClientFactory;

    ISimpleHttpClient * HttpClient = this->SimpleHttpClientFactory->Create();
    HttpClient->GlobalActivate();
    delete HttpClient;

    IWebSocketClient * WebSocketClient = this->WebSocketClientFactory->Create();
    WebSocketClient->GlobalActivate();
    delete WebSocketClient;

    this->IsConnectionOrLaunch = true;
    this->TargetPort = Port;
    GlobalState.Port = Port;
    GlobalState.UniqueProcessId = UniqueProcessId;
    GlobalState.ParentProcessId = ParentProcessId;
    GlobalState.ChromeExecutableLocation = ChromeExecutableLocation;
    GlobalState.ConstantStartupScript = ConstantStartupScript;

    ImageData.resize(67272892);
    IPC = new SharedMemoryIPC();
    IPC->Start(UniqueProcessId);
}

char* DevToolsConnector::GetPaintData()
{
    return ImageData.data();
}

int DevToolsConnector::GetPaintWidth()
{
    return PaintWidth;
}

int DevToolsConnector::GetPaintHeight()
{
    return PaintHeight;
}

int DevToolsConnector::GetWidth()
{
    return GlobalState.Width;
}

int DevToolsConnector::GetHeight()
{
    return GlobalState.Height;
}

int DevToolsConnector::GetScrollX()
{
    return GlobalState.ScrollX;
}

int DevToolsConnector::GetScrollY()
{
    return GlobalState.ScrollY;
}

void DevToolsConnector::SetProfilePath(const std::wstring& Path)
{
    this->ProfilePath = Path;
}

void DevToolsConnector::SetExtensionList(const std::vector<std::wstring>& Extensions)
{
    this->Extensions = Extensions;
}

void DevToolsConnector::OpenDevTools()
{
    std::wstring PageId;

    for(auto const& Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::Connected)
        {
            if(Tab->TabId == GlobalState.TabId)
            {
                PageId = s2ws(Tab->FrameId);
                break;
            }
        }
    }

    if(!PageId.empty())
    {
        std::wstring Url =
                std::wstring(L"http://127.0.0.1:")
                + std::to_wstring(GlobalState.Port)
                + std::wstring(L"/devtools/inspector.html?ws=127.0.0.1:")
                + std::to_wstring(GlobalState.Port)
                + std::wstring(L"/devtools/page/")
                + PageId;
        ShellExecute(0, 0, Url.c_str(), 0, 0 , SW_SHOW );
    }
}

void DevToolsConnector::StartProcess()
{
    std::wstring CommandLine;
    CommandLine += std::wstring(L"--remote-debugging-port=") + std::to_wstring(GlobalState.Port);
    CommandLine += std::wstring(L" ");

    CommandLine += std::wstring(L"--unique-process-id=") + s2ws(GlobalState.UniqueProcessId);
    CommandLine += std::wstring(L" ");

    CommandLine += std::wstring(L"--parent-process-id=") + s2ws(GlobalState.ParentProcessId);
    CommandLine += std::wstring(L" ");

    CommandLine += std::wstring(L"--no-proxy-server");
    CommandLine += std::wstring(L" ");

    CommandLine += std::wstring(L"--disable-site-isolation-trials");
    CommandLine += std::wstring(L" ");

    CommandLine += std::wstring(L"--force-device-scale-factor=1");
    CommandLine += std::wstring(L" ");

    CommandLine += std::wstring(L"--disable-smooth-scrolling");
    CommandLine += std::wstring(L" ");

    for(auto p:CommandLineAdditional)
    {
        CommandLine += std::wstring(s2ws(p.first));
        if(p.second.length()>0)
        {
            CommandLine += std::wstring(L"=");
            CommandLine += std::wstring(s2ws(p.second));
        }
        CommandLine += std::wstring(L" ");
    }

    int BrowserWidth = 1024 + GlobalState.WidthDifference;
    int BrowserHeight = 600 + GlobalState.HeightDifference;
    CommandLine += std::wstring(std::wstring(L"--window-size=") + std::to_wstring(BrowserWidth) + std::wstring(L",") + std::to_wstring(BrowserHeight));
    CommandLine += std::wstring(L" ");

    if(!ProfilePath.empty())
    {
        CommandLine += std::wstring(L"--user-data-dir=") + ProfilePath;
        CommandLine += std::wstring(L" ");
    }

    if(!Extensions.empty())
    {
        std::wstring ExtensionsString;
        for(const std::wstring& ExtensionString : Extensions)
        {
            if(!ExtensionsString.empty())
            {
                ExtensionsString += std::wstring(L",");
            }
            ExtensionsString += ExtensionString;
        }
        CommandLine += std::wstring(L"--load-extension=") + ExtensionsString;
        CommandLine += std::wstring(L" ");
    }

    CommandLine += std::wstring(L"about:blank");

    ShellExecute(0, 0, L"worker.exe", CommandLine.c_str(), s2ws(GlobalState.ChromeExecutableLocation).c_str(), SW_SHOW);
}

void DevToolsConnector::TryToConnect()
{

    //Launch type is not set yet
    if(TargetPort < 0)
        return;

    //Already connected
    if(ConnectionState == Connected)
        return;

    //Start connection
    if(ConnectionState == NotStarted)
    {
        //Http client is in use, wait.
        if(GlobalState.HttpClient)
        {
            return;
        }


        GlobalState.HttpClient.reset(this->SimpleHttpClientFactory->Create());
        GlobalState.HttpClient->OnResult.push_back(std::bind(&DevToolsConnector::OnBrowserEndpointObtained,this,_1,_2,_3));
        std::string Url = std::string("http://127.0.0.1:") + std::to_string(TargetPort) + std::string("/json/version");
        GlobalState.HttpClient->Get(Url);
        ConnectionState = WaitingForBrowserEndpoint;
    }
}

void DevToolsConnector::OnHttpClientResult(bool IsSuccess,int StatusCode,std::string& Data)
{
    for(std::shared_ptr<IDevToolsAction> Action: Actions)
    {
        if(Action->UsesHttpClient() && Action->GetId() == CurrentHttpClientActionId)
        {
            Action->OnHttpClientMessage(IsSuccess,StatusCode,Data);
        }
    }
}

void DevToolsConnector::OnBrowserEndpointObtained(bool IsSuccess,int StatusCode,std::string& Data)
{
    if(GlobalState.HttpClient)
        GlobalState.HttpClient->DeleteLater = true;
    if(!IsSuccess || StatusCode != 200)
    {
        ConnectionState = NotStarted;
    }else
    {
        picojson::value AllValue;
        picojson::parse(AllValue, Data);
        picojson::object AllObject = AllValue.get<picojson::object>();
        Endpoint = AllObject["webSocketDebuggerUrl"].get<std::string>();

        size_t start_pos = 0;
        std::string ReplaceFrom = "127.0.0.1/";
        std::string ReplaceTo = std::string("127.0.0.1:") + std::to_string(TargetPort) + std::string("/");
        while((start_pos = Endpoint.find(ReplaceFrom, start_pos)) != std::string::npos)
        {
            Endpoint.replace(start_pos, ReplaceFrom.length(), ReplaceTo);
            start_pos += ReplaceTo.length();
        }
        
        GlobalState.WebSocketClient.reset(this->WebSocketClientFactory->Create());

        GlobalState.WebSocketClient->OnConnected.push_back(std::bind(&DevToolsConnector::OnWebSocketConnected, this, _1));
        GlobalState.WebSocketClient->OnDisconnected.push_back(std::bind(&DevToolsConnector::OnWebSocketDisconnected, this));
        GlobalState.WebSocketClient->OnMessage.push_back(std::bind(&DevToolsConnector::OnWebSocketMessage, this, _1));
        GlobalState.WebSocketClient->Connect(Endpoint);

        ConnectionState = WaitingForWebsocket;
    }
}

void DevToolsConnector::OnWebSocketConnected(bool IsSuccess)
{
    if(!IsSuccess)
    {
        ConnectionState = NotStarted;
        if(GlobalState.WebSocketClient)
        {
            GlobalState.WebSocketClient->DeleteLater = true;
        }
        return;
    }
    ConnectionState = WaitingForAutoconnectEnable;
    GlobalState.WebSocketClient->Send(std::string("{\"id\": 1,\"method\": \"Target.setDiscoverTargets\", \"params\": {\"discover\": true}}"));

}

void DevToolsConnector::OnWebSocketDisconnected()
{
    ConnectionState = NotStarted;
    if(GlobalState.WebSocketClient)
        GlobalState.WebSocketClient->DeleteLater = true;

    if(ResetResult)
    {
        StartProcess();
    }

    return;
}

void DevToolsConnector::StartFirstSavedAction(std::shared_ptr<TabData> Tab)
{
    long long Now = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();

    Tab->SavedActions[0]->SetTimeStarted(Now);
    if(Tab->SavedActions[0]->GetTimeout() >= 0)
    {
        Tab->SavedActions[0]->SetDeadline(Tab->SavedActions[0]->GetTimeStarted() + Tab->SavedActions[0]->GetTimeout());
    } else
    {
        Tab->SavedActions[0]->SetDeadline(0);
    }

    if(Tab->IsSwitchingToTab)
        Tab->SavedActions[0]->OnTabSwitching();
    else
        Tab->SavedActions[0]->OnTabCreation();
}

void DevToolsConnector::ProcessTabConnection(std::shared_ptr<TabData> Tab)
{
    if(Tab->ConnectionState == TabData::NotStarted)
    {
        Tab->ConnectionState = TabData::WaitingForAttachment;
        std::map<std::string, Variant> Params;
        Params["targetId"] = Variant(Tab->FrameId);
        Params["flatten"] = Variant(true);
        Tab->CurrentWebsocketActionId = -1;
        SendWebSocket("Target.attachToTarget", Params, std::string());
    }else if(Tab->ConnectionState == TabData::WaitingForAttachment)
    {
        Tab->ConnectionState = TabData::WaitingForPageEnable;
        std::map<std::string, Variant> Params;
        Tab->CurrentWebsocketActionId = SendWebSocket("Page.enable", Params, Tab->TabId);
    }else if(Tab->ConnectionState == TabData::WaitingForPageEnable)
    {
        Tab->ConnectionState = TabData::WaitingForRuntimeEnable;
        std::map<std::string, Variant> Params;
        Tab->CurrentWebsocketActionId = SendWebSocket("Runtime.enable", Params, Tab->TabId);
    } else if(Tab->ConnectionState == TabData::WaitingForRuntimeEnable)
    {
        Tab->ConnectionState = TabData::WaitingForNetworkEnable;
        std::map<std::string, Variant> Params;
        Tab->CurrentWebsocketActionId = SendWebSocket("Network.enable", Params, Tab->TabId);
    } else if(Tab->ConnectionState == TabData::WaitingForNetworkEnable)
    {
        Tab->ConnectionState = TabData::WaitingForSettingStartupScript;
        std::map<std::string, Variant> Params;
        Params["source"] = Variant(GlobalState.ConstantStartupScript);
        Tab->CurrentWebsocketActionId = SendWebSocket("Page.addScriptToEvaluateOnNewDocument", Params, Tab->TabId);
    } else if(Tab->ConnectionState == TabData::WaitingForSettingStartupScript)
    {
        Tab->ConnectionState = TabData::WaitingForPageReloadForFirstTab;

        if(ConnectionState != WaitingFirstTab)
        {
            ProcessTabConnection(Tab);
            return;
        }
        std::map<std::string, Variant> Params;
        Params["expression"] = Variant(GlobalState.ConstantStartupScript + std::string(";0;"));
        Tab->CurrentWebsocketActionId = SendWebSocket("Runtime.evaluate", Params, Tab->TabId);
    } else if(Tab->ConnectionState == TabData::WaitingForPageReloadForFirstTab)
    {
        Tab->CurrentWebsocketActionId = 0;

        std::vector<std::shared_ptr<IDevToolsAction> > SavedActions;
        
        if(ConnectionState != WaitingFirstTab)
        {
            //Creating new tab, need to execute actions
            SavedActions = ActionsSaver.GetActions();
        }

        for(std::shared_ptr<IDevToolsAction> Action : SavedActions)
        {
            Action->SetOverrideDefaultTabId(Tab->TabId);
        }

        Tab->ConnectionState = TabData::WaitingForExecutingSavedActions;
        Tab->SavedActions = SavedActions;
        if(!SavedActions.empty())
        {
            //Run action
            StartFirstSavedAction(Tab);
        }else
            ProcessTabConnection(Tab);

    }else if(Tab->ConnectionState == TabData::WaitingForExecutingSavedActions)
    {
        if(!Tab->SavedActions.empty())
        {
            Tab->SavedActions.erase(Tab->SavedActions.begin(), Tab->SavedActions.begin() + 1);
        }

        if(Tab->SavedActions.empty())
        {
            Tab->ConnectionState = TabData::Connected;
            Tab->CurrentWebsocketActionId = 0;

        } else
        {
            //Run action
            StartFirstSavedAction(Tab);
        }
    }

}

void DevToolsConnector::OnWebSocketMessage(std::string& Message)
{
    picojson::value AllValue;
    picojson::parse(AllValue,Message);
    picojson::object AllObject = AllValue.get<picojson::object>();
    int Id = 0;
    if(AllObject.count("id") > 0 && AllObject["id"].is<double>())
    {
        Id = AllObject["id"].get<double>();
    }

    if(Id > 0)
    {
        //Autocunnect responce has been obtained, waiting to connect for at least one tab
        if (ConnectionState == WaitingForAutoconnectEnable && Id == 1)
        {
            std::map<std::string, Variant> CurrentParams;

            CurrentParams["downloadPath"] = Variant(ws2s(GetRelativePathToParentFolder(L"")));
            CurrentParams["behavior"] = Variant(std::string("allowAndName"));

            SendWebSocket("Browser.setDownloadBehavior",  CurrentParams, std::string());
            ConnectionState = WaitingForDownloadsEnable;
            return;
        }

        if (ConnectionState == WaitingForDownloadsEnable)
        {
            ConnectionState = WaitingFirstTab;
            return;
        }

        //Connecting to tab
        for(auto const& Tab : GlobalState.Tabs)
        {
            if(Tab->CurrentWebsocketActionId == Id)
            {
                ProcessTabConnection(Tab);
                return;
            }
        }

        //Switching tab after closing current
        if(SwitchTabAfterCloseCurrentActionId == Id)
        {
            GlobalState.SwitchToTabId = SwitchTabAfterCloseCurrentTabId;
            GlobalState.SwitchToTabFrameId = SwitchTabAfterCloseCurrentFrameId;
            GlobalState.SwitchToTabResetSavedActions = true;
            
            return;
        }
        

        std::vector<std::shared_ptr<IDevToolsAction> > AllActions = GetAllActions();

        //Send received message to action which expects it
        for(std::shared_ptr<IDevToolsAction> Action: AllActions)
        {
            if(Action->GetState() == IDevToolsAction::Running && Action->GetId() == Id)
            {
                std::string Result;
                std::string Error;
                if(AllObject["result"].is<picojson::object>())
                {
                    picojson::object ResultObject = AllObject["result"].get<picojson::object>();
                    Result = picojson::value(ResultObject).serialize();
                }
                if(AllObject["error"].is<picojson::object>())
                {
                    picojson::object ErrorObject = AllObject["error"].get<picojson::object>();
                    Error = picojson::value(ErrorObject).serialize();
                }
                Action->OnWebSocketMessage(Result, Error);
                break;
            }
        }

        

        return;
    }

    //Process incoming events 
    if(AllObject.count("method") > 0 && AllObject["method"].is<std::string>())
    {
        std::string Method = AllObject["method"].get<std::string>();

        if (Method == "Page.frameRequestedNavigation")
        {
            picojson::object ResultObject = AllObject["params"].get<picojson::object>();
            std::string Result = picojson::value(ResultObject).serialize();

            if (AllObject["params"].is<picojson::object>())
            {
                std::string Reason = Parser.GetStringFromJson(Result, "reason");
                std::string Url = Parser.GetStringFromJson(Result, "url");

                if(Reason == "anchorClick")
                {
                    ParseNewTabReferrer(Url);
                }
            }
        }

        if (Method == "Page.windowOpen")
        {
            picojson::object ResultObject = AllObject["params"].get<picojson::object>();
            std::string Result = picojson::value(ResultObject).serialize();

            if (AllObject["params"].is<picojson::object>())
            {
                std::string Url = Parser.GetStringFromJson(Result, "url");

                GlobalState.WindowOpenNewTabUrl = Url;

                std::string WindowName = Parser.GetStringFromJson(Result, "windowName");
                ParseNewTabReferrer(WindowName);
            }
        }


        if (Method == "Page.downloadWillBegin")
        {
            for (auto f : OnNativeDialog)
                f("download");

            if(GlobalState.IsDownloadsAllowed)
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();
                std::string FileName = Parser.GetStringFromJson(Result, "guid");


                for (auto f : OnDownloadStarted)
                    f(GetRelativePathToParentFolder(s2ws(FileName)));
            }
        }


        if (Method == "Page.downloadProgress")
        {
            picojson::object ResultObject = AllObject["params"].get<picojson::object>();
            std::string Result = picojson::value(ResultObject).serialize();

            if (AllObject["params"].is<picojson::object>())
            {
                std::string State = Parser.GetStringFromJson(Result, "state");
                if(State == "inProgress")
                {
                    GlobalState.IsDownloading = true;
                    GlobalState.CurrentDownloadFileName = Parser.GetStringFromJson(Result, "guid");
                }else if(State == "completed")
                {
                    GlobalState.IsDownloading = false;
                    GlobalState.CurrentDownloadFileName = Parser.GetStringFromJson(Result, "guid");
                }else if(State == "canceled")
                {
                    GlobalState.IsDownloading = false;
                    GlobalState.CurrentDownloadFileName.clear();
                }
            }
        }



        if(Method == "Page.javascriptDialogOpening")
        {
            if (AllObject["params"].is<picojson::object>())
            {
                std::string DialogType;

                if(AllObject["params"].contains("type") && AllObject["params"].get("type").is<std::string>())
                {
                    DialogType = AllObject["params"].get("type").get<std::string>();
                }

                std::shared_ptr<IDevToolsAction> NewAction;
                std::map<std::string, Variant> Params;

                NewAction.reset(ActionsFactory.Create("DialogResult", &GlobalState));

                Params["type"] = Variant(DialogType);

                NewAction->SetTimeout(-1);
                NewAction->SetParams(Params);

                InsertAction(NewAction);

                for (auto f : OnNativeDialog)
                    f(DialogType);
            }
        }

        if(Method == "Page.fileChooserOpened")
        {
            if (AllObject["params"].is<picojson::object>())
            {
                if(AllObject["params"].contains("backendNodeId") && AllObject["params"].get("backendNodeId").is<double>())
                {
                    double BackendNodeId = AllObject["params"].get("backendNodeId").get<double>();

                    bool IsMultiple = false;

                    if(AllObject["params"].contains("mode") && AllObject["params"].get("mode").is<std::string>())
                    {
                        std::string Mode = AllObject["params"].get("mode").get<std::string>();
                        if(Mode == "selectMultiple")
                        {
                            IsMultiple = true;
                        }
                    }

                    std::shared_ptr<IDevToolsAction> NewAction;
                    std::map<std::string, Variant> Params;

                    NewAction.reset(ActionsFactory.Create("OpenFile", &GlobalState));

                    Params["node_id"] = Variant(BackendNodeId);
                    Params["is_multiple"] = Variant(IsMultiple);

                    NewAction->SetTimeout(-1);
                    NewAction->SetParams(Params);

                    InsertAction(NewAction);

                    for (auto f : OnNativeDialog)
                        f("upload");
                }
            }
        }

        if(Method == "Target.targetInfoChanged")
        {
            //Check if tab url has been changed

            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();
                std::string FrameId = Parser.GetStringFromJson(Result, "targetInfo.targetId");
                std::string NewUrl = Parser.GetStringFromJson(Result, "targetInfo.url");

                bool IsChanged = false;


                for(std::shared_ptr<TabData> TabInfo : GlobalState.Tabs)
                {
                    if(FrameId == TabInfo->FrameId)
                    {
                        if(TabInfo->CurrentUrl != NewUrl && GlobalState.TabId == TabInfo->TabId)
                            IsChanged = true;
                        TabInfo->CurrentUrl = NewUrl;
                    }
                }

                if(IsChanged)
                {
                    for(auto f:OnAddressChanged)
                        f(NewUrl);
                }

            }

        }

        if(Method == "Page.frameStartedLoading")
        {
            //Page loading has been started
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string FrameId = Parser.GetStringFromJson(Result, "frameId");

                for(std::shared_ptr<TabData> TabInfo : GlobalState.Tabs)
                {
                    if(FrameId == TabInfo->FrameId)
                    {
                        for(auto f:OnLoadStart)
                            f();
                        TabInfo->IsLoading = true;
                    }
                }

            }
        }
        if(Method == "Page.frameStoppedLoading")
        {
            //Page loading has been started
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string FrameId = Parser.GetStringFromJson(Result, "frameId");

                for(std::shared_ptr<TabData> TabInfo : GlobalState.Tabs)
                {
                    if(FrameId == TabInfo->FrameId)
                    {
                        for(auto f:OnLoadStop)
                            f();
                        TabInfo->IsLoading = false;
                    }
                }

            }
        }
        if(Method == "Network.requestWillBeSent")
        {
            //Request started
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string RequestId = Parser.GetStringFromJson(Result, "requestId");
                for(auto f:OnRequestStart)
                    f(RequestId);
            }
        }
        if(Method == "Network.loadingFinished" || Method == "Network.loadingFailed" || Method == "Network.requestServedFromCache" || Method == "Network.responseReceived")
        {
            //Request ended
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string RequestId = Parser.GetStringFromJson(Result, "requestId");
                for(auto f:OnRequestStop)
                    f(RequestId);
            }
        }
        
        //Intercept screencast event, replace it with OnPaint event
        if(Method == "Page.screencastFrame")
        {
            int NewScrollX = Parser.GetFloatFromJson(Message,"params.metadata.scrollOffsetX");
            int NewScrollY = Parser.GetFloatFromJson(Message,"params.metadata.scrollOffsetY");

            if(GlobalState.ScrollX != NewScrollX || GlobalState.ScrollY != NewScrollY)
            {
                GlobalState.ScrollX = NewScrollX;
                GlobalState.ScrollY = NewScrollY;
                for(auto f:OnScroll)
                    f();
            }
        }else if(Method == "Fetch.requestPaused") 
        {
            if (AllObject["params"].is<picojson::object>())
            {
                //This event is generated by using Fetch.enable
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();
                OnFetchRequestPaused(Result);
            }
        }else if(Method == "Network.responseReceived")
        {
            //Capture all urls which has been loaded
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string Url = Parser.GetStringFromJson(Result, "response.url");
                double Status = Parser.GetFloatFromJson(Result, "response.status");
                CachedUrls[Url] = Status;
            }
        } else if(Method == "Target.targetCreated")
        {
            //New tab has been created, attach to it
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string FrameId = Parser.GetStringFromJson(Result, "targetInfo.targetId");
                std::string TypeName = Parser.GetStringFromJson(Result, "targetInfo.type");
                std::string Url = Parser.GetStringFromJson(Result, "targetInfo.url");
                if(Url.empty())
                    Url = GlobalState.WindowOpenNewTabUrl;

                if(TypeName == "page")
                {
                    if(!GlobalState.IsPopupsAllowed)
                    {
                        //Tab creation is not allowed, close it instantly
                        std::map<std::string, Variant> CurrentParams;
                        CurrentParams["targetId"] = Variant(FrameId);
                        SendWebSocket("Target.closeTarget", CurrentParams, std::string());
                    }else
                    {
                        if(Url != "chrome://newtab/" && Url != "about:blank")
                        {
                            //Tab is opened by using ctrl-click or window.open
                            std::map<std::string, Variant> CurrentParams;
                            CurrentParams["targetId"] = Variant(FrameId);
                            SendWebSocket("Target.closeTarget", CurrentParams, std::string());
                            CreateTab(Url, true, false, GlobalState.NewTabReferrer);
                            GlobalState.NewTabReferrer.clear();
                        }else
                        {
                            if(GlobalState.SwitchingToDelayedTabIndex >= 0 && GlobalState.SwitchingToDelayedTabIndex < GlobalState.Tabs.size() && GlobalState.Tabs[GlobalState.SwitchingToDelayedTabIndex]->ConnectionState == TabData::Delayed)
                            {
                                //Loading delayed tab
                                std::shared_ptr<TabData> TabInfo = GlobalState.Tabs[GlobalState.SwitchingToDelayedTabIndex];
                                TabInfo->ConnectionState = TabData::NotStarted;
                                TabInfo->FrameId = FrameId;
                                ProcessTabConnection(TabInfo);
                            }else
                            {
                                std::shared_ptr<TabData> TabInfo = std::make_shared<TabData>();
                                TabInfo->ConnectionState = TabData::NotStarted;
                                TabInfo->FrameId = FrameId;
                                GlobalState.Tabs.push_back(TabInfo);
                                ProcessTabConnection(TabInfo);
                            }

                            GlobalState.SwitchingToDelayedTabIndex = -1;
                        }
                    }
                }
            }
        }else if(Method == "Target.attachedToTarget")
        {
            //New tab has been attached, start initialization of new tab
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string TabId = Parser.GetStringFromJson(Result, "sessionId");
                std::string FrameId = Parser.GetStringFromJson(Result, "targetInfo.targetId");
                
                for(std::shared_ptr<TabData> TabInfo : GlobalState.Tabs)
                {
                    if(FrameId == TabInfo->FrameId)
                    {
                        TabInfo->TabId = TabId;
                        GlobalState.SwitchToTabId = TabId;
                        GlobalState.SwitchToTabFrameId = FrameId;
                        GlobalState.SwitchToTabResetSavedActions = false;
                        ProcessTabConnection(TabInfo);
                    }
                }
            }
        } else if(Method == "Target.detachedFromTarget")
        {
            //Tab removed, need to update list and switch tab if current tab is closed
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string TabId = Parser.GetStringFromJson(Result, "sessionId");
                bool IsCurrentTabClosing = TabId == GlobalState.TabId;
                std::string FirstTabId;
                std::string FirstFrameId;

                for(auto it = GlobalState.Tabs.begin(); it != GlobalState.Tabs.end(); )
                {
                    if((*it)->TabId == TabId)
                    {
                        it = GlobalState.Tabs.erase(it);
                    } else
                    {
                        if(FirstTabId.empty())
                        {
                            FirstTabId = (*it)->TabId;
                            FirstFrameId = (*it)->FrameId;
                        }
                        ++it;
                    }
                }

                if(IsCurrentTabClosing && !FirstTabId.empty() && !FirstFrameId.empty())
                {
                    std::map<std::string, Variant> CurrentParams;
                    CurrentParams["targetId"] = Variant(FirstFrameId);
                    SwitchTabAfterCloseCurrentTabId = FirstTabId;
                    SwitchTabAfterCloseCurrentFrameId = FirstFrameId;
                    SwitchTabAfterCloseCurrentActionId = SendWebSocket("Target.activateTarget", CurrentParams, std::string());
                }

            }
        }
        else
        {
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                //Save information about frames and context
                if (Method == "Runtime.executionContextCreated")
                {
                    std::string FrameId = Parser.GetStringFromJson(Result, "context.auxData.frameId");
                    int ContextId = Parser.GetFloatFromJson(Result, "context.id");
                    GlobalState.FrameIdToContextId[FrameId] = ContextId;
                }

                if (Method == "Runtime.executionContextDestroyed")
                {
                    int ContextId = Parser.GetFloatFromJson(Result, "executionContextId");
                    for (auto it = GlobalState.FrameIdToContextId.cbegin(); it != GlobalState.FrameIdToContextId.cend(); )
                    {
                        if (it->second == ContextId)
                        {
                            GlobalState.FrameIdToContextId.erase(it++);
                        }
                        else
                        {
                            ++it;
                        }
                    }
                }

                //Send event information to subscribers of OnMessage

                for(auto f:OnMessage)
                    f(Method, Result);

                int PreviousScrollX = GlobalState.ScrollX;
                int PreviousScrollY = GlobalState.ScrollY;
                int PreviousWidth = GlobalState.Width;
                int PreviousHeight = GlobalState.Height;


                std::vector<std::shared_ptr<IDevToolsAction> > AllActions = GetAllActions();

                //Send event information to actions which expects them
                for(std::shared_ptr<IDevToolsAction> Action: AllActions)
                {
                    std::vector<std::string> SubscribbedEvents = Action->GetSubscribbedEvents();
                    if(Action->GetState() == IDevToolsAction::Running && std::find(SubscribbedEvents.begin(), SubscribbedEvents.end(), Method) != SubscribbedEvents.end())
                    {
                        Action->OnWebSocketEvent(Method, Result);
                    }
                }

                if(GlobalState.ScrollX != PreviousScrollX || GlobalState.ScrollY != PreviousScrollY)
                {
                    for(auto f:OnScroll)
                        f();
                }

                if(GlobalState.Width != PreviousWidth || GlobalState.Height != PreviousHeight)
                {
                    for(auto f:OnResize)
                        f();
                }
            }
        }
        return;
    }


}

void DevToolsConnector::HandleIPCData()
{
    bool IsNewImage = false;

    //Get data
    {
        SharedMemoryIPCLockGuard Lock(IPC);

        if(IPC->GetImageId())
        {
            ImageData.assign(IPC->GetImagePointer(),IPC->GetImagePointer() + IPC->GetImageSize());
            PaintWidth = IPC->GetImageWidth();
            PaintHeight = IPC->GetImageHeight();
            IPC->SetImageId(0);
            IsNewImage = true;
        }

    }

    //Paint screenshot
    if(IsNewImage)
    {
        if(GlobalState.Width != PaintWidth || GlobalState.Height != PaintHeight)
        {
            GlobalState.Width = PaintWidth;
            GlobalState.Height = PaintHeight;
            for(auto f:OnResize)
                f();
        }

        for(auto f:OnPaint)
            f();
    }
}

void DevToolsConnector::Timer()
{
    TryToConnect();

    //Delete http client if needed
    if(GlobalState.HttpClient)
    {
        if(GlobalState.HttpClient->DeleteLater)
        {
            GlobalState.HttpClient.reset();
        }else
        {
            GlobalState.HttpClient->Timer();
        }

    }

    //Delete web socket if needed
    if(GlobalState.WebSocketClient)
    {
        if(GlobalState.WebSocketClient->DeleteLater)
        {
            GlobalState.WebSocketClient.reset();
        }else
        {
            GlobalState.WebSocketClient->Timer();
        }
    }

    //If at least one tab is connected, mark connection state as connected
    if(ConnectionState == WaitingFirstTab && !GlobalState.Tabs.empty())
    {
        for(auto const& Tab : GlobalState.Tabs)
        {
            if(Tab->ConnectionState == TabData::Connected)
            {
                ConnectionState = Connected;
                
                //If reset action waits for connected status, notify about result
                if(ResetResult)
                {
                    ResetResult->Success();
                    ResetResult.reset();
                    ResetMethodDeadline = 0;
                }
                break;
            }
        }
    }

    //Executing saved action when connecting to tab
    for(auto const& Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::WaitingForExecutingSavedActions && !Tab->SavedActions.empty() && (Tab->SavedActions[0]->GetState() == IDevToolsAction::Finished || Tab->SavedActions[0]->GetState() == IDevToolsAction::NotStarted))
        {
            ProcessTabConnection(Tab);
            return;
        }
    }

    //Tabs switching
    for(auto const& Tab : GlobalState.Tabs)
    {
        if(GlobalState.SwitchToTabId == Tab->TabId && !GlobalState.SwitchToTabId.empty())
        {
            if(GlobalState.SwitchToTabResetSavedActions && Tab->ConnectionState == TabData::Connected)
            {
                Tab->ConnectionState = TabData::WaitingForPageReloadForFirstTab;
                Tab->IsSwitchingToTab = true;
                GlobalState.SwitchToTabResetSavedActions = false;
                ProcessTabConnection(Tab);
            }
            if(Tab->ConnectionState == TabData::Connected)
            {
                GlobalState.TabId = Tab->TabId;

                for(auto f:OnAddressChanged)
                    f(Tab->CurrentUrl);

                //Generate Target.targetActivated event. This event doesn't exist in Chrome Developer tools protocol.
                std::string TabId = GlobalState.SwitchToTabId;
                std::string FrameId = GlobalState.SwitchToTabFrameId;
                std::string Method = "Target.targetActivated";
                GlobalState.SwitchToTabId.clear();
                GlobalState.SwitchToTabFrameId.clear();

                int PreviousScrollX = GlobalState.ScrollX;
                int PreviousScrollY = GlobalState.ScrollY;
                int PreviousWidth = GlobalState.Width;
                int PreviousHeight = GlobalState.Height;

                for(std::shared_ptr<IDevToolsAction> Action : Actions)
                {
                    std::vector<std::string> SubscribbedEvents = Action->GetSubscribbedEvents();
                    if(Action->GetState() == IDevToolsAction::Running && std::find(SubscribbedEvents.begin(), SubscribbedEvents.end(), Method) != SubscribbedEvents.end())
                    {
                        std::map<std::string, Variant> Params;
                        Params["targetInfo.targetId"] = Variant(std::string(FrameId));
                        Params["targetInfo.sessionId"] = Variant(std::string(TabId));
                        std::string Result = Serializer.SerializeObjectToString(Params);
                        Action->OnWebSocketEvent(Method, Result);
                    }
                }

                if(GlobalState.ScrollX != PreviousScrollX || GlobalState.ScrollY != PreviousScrollY)
                {
                    for(auto f:OnScroll)
                        f();
                }

                if(GlobalState.Width != PreviousWidth || GlobalState.Height != PreviousHeight)
                {
                    for(auto f:OnResize)
                        f();
                }
            }
        }
    }

    long long Now = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();

    //Process timeout for reset acion
    if(ResetResult)
    {
        if(ResetMethodDeadline > 0 && Now > ResetMethodDeadline)
        {
            ResetResult->Fail("Timeout", "Timeout");
            ResetResult.reset();
            ResetMethodDeadline = 0;
        }
    }

    if(ConnectionState == Connected)
    {
        HandleIPCData();

        int PreviousScrollX = GlobalState.ScrollX;
        int PreviousScrollY = GlobalState.ScrollY;
        int PreviousWidth = GlobalState.Width;
        int PreviousHeight = GlobalState.Height;

        std::vector<std::shared_ptr<IDevToolsAction> >::iterator it = Actions.begin();
        while(it != Actions.end())
        {
            std::shared_ptr<IDevToolsAction> Action = *it;

            bool DeleteThisAction = false;

            if(Action->GetState() == IDevToolsAction::NotStarted)
            {
                //Check pending actions, start if possible
                bool CanRun = false;
                if(Action->UsesHttpClient())
                {
                    if(GlobalState.HttpClient)
                    {
                        CanRun = false;
                    }else
                    {
                        CanRun = true;
                        CurrentHttpClientActionId = Action->GetId();
                        GlobalState.HttpClient.reset(this->SimpleHttpClientFactory->Create());
                        GlobalState.HttpClient->OnResult.push_back(std::bind(&DevToolsConnector::OnHttpClientResult,this,_1,_2,_3));
                    }
                }else
                {
                    bool HasRunningActionWithSameGroupId = false;

                    for(std::shared_ptr<IDevToolsAction> CurrentAction : Actions)
                    {
                        if(CurrentAction->GetGroupId() == Action->GetGroupId() && CurrentAction->GetId() != Action->GetId() && CurrentAction->GetState() == IDevToolsAction::Running)
                        {
                            HasRunningActionWithSameGroupId = true;
                            break;
                        }
                    }

                    CanRun = !HasRunningActionWithSameGroupId;
                }

                if(CanRun)
                {
                    Action->SetTimeStarted(Now);
                    if(Action->GetTimeout() >= 0)
                    {
                        Action->SetDeadline(Action->GetTimeStarted() + Action->GetTimeout());
                    }else
                    {
                        Action->SetDeadline(0);
                    }
                    if(Action->GetRunnningForAllRunActiveTab())
                    {
                        Action->OnRunnningForAllRunActiveTab();
                    } else
                    {
                        Action->Run();
                    }
                }
            }else if(Action->GetState() == IDevToolsAction::Finished)
            {
                //Clear finished acitons
                if(Action->UsesHttpClient())
                {
                    if(GlobalState.HttpClient)
                        GlobalState.HttpClient->DeleteLater = true;
                    CurrentHttpClientActionId = 0;
                }

                DeleteThisAction = true;
            }else if(Action->GetState() == IDevToolsAction::Running)
            {
                //Stop action if timeout
                if(Action->GetDeadline() > 0 && Now > Action->GetDeadline())
                {
                    DeleteThisAction = true;
                    Action->GetResult()->Fail("Timeout", "Timeout");
                }

                //Send timer event
                if(!DeleteThisAction)
                {
                    std::vector<std::string> SubscribbedEvents = Action->GetSubscribbedEvents();
                    if(std::find(SubscribbedEvents.begin(), SubscribbedEvents.end(), "Timer") != SubscribbedEvents.end())
                    {
                        Action->OnWebSocketEvent("Timer", std::string());
                    }
                }
            }

            if(DeleteThisAction)
            {
                it = Actions.erase(it);
            }else
            {
                ++it;
            }
        }
        
        // Process saved actions
        for(auto const& Tab : GlobalState.Tabs)
        {
            if(Tab->ConnectionState == TabData::WaitingForExecutingSavedActions)
            {
                std::vector<std::shared_ptr<IDevToolsAction> >::iterator it = Tab->SavedActions.begin();
                while(it != Tab->SavedActions.end())
                {
                    std::shared_ptr<IDevToolsAction> Action = *it;

                    bool DeleteThisAction = false;

                    if(Action->GetState() == IDevToolsAction::Running)
                    {
                        //Stop action if timeout
                        if(Action->GetDeadline() > 0 && Now > Action->GetDeadline())
                        {
                            DeleteThisAction = true;
                            Action->GetResult()->Fail("Timeout", "Timeout");
                        }
                    }

                    if(DeleteThisAction)
                    {
                        Action->SetState(IDevToolsAction::Finished);
                    }
                    ++it;
                    
                }
            }
        }

        if(GlobalState.ScrollX != PreviousScrollX || GlobalState.ScrollY != PreviousScrollY)
        {
            for(auto f:OnScroll)
                f();
        }

        if(GlobalState.Width != PreviousWidth || GlobalState.Height != PreviousHeight)
        {
            for(auto f:OnResize)
                f();
        }

    }
}

int DevToolsConnector::GenerateId()
{
    std::random_device random_device;
    std::mt19937 generator(random_device());
    std::uniform_int_distribution<> distribution(0xF, 0x7FFFFFFF);
    return distribution(generator);
}

std::vector<std::shared_ptr<IDevToolsAction> > DevToolsConnector::GetAllActions()
{
    std::vector<std::shared_ptr<IDevToolsAction> > AllActions = Actions;

    //Add saved actions
    for(auto const& Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::WaitingForExecutingSavedActions)
        {
            for(std::shared_ptr<IDevToolsAction> Action : Tab->SavedActions)
            {
                AllActions.push_back(Action);
            }
        }
    }

    return AllActions;
}

void DevToolsConnector::InsertAction(std::shared_ptr<IDevToolsAction> Action)
{
    ActionsSaver.ProcessAction(Action);
    
    //Run this action for each connected tab
    if(Action->IsNeedToRunForAllActiveTabs())
    {
        for(auto const& Tab : GlobalState.Tabs)
        {
            if(Tab->ConnectionState == TabData::Connected && Tab->TabId != GlobalState.TabId)
            {
                std::shared_ptr<IDevToolsAction> NewAction = ActionsSaver.CloneAction(Action);
                NewAction->SetOverrideDefaultTabId(Tab->TabId);
                NewAction->SetRunnningForAllRunActiveTab(true);
                NewAction->SetGroupId(Action->GetGroupId());
                Actions.push_back(NewAction);
            }
        }
    }

    Actions.push_back(Action);
}

int DevToolsConnector::SendWebSocket(const std::string& Method, const std::map<std::string, Variant>& Params, const std::string& SessionId)
{
    if(!GlobalState.WebSocketClient)
        return -1;

    picojson::value::object Data;
    picojson::value::object ParamsObject = Serializer.SerializeObjectToObject(Params);

    int Id = GenerateId();

    Data["id"] = picojson::value((double)Id);
    Data["method"] = picojson::value(Method);
    Data["params"] = picojson::value(ParamsObject);

    if(!SessionId.empty())
    {
        Data["sessionId"] = picojson::value(SessionId);
    }

    std::string DataString = picojson::value(Data).serialize();

    GlobalState.WebSocketClient->Send(DataString);

    return Id;
}

Async DevToolsConnector::GetTabsList(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction(ActionsFactory.Create("GetTabsList", &GlobalState));
    InsertAction(NewAction);
    NewAction->SetTimeout(Timeout);
    return NewAction->GetResult();
}

Async DevToolsConnector::GetCurrentUrl(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction(ActionsFactory.Create("GetCurrentUrl", &GlobalState));
    InsertAction(NewAction);
    NewAction->SetTimeout(Timeout);
    return NewAction->GetResult();
}

int DevToolsConnector::GetTabNumber()
{
    int Result = 0;
    for(auto const& Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::Connected || Tab->ConnectionState == TabData::Delayed)
        {
            Result++;
        } 
    }
    return Result;
}

int DevToolsConnector::GetCurrentTabIndex()
{
    int Result = 0;
    for(auto const& Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::Connected || Tab->ConnectionState == TabData::Delayed)
        {
            if(Tab->TabId == GlobalState.TabId)
            {
                return Result;
            }
            Result++;
        }
    }
    return -1;
}

Async DevToolsConnector::GetBrowserSize(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction(ActionsFactory.Create("GetBrowserSize", &GlobalState));
    InsertAction(NewAction);
    NewAction->SetTimeout(Timeout);
    return NewAction->GetResult();
}

Async DevToolsConnector::ResizeBrowser(int Width, int Height, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction(ActionsFactory.Create("ResizeBrowserWithCorrection", &GlobalState));
    std::map<std::string, Variant> Params;
    Params["bounds.width"] = Variant(Width);
    Params["bounds.height"] = Variant(Height);
    NewAction->SetParams(Params);
    InsertAction(NewAction);
    NewAction->SetTimeout(Timeout);
    return NewAction->GetResult();
}

Async DevToolsConnector::Screenshot(int X, int Y, int Width, int Height, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction(ActionsFactory.CreateWebsocketQuery("Page.captureScreenshot", &GlobalState,"data",DevToolsActionWebsocketQuery::String));
    std::map<std::string, Variant> Params;
    Params["clip.x"] = Variant(X);
    Params["clip.y"] = Variant(Y);
    Params["clip.width"] = Variant(Width);
    Params["clip.height"] = Variant(Height);
    Params["format"] = Variant(std::string("png"));
    Params["fromSurface"] = Variant(true);
    Params["clip.scale"] = Variant(1);
    NewAction->SetParams(Params);
    InsertAction(NewAction);
    NewAction->SetTimeout(Timeout);
    return NewAction->GetResult();
}

Async DevToolsConnector::StartScreenCast(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;

    NewAction.reset(ActionsFactory.Create("StartScreencast", &GlobalState));

    NewAction->SetTimeout(Timeout);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::StopScreenCast(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;

    NewAction.reset(ActionsFactory.Create("StopScreencast", &GlobalState));

    NewAction->SetTimeout(Timeout);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::Load(const std::string& Url, bool IsInstant, const std::string& Referrer, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("Load", &GlobalState));

    Params["instant"] = Variant(IsInstant);

    Params["url"] = Variant(std::string(Url));
    if(!Referrer.empty())
        Params["referrer"] = Variant(std::string(Referrer));

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::Reload(bool IsInstant, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("Reload", &GlobalState));

    Params["instant"] = Variant(IsInstant);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SetProxy(const std::string Server, int Port, bool IsHttp, const std::string Login, const std::string Password, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("SetProxy", &GlobalState));

    Params["server"] = Variant(Server);
    Params["port"] = Variant(Port);
    Params["is_http"] = Variant(IsHttp);
    Params["login"] = Variant(Login);
    Params["password"] = Variant(Password);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::GetHistory(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("GetHistory", &GlobalState));

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SetHeaders(const std::vector<std::pair<std::string, std::string>>& Headers, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;

    NewAction.reset(ActionsFactory.Create("SetHeaders", &GlobalState));

    std::map<std::string, Variant> Params;
    std::map<std::string, Variant> Object;

    for (const auto& Header : Headers)
    {
        Object[Header.first] = Variant(Header.second);
    }

    Params["headers"] = Variant(Object);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}


Async DevToolsConnector::NavigateBack(bool IsInstant, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("NavigateBack", &GlobalState));

    Params["instant"] = Variant(IsInstant);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}


Async DevToolsConnector::NavigateForward(bool IsInstant, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("NavigateForward", &GlobalState));

    Params["instant"] = Variant(IsInstant);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::CreateTab(const std::string& Url, bool IsInstant, bool IsDelayed, const std::string& Referrer, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("CreateTab", &GlobalState));

    Params["instant"] = Variant(IsInstant);

    Params["url"] = Variant(std::string(Url));

    Params["referrer"] = Variant(std::string(Referrer));

    Params["delayed"] = Variant(IsDelayed);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SwitchToTab(int Index, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    bool IsDelayed = false;
    std::string DelayedUrl;
    int CurrentIndex = 0;

    //Check if switching to delayed tab
    for(std::shared_ptr<TabData> Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::Connected || Tab->ConnectionState == TabData::Delayed)
        {
            if(CurrentIndex == Index)
            {
                IsDelayed = Tab->ConnectionState == TabData::Delayed;
                if(IsDelayed)
                {
                    DelayedUrl = Tab->DelayedUrl;
                }
                break;
            }
            CurrentIndex++;
        }
    }

    if(IsDelayed)
    {
        GlobalState.SwitchingToDelayedTabIndex = CurrentIndex;

        NewAction.reset(ActionsFactory.Create("CreateTab", &GlobalState));

        Params["instant"] = Variant(true);

        Params["url"] = Variant(DelayedUrl);

        Params["referrer"] = Variant(std::string());

        Params["delayed"] = Variant(false);
    }else
    {
        NewAction.reset(ActionsFactory.Create("SwitchToTab", &GlobalState));

        Params["index"] = Variant(Index);
    }

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::CloseTab(int Index, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("CloseTab", &GlobalState));

    Params["index"] = Variant(Index);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SetStartupScript(const std::string& Script, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("SetStartupScript", &GlobalState));

    Params["source"] = Variant(Script);
    
    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}
Async DevToolsConnector::ExecuteJavascript(const std::string& Script, const std::string& Variables, const std::string& ElementPath, bool ScrollToElement, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("ExecuteJavascript", &GlobalState));

    Params["expression"] = Variant(Script);
    Params["path"] = Variant(ElementPath);
    Params["variables"] = Variant(Variables);
    Params["do_scroll"] = Variant(ScrollToElement);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::Inspect(int X, int Y, int Position, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("Inspect", &GlobalState));

    Params["x"] = Variant(X);
    Params["y"] = Variant(Y);
    Params["position"] = Variant(Position);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SetRequestsRestrictions(const std::vector<std::pair<bool, std::string> >& Rules, int Timeout)
{
    GlobalState.BlockRequests.clear();
    for(const std::pair<bool, std::string>& Rule:Rules)
    {
        RequestRestriction RuleNative;
        RuleNative.IsAllow = Rule.first;
        RuleNative.Mask = Rule.second;
        GlobalState.BlockRequests.push_back(RuleNative);
    }

    std::shared_ptr<IDevToolsAction> NewAction;

    NewAction.reset(ActionsFactory.Create("SetRequestsRestrictions", &GlobalState));

    NewAction->SetTimeout(Timeout);

    InsertAction(NewAction);
    return NewAction->GetResult();
}


void DevToolsConnector::OnFetchRequestPaused(std::string& Result)
{
    std::string RequestUrl = Parser.GetStringFromJson(Result, "request.url");
    std::string RequestId = Parser.GetStringFromJson(Result, "requestId");

    bool Allow = true;

    for (const auto& Rule : GlobalState.BlockRequests)
    {
        if (match(Rule.Mask, RequestUrl))
        {
            Allow = Rule.IsAllow;
        }
    }

    std::map<std::string, Variant> Params = { {"requestId", Variant(RequestId)} };

    if (Allow)
    {
        SendWebSocket("Fetch.continueRequest", Params, GlobalState.TabId);
    }
    else
    {
        Params["errorReason"] = Variant(std::string("Failed"));
        SendWebSocket("Fetch.failRequest", Params, GlobalState.TabId);
    }

}

int DevToolsConnector::GetStatusForURL(const std::string& UrlPattern)
{
    for (const auto& urlPair : CachedUrls)
    {
        if (match(UrlPattern, urlPair.first))
        {
            return urlPair.second;
        }
    }

    return 0;
}

bool DevToolsConnector::IsURLLoaded(const std::string& UrlPattern)
{
    for (const auto& urlPair : CachedUrls)
    {
        if (match(UrlPattern, urlPair.first))
        {
            return true;
        }
    }

    return false;
}

void DevToolsConnector::Mouse(MouseEvent Event, int X, int Y, MouseButton Button, int MousePressed, int KeyboardPresses, int ClickCount)
{
    std::map<std::string, Variant> Params;
    std::string TypeName = "mousePressed";
    if(Event == MouseEventUp)
    {
        TypeName = "mouseReleased";
    } else if(Event == MouseEventMove)
    {
        TypeName = "mouseMoved";
    }

    std::string ButtonName = "left";
    if(Button == MouseButtonRight)
    {
        ButtonName = "right";
    } else if(Button == MouseButtonMiddle)
    {
        ButtonName = "middle";
    }else if(Button == MouseButtonNone)
    {
        ButtonName = "none";
    }
    Params["type"] = Variant(TypeName);
    Params["x"] = Variant(X);
    Params["y"] = Variant(Y);
    Params["modifiers"] = Variant(KeyboardPresses);
    Params["buttons"] = Variant(MousePressed);
    Params["button"] = Variant(ButtonName);
    Params["clickCount"] = Variant(ClickCount);
    
    SendWebSocket("Input.dispatchMouseEvent", Params, GlobalState.TabId);
}

void DevToolsConnector::Wheel(int X, int Y, bool IsUp, int Delta, int MousePressed, int KeyboardPresses)
{
    std::map<std::string, Variant> Params;
    std::string TypeName = "mouseWheel";
    std::string ButtonName = "none";
    Params["type"] = Variant(TypeName);
    Params["x"] = Variant(X);
    Params["y"] = Variant(Y);
    Params["modifiers"] = Variant(KeyboardPresses);
    Params["buttons"] = Variant(MousePressed);
    Params["button"] = Variant(ButtonName);
    Params["clickCount"] = Variant(0);
    Params["deltaY"] = Variant(Delta * ((IsUp) ? -1 : 1));
    Params["deltaX"] = Variant(0);
    SendWebSocket("Input.dispatchMouseEvent", Params, GlobalState.TabId);
}

void DevToolsConnector::Touch(TouchEvent Event, int X, int Y, int Id, double RadiusX, double RadiusY, double RotationAngle, double Pressure)
{
    std::map<std::string, Variant> Params;
    std::map<std::string, Variant> Point;
    std::string TypeName = "touchStart";
    if(Event == TouchEventUp)
    {
        TypeName = "touchEnd";
    } else if(Event == TouchEventMove)
    {
        TypeName = "touchMove";
    }

    Params["type"] = Variant(TypeName);
    Point["type"] = Variant(TypeName);
    Point["x"] = Variant(X);
    Point["y"] = Variant(Y);

    Point["radiusX"] = Variant(RadiusX);
    Point["radiusY"] = Variant(RadiusY);
    Point["rotationAngle"] = Variant(RotationAngle);
    Point["force"] = Variant(Pressure);
    Point["id"] = Variant(Id);

    
    std::vector<Variant> Points;
    Points.push_back(Variant(Point));
    Params["touchPoints"] = Variant(Points);
    
    SendWebSocket("Input.dispatchTouchEvent", Params, GlobalState.TabId);
}

void DevToolsConnector::Key(KeyEvent Event, const std::string& Char, int KeyboardPresses)
{
    if(EmulateKeyboard.IsKeyboardCharacter(Char))
    {
        std::map<std::string, Variant> Params = EmulateKeyboard.PrepareKeyboardEvent(Event, Char, KeyboardPresses);
        SendWebSocket("Input.dispatchKeyEvent", Params, GlobalState.TabId);
    } else
    {
        if(Event == KeyEventCharacter)
        {
            std::map<std::string, Variant> Params = EmulateKeyboard.PrepareSpecialCharacterEvent(Char);
            SendWebSocket("Input.insertText", Params, GlobalState.TabId);
        }
    }
}

void DevToolsConnector::KeyRaw(KeyEvent Event, WPARAM WindowsVirtualKeyCode, LPARAM NativeVirtualKeyCode, int KeyboardPresses)
{
    std::map<std::string, Variant> Params = EmulateKeyboard.PrepareRawKeyboardEvent(Event, WindowsVirtualKeyCode, NativeVirtualKeyCode, KeyboardPresses);
    SendWebSocket("Input.dispatchKeyEvent", Params, GlobalState.TabId);
}

bool DevToolsConnector::IsLoading()
{
    for(auto const& Tab : GlobalState.Tabs)
    {
        if(Tab->ConnectionState == TabData::Connected)
        {
            if(Tab->TabId == GlobalState.TabId)
            {
                return Tab->IsLoading;
            }
        }
    }
    return false;
}

Async DevToolsConnector::Reset(int Timeout)
{
    //Stop all actions
    for(std::shared_ptr<IDevToolsAction> Action : Actions)
    {
        Action->GetResult()->Fail("Action is stopped because of reset", "Reset");
    }
    Actions.clear();
    
    //If waiting for other reset action - stop it also
    if(ResetResult)
    {
        ResetResult->Fail("Action is stopped because of reset", "Reset");
        ResetResult.reset();
        ResetMethodDeadline = 0;
    }

    //Reset global state
    GlobalState.Reset();

    //Don't start to connect to port until browser will close
    ConnectionState = WaitingForBrowserClose;

    //Set deadline
    if(Timeout >= 0)
    {
        long long Now = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
        ResetMethodDeadline = Now + Timeout;
    } else
    {
        ResetMethodDeadline = 0;
    }

    //Send command to close browse
    std::map<std::string, Variant> Params;
    SendWebSocket("Browser.close", Params, std::string());

    //Return result
    ResetResult = std::make_shared<AsyncResult>();
    return ResetResult;
}

bool DevToolsConnector::InterruptAction(int ActionUniqueId)
{
    bool IsInterrupted = false;
    std::vector<std::shared_ptr<IDevToolsAction> >::iterator it = Actions.begin();
    while(it != Actions.end())
    {
        std::shared_ptr<IDevToolsAction> Action = *it;

        bool DeleteThisAction = false;

        if(Action->GetUniqueId() == ActionUniqueId && Action->GetState() != IDevToolsAction::Finished)
        {
            IsInterrupted = true;
            DeleteThisAction = true;
            Action->GetResult()->Interrupt();
        }

        if(DeleteThisAction)
        {
            it = Actions.erase(it);
        } else
        {
            ++it;
        }
    }
    return IsInterrupted;
    
}

void DevToolsConnector::SetOpenFileDialogResult(const std::string& Result)
{
    this->GlobalState.OpenFileDialogResult = Result;
}

void DevToolsConnector::SetOpenFileDialogManualMode(bool IsManual)
{
    this->GlobalState.OpenFileDialogIsManual = IsManual;
}

void DevToolsConnector::SetPromptResult(const std::string& PromptResult)
{
    this->GlobalState.PromptResult = PromptResult;
}

Async DevToolsConnector::AllowDownloads(int Timeout)
{
    GlobalState.IsDownloadsAllowed = true;
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction.reset(ActionsFactory.CreateWebsocketQuery("Browser.setDownloadBehavior",&GlobalState,std::string(),DevToolsActionWebsocketQuery::None));
    std::map<std::string, Variant> Params;

    Params["downloadPath"] = Variant(ws2s(GetRelativePathToParentFolder(L"")));
    Params["behavior"] = Variant(std::string("allowAndName"));

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}


Async DevToolsConnector::RestrictDownloads(int Timeout)
{
    GlobalState.IsDownloadsAllowed = false;
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction.reset(ActionsFactory.CreateWebsocketQuery("Browser.setDownloadBehavior",&GlobalState,std::string(),DevToolsActionWebsocketQuery::None));
    std::map<std::string, Variant> Params = NewAction->GetParams();

    Params["behavior"] = Variant(std::string("deny"));

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

bool DevToolsConnector::IsFileDownloadReady()
{
    return !GlobalState.IsDownloading && !GlobalState.CurrentDownloadFileName.empty();
}

std::string DevToolsConnector::GetDownloadedFilePath()
{
    std::string Res;
    if(IsFileDownloadReady())
    {
        Res = GlobalState.CurrentDownloadFileName;
        GlobalState.CurrentDownloadFileName.clear();
        GlobalState.IsDownloading = false;
    }
    return Res;
}


void DevToolsConnector::RestrictPopups()
{
    GlobalState.IsPopupsAllowed = false;
}

void DevToolsConnector::AllowPopups()
{
    GlobalState.IsPopupsAllowed = true;
}

void DevToolsConnector::ParseNewTabReferrer(const std::string& NewTabReferrer)
{
    std::string Prefix("http://referrer.bablosoft.com/#");
    if(starts_with(NewTabReferrer,Prefix))
    {
        GlobalState.NewTabReferrer = NewTabReferrer;
        GlobalState.NewTabReferrer.erase(0,Prefix.size());
    }else
    {
        GlobalState.NewTabReferrer.clear();
    }
}

Async DevToolsConnector::RestoreCookies(const std::string& Cookies, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction.reset(ActionsFactory.Create("RestoreCookies", &GlobalState));

    std::map<std::string, Variant> Params;
    Params["cookies"] = Variant(Cookies);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SaveCookies(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction.reset(ActionsFactory.Create("SaveCookies", &GlobalState));

    NewAction->SetTimeout(Timeout);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

