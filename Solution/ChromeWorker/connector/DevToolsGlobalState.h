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
        Delayed,
        NotStarted,
        WaitingForAttachment,
        WaitingForPageEnable,
        WaitingForRuntimeEnable,
        WaitingForNetworkEnable,
        WaitingForSettingStartupScript,
        WaitingForPageReloadForFirstTab,
        WaitingForExecutingSavedActions,
        Connected
    }ConnectionState = NotStarted;
    bool IsSwitchingToTab = false;
    std::string TabId;
    std::string FrameId;
    bool IsLoading = false;
    std::string InterceptId;
    std::vector<std::shared_ptr<IDevToolsAction> > SavedActions;
    int CurrentWebsocketActionId = 0;
    std::string DelayedUrl;
    std::string CurrentUrl;
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
    int SwitchingToDelayedTabIndex = -1;
    int Port = -1;
    std::vector<StartupScriptItem> StartupScriptIds;
    std::map<std::string, int> FrameIdToContextId;
    std::vector<std::shared_ptr<TabData> > Tabs;

    int ScrollX = -1;
    int ScrollY = -1;

    int Width = -1;
    int Height = -1;

    int WidthDifference = 16;
    int HeightDifference = 88;

    //Settings to change proxy
    std::string UniqueProcessId;
    std::string ParentProcessId;
    std::string ChromeExecutableLocation;
    std::string ConstantStartupScript;

    //Tab states
    std::string ScreenCastTabId;

    //Dialogs data
    std::string OpenFileDialogResult;
    bool OpenFileDialogIsManual = false;

    //This method is called when restarting browser
    void Reset();
};

#endif // DEVTOOLSGLOBALSTATE_H
