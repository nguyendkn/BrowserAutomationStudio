#include "DevToolsActionSetHeaders.h"

void DevToolsActionSetHeaders::Run()
{
    State = Running;
    SendWebSocket("Network.setExtraHTTPHeaders", Params);
}

IDevToolsAction::ActionSaverBehavior DevToolsActionSetHeaders::GetActionSaverBehavior()
{
    return IDevToolsAction::SaveClearSameType;
}

bool DevToolsActionSetHeaders::IsNeedToRunForAllActiveTabs()
{
    return true;
}

void DevToolsActionSetHeaders::OnTabSwitching()
{

}

void DevToolsActionSetHeaders::OnTabCreation()
{
    Run();
}

void DevToolsActionSetHeaders::OnWebSocketMessage(const std::string& Message, const std::string& Error)
{
    Result->Success();
    State = Finished;
}