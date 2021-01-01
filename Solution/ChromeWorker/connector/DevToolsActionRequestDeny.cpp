#include "DevToolsActionRequestDeny.h"

#include "DevToolsActionStartScreenCast.h"

void DevToolsActionRequestDeny::Run()
{
    State = Running;

    if(Params["patterns"].List.empty())
    {
        std::map<std::string, Variant> CurrentParams;
        SendWebSocket("Fetch.disable", CurrentParams);
    } else
    {
        SendWebSocket("Fetch.enable", Params);
    }
}

IDevToolsAction::ActionSaverBehavior DevToolsActionRequestDeny::GetActionSaverBehavior()
{
    return IDevToolsAction::SaveClearSameType;
}

bool DevToolsActionRequestDeny::IsNeedToRunForAllActiveTabs()
{
    return true;
}

void DevToolsActionRequestDeny::OnTabCreation()
{
    Run();
}

void DevToolsActionRequestDeny::OnTabSwitching()
{
    
}

void DevToolsActionRequestDeny::OnWebSocketMessage(const std::string& Message)
{
    Result->Success();
    State = Finished;
}