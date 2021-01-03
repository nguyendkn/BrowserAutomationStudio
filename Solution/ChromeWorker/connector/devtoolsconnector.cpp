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

using namespace std::placeholders;
using namespace std::chrono;


void DevToolsConnector::Initialize
(
        std::shared_ptr<ISimpleHttpClientFactory> SimpleHttpClientFactory,
        std::shared_ptr<IWebSocketClientFactory> WebSocketClientFactory,
        int Port, const std::string& UniqueProcessId, const std::string& ParentProcessId, const std::string& ChromeExecutableLocation
)
{
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
}

void DevToolsConnector::SetProfilePath(const std::wstring& Path)
{
    this->ProfilePath = Path;
}

void DevToolsConnector::SetExtensionList(const std::vector<std::wstring>& Extensions)
{
    this->Extensions = Extensions;
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
    GlobalState.WebSocketClient->Send(std::string("{\"id\": 1,\"method\": \"Target.setAutoAttach\", \"params\": {\"autoAttach\": true, \"waitForDebuggerOnStart\": false, \"flatten\": true}}"));

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

            if(!Tab->InterceptId.empty())
            {
                std::map<std::string, Variant> Params;
                Params["requestId"] = Variant(Tab->InterceptId);
                Tab->CurrentWebsocketActionId = SendWebSocket("Fetch.continueRequest", Params, std::string());
            }
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
        
        //Intercept screencast event, replace it with OnPaint event
        if(Method == "Page.screencastFrame")
        {
            if(AllObject["params"].is<picojson::object>())
            {

                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                if(ResultObject["data"].is<std::string>())
                {
                    std::string Data = ResultObject["data"].get<std::string>();
                    for(auto f:OnPaint)
                        f(Data);
                }
            }
        }else if(Method == "Fetch.requestPaused") 
        {
            
            if (AllObject["params"].is<picojson::object>())
            {
                if(!AllObject["sessionId"].is<std::string>())
                {
                    //In case if there is no sessionId attr, this event is generated when creating new tab.
                    std::string FrameId = Parser.GetStringFromJson(Message, "params.frameId");
                    std::string InterceptId = Parser.GetStringFromJson(Message, "params.requestId");
                    for(auto const& Tab : GlobalState.Tabs)
                    {
                        if(Tab->FrameId == FrameId)
                        {
                            if(Tab->ConnectionState == TabData::Connected)
                            {
                                std::map<std::string, Variant> Params;
                                Params["requestId"] = Variant(InterceptId);
                                Tab->CurrentWebsocketActionId = SendWebSocket("Fetch.continueRequest", Params, std::string());
                            } else
                            {
                                Tab->InterceptId = InterceptId;
                            }
                            break;
                        }
                    }
                } else
                {
                    //This event is generated by using Fetch.enable
                    picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                    std::string Result = picojson::value(ResultObject).serialize();
                    OnFetchRequestPaused(Result);
                }
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
        } else if(Method == "Target.attachedToTarget")
        {
            //New tab has been created, start initialization of new tab
            if(AllObject["params"].is<picojson::object>())
            {
                picojson::object ResultObject = AllObject["params"].get<picojson::object>();
                std::string Result = picojson::value(ResultObject).serialize();

                std::string TabId = Parser.GetStringFromJson(Result, "sessionId");
                std::string FrameId = Parser.GetStringFromJson(Result, "targetInfo.targetId");
                std::string TypeName = Parser.GetStringFromJson(Result, "targetInfo.type");

                if(TypeName == "page")
                {
                    std::shared_ptr<TabData> TabInfo = std::make_shared<TabData>();
                    TabInfo->ConnectionState = TabData::NotStarted;
                    TabInfo->FrameId = FrameId;
                    TabInfo->TabId = TabId;
                    GlobalState.Tabs.push_back(TabInfo);
                    GlobalState.SwitchToTabId = TabId;
                    GlobalState.SwitchToTabFrameId = FrameId;
                    GlobalState.SwitchToTabResetSavedActions = false;
                    ProcessTabConnection(TabInfo);
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
            }
        }
        return;
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
                Tab->ConnectionState = TabData::WaitingForNetworkEnable;
                Tab->IsSwitchingToTab = true;
                GlobalState.SwitchToTabResetSavedActions = false;
                ProcessTabConnection(Tab);
            }
            if(Tab->ConnectionState == TabData::Connected)
            {
                GlobalState.TabId = Tab->TabId;

                //Generate Target.targetActivated event. This event doesn't exist in Chrome Developer tools protocol.
                std::string TabId = GlobalState.SwitchToTabId;
                std::string FrameId = GlobalState.SwitchToTabFrameId;
                std::string Method = "Target.targetActivated";
                GlobalState.SwitchToTabId.clear();
                GlobalState.SwitchToTabFrameId.clear();

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
        if(Tab->ConnectionState == TabData::Connected)
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
        if(Tab->ConnectionState == TabData::Connected)
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
    std::shared_ptr<IDevToolsAction> NewAction(ActionsFactory.Create("ResizeBrowser", &GlobalState));
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


Async DevToolsConnector::CreateTab(const std::string& Url, bool IsInstant, const std::string& Referrer, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("CreateTab", &GlobalState));

    Params["instant"] = Variant(IsInstant);

    Params["url"] = Variant(std::string(Url));

    Params["referrer"] = Variant(std::string(Referrer));

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::SwitchToTab(int Index, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("SwitchToTab", &GlobalState));

    Params["index"] = Variant(Index);

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
Async DevToolsConnector::ExecuteJavascript(const std::string& Script, const std::string& Variables, const std::string& ElementPath, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("ExecuteJavascript", &GlobalState));

    Params["expression"] = Variant(Script);
    Params["path"] = Variant(ElementPath);
    Params["variables"] = Variant(Variables);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async DevToolsConnector::RequestDeny(const std::vector<std::string>& Urls, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    std::map<std::string, Variant> Params;

    NewAction.reset(ActionsFactory.Create("RequestDeny", &GlobalState));
    
    std::set<std::string> BlockingRequestsUrls;
    std::copy(Urls.begin(), Urls.end(), std::inserter(BlockingRequestsUrls, BlockingRequestsUrls.end()));
    std::vector<Variant> Patterns;

    for(const auto& i : BlockingRequestsUrls)
    {
        std::map<std::string, Variant> Map;
        Map["urlPattern"] = Variant(i);
        Patterns.push_back(Map);
    }

    Params["patterns"] = Variant(Patterns);
    Params["handleAuthRequests"] = Variant(false);

    NewAction->SetTimeout(Timeout);
    NewAction->SetParams(Params);

    InsertAction(NewAction);
    return NewAction->GetResult();
}

void DevToolsConnector::OnFetchRequestPaused(std::string& Result)
{
    picojson::value Request;
    picojson::parse(Request, Result);
    picojson::object Object = Request.get<picojson::object>();
    std::string RequestId = Object["requestId"].get<std::string>();
    std::string RequestUrl = Object["request"].get("url").get<std::string>();

    std::map<std::string, Variant> Params;
    Params["errorReason"] = Variant(std::string("Aborted"));
    Params["requestId"] = Variant(RequestId);
    SendWebSocket("Fetch.failRequest", Params, GlobalState.TabId);
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

void DevToolsConnector::Touch(TouchEvent Event, int X, int Y, double RadiusX, double RadiusY, double RotationAngle, double Pressure)
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

    
    std::vector<Variant> Points;
    Points.push_back(Variant(Point));
    Params["touchPoints"] = Variant(Points);
    
    SendWebSocket("Input.dispatchTouchEvent", Params, GlobalState.TabId);
}

void DevToolsConnector::Key(KeyEvent Event, const std::string& Char, int KeyboardPresses)
{
    std::map<std::string, Variant> Params = EmulateKeyboard.PrepareKeyboardEvent(Event, Char, KeyboardPresses);
    SendWebSocket("Input.dispatchKeyEvent", Params, GlobalState.TabId);
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