#include "DevToolsActionSetHeaders.h"

void DevToolsActionSetHeaders::Run()
{
    State = Running;
    IsSettingHeaders = true;
    IsSettingUA = false;
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
    if(IsSettingHeaders)
    {
        bool HasUAHeader = false;
        std::string UAString;

        std::map<std::string, Variant> AllHeaders = Params["headers"].Map;

        for(auto& Header: AllHeaders)
        {
            if(Header.first == "User-Agent")
            {
                HasUAHeader = true;
                UAString = Header.second.String;
            }
        }

        if(!HasUAHeader)
        {
            Result->Success();
            State = Finished;
        }else
        {
            std::map<std::string, Variant> CurrentParams;
            CurrentParams["userAgent"] = Variant(UAString);
            IsSettingHeaders = false;
            IsSettingUA = true;
            SendWebSocket("Network.setUserAgentOverride", CurrentParams);

        }

    }

    if(IsSettingUA)
    {
        Result->Success();
        State = Finished;
    }

}
