#ifndef DEVTOOLSGLOBALSTATE_H
#define DEVTOOLSGLOBALSTATE_H

#include "IWebSocketClientFactory.h"
#include "ISimpleHttpClientFactory.h"
#include "RequestRestriction.h"
#include <memory>
#include <map>
#include "CachedItem.h"

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
    std::vector<std::shared_ptr<IDevToolsAction> > SavedActions;
    int CurrentWebsocketActionId = 0;
    std::string DelayedUrl;
    std::string CurrentUrl;

    bool IsWaitingForFirstUrl = false;
    std::string FirstUrl;
};

struct StartupScriptItem
{
    std::string ScriptId;
    std::string TabId;
    int GroupId;
};

struct ExtensionInfo
{
    std::string Id;
    std::string Name;
    std::string FrameId;
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
    std::string WindowOpenNewTabUrl;
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
    bool IsProxySet = false;

    //Tab states
    std::string ScreenCastTabId;

    //Dialogs data
    std::string OpenFileDialogResult;
    bool OpenFileDialogIsManual = false;
    std::string PromptResult;

    //Download data
    std::string CurrentDownloadFileName;
    bool IsDownloading = false;
    bool IsDownloadsAllowed = true;

    //Data for fetch.enable
    std::vector<RequestRestriction> BlockRequests;
    std::vector<RequestRestriction> CacheCapture;

    //Popups
    bool IsPopupsAllowed = true;

    //Load next URL after new tab was created
    std::string LoadNextTargetId;
    std::string LoadNextUrl;
    bool LoadNext = false;
    std::string LoadNextData;

    //Cache data
    std::map<std::string, std::shared_ptr<CachedItem>> CachedData;
    std::map<int, std::string> CachedRequests;

    //URL - status
    std::map<std::string, int> LoadedUrls;

    //User agent data
    bool IsUserAgentChanged = false;
    std::string UserAgentData;

    //List of currently active extensions
    std::vector<std::shared_ptr<ExtensionInfo> > ExtensionList;

    bool IsDeviceScaleFactorModified = false;

    //This method is called when restarting browser
    void Reset();
};

#endif // DEVTOOLSGLOBALSTATE_H
