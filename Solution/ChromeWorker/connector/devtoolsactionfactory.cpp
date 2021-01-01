#include "devtoolsactionfactory.h"
#include "devtoolsactiongettabs.h"
#include "DevToolsActionSwitchToTab.h"
#include "devtoolsactionload.h"
#include "devtoolsactiongetbrowsersize.h"
#include "devtoolsactionresizebrowser.h"
#include "devtoolsactionsetstartupscript.h"
#include "devtoolsactionexecutejavascript.h"
#include "DevToolsActionCreateTab.h"
#include "DevToolsActionCloseTab.h"
#include "DevToolsActionStartScreenCast.h"
#include "DevToolsActionStopScreenCast.h"
#include "DevToolsActionRequestDeny.h"
#include "DevToolsActionGetCurrentUrl.h"
#include "DevToolsActionNavigateBack.h"
#include "DevToolsActionSetProxy.h"
#include <random>

int DevToolsActionFactory::Rand()
{
    std::random_device random_device;
    std::mt19937 generator(random_device());
    std::uniform_int_distribution<> distribution(0xF, 0x7FFFFFFF);
    return distribution(generator);
}

IDevToolsAction* DevToolsActionFactory::Create(const std::string& Name, DevToolsGlobalState* GlobalState)
{

    IDevToolsAction* Result = 0;
    if(Name == "GetTabsList")
    {
        Result = new DevToolsActionGetTabs();
    }else if(Name == "Load")
    {
        Result = new DevToolsActionLoad();
    }else if(Name == "GetBrowserSize")
    {
        Result = new DevToolsActionGetBrowserSize();
    }else if(Name == "ResizeBrowser")
    {
        Result = new DevToolsActionResizeBrowser();
    }else if (Name == "SetStartupScript")
    {
        Result = new DevToolsActionSetStartupScript();
    }else if (Name == "ExecuteJavascript")
    {
        Result = new DevToolsActionExecuteJavascript();
    }else if(Name == "CreateTab")
    {
        Result = new DevToolsActionCreateTab();
    } else if(Name == "SwitchToTab")
    {
        Result = new DevToolsActionSwitchToTab();
    } else if(Name == "CloseTab")
    {
        Result = new DevToolsActionCloseTab();
    } else if(Name == "StartScreencast")
    {
        Result = new DevToolsActionStartScreenCast();
    } else if(Name == "StopScreencast")
    {
        Result = new DevToolsActionStopScreenCast();
    } else if(Name == "RequestDeny")
    {
        Result = new DevToolsActionRequestDeny();
    } else if(Name == "GetCurrentUrl")
    {
        Result = new DevToolsActionGetCurrentUrl();
    } else if(Name == "NavigateBack")
    {
        Result = new DevToolsActionNavigateBack();
    } else if(Name == "SetProxy")
    {
        Result = new DevToolsActionSetProxy();
    }

    if(Result)
    {
        Result->Initialize(Name);
        Result->SetId(Rand());
        Result->SetGroupId(Rand());
        Result->SetGlobalState(GlobalState);
    }

    return Result;
}

IDevToolsAction* DevToolsActionFactory::CreateWebsocketQuery(const std::string& WebSocketMethod, DevToolsGlobalState* GlobalState, const std::string& ReturnPath, DevToolsActionWebsocketQuery::WebsocketQueryReturnType ReturnType)
{
    DevToolsActionWebsocketQuery* Result = new DevToolsActionWebsocketQuery();

    Result->Initialize("WebsocketQuery");

    std::map<std::string, Variant> Params;

    Params["WebSocketMethod"] = Variant(WebSocketMethod);
    Params["ReturnPath"] = Variant(ReturnPath);
    std::string ReturnTypeString;
    if(ReturnType == DevToolsActionWebsocketQuery::None)
    {
        ReturnTypeString = "None";
    }else if(ReturnType == DevToolsActionWebsocketQuery::String)
    {
        ReturnTypeString = "String";
    }else if(ReturnType == DevToolsActionWebsocketQuery::Bool)
    {
        ReturnTypeString = "Bool";
    }else if(ReturnType == DevToolsActionWebsocketQuery::Number)
    {
        ReturnTypeString = "Number";
    }
    Params["ReturnType"] = Variant(ReturnTypeString);

    Result->SetParams(Params);
    Result->SetGlobalState(GlobalState);
    Result->SetId(Rand());
    Result->SetGroupId(Rand());

    return Result;
}
