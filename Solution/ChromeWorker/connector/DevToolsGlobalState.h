#ifndef DEVTOOLSGLOBALSTATE_H
#define DEVTOOLSGLOBALSTATE_H

#include "IWebSocketClientFactory.h"
#include "ISimpleHttpClientFactory.h"
#include <memory>
#include <map>

class IDevToolsAction;

struct TabData
{
    enum
    {
        NotStarted,
        WaitingForAttachment,
        WaitingForPageEnable,
        WaitingForRuntimeEnable,
        WaitingForNetworkEnable,
        WaitingForExecutingSavedActions,
        Connected
    }ConnectionState = NotStarted;
    bool IsSwitchingToTab = false;
    std::string TabId;
    std::string FrameId;
    std::string InterceptId;
    std::vector<std::shared_ptr<IDevToolsAction> > SavedActions;
    int CurrentWebsocketActionId = 0;
};

struct StartupScriptItem
{
    std::string ScriptId;
    std::string TabId;
    int GroupId;
};

struct DevToolsGlobalState
{
    std::shared_ptr<ISimpleHttpClient> HttpClient;
    std::shared_ptr<IWebSocketClient> WebSocketClient;
    std::string TabId;
    std::string SwitchToTabId;
    std::string SwitchToTabFrameId;
    bool SwitchToTabResetSavedActions = false;
    int Port = -1;
    std::vector<StartupScriptItem> StartupScriptIds;
    std::map<std::string, int> FrameIdToContextId;
    std::vector<std::shared_ptr<TabData> > Tabs;

    //Settings to change proxy
    std::string UniqueProcessId;
    std::string ParentProcessId;
    std::string ChromeExecutableLocation;

    //Tab states
    std::string ScreenCastTabId;

    //This method is called when restarting browser
    void Reset();
};

#endif // DEVTOOLSGLOBALSTATE_H
