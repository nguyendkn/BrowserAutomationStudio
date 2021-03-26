#include "DevToolsActionSetHeaders.h"
#include "base64.h"

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
            if(!GlobalState->UserAgentData.empty())
            {
                std::string UserAgentDataRaw = base64_decode(GlobalState->UserAgentData);

                std::map<std::string, Variant> UserAgentDataMap;
                UserAgentDataMap["fullVersion"] = Variant(Parser.GetStringFromJson(UserAgentDataRaw,"fullVersion"));
                UserAgentDataMap["platform"] = Variant(Parser.GetStringFromJson(UserAgentDataRaw,"platform"));
                UserAgentDataMap["platformVersion"] = Variant(Parser.GetStringFromJson(UserAgentDataRaw,"platformVersion"));
                UserAgentDataMap["architecture"] = Variant(Parser.GetStringFromJson(UserAgentDataRaw,"architecture"));
                UserAgentDataMap["model"] = Variant(Parser.GetStringFromJson(UserAgentDataRaw,"model"));
                UserAgentDataMap["mobile"] = Variant(Parser.GetBooleanFromJson(UserAgentDataRaw,"mobile"));

                std::vector<Variant> Brands;

                bool IsBrandsParsed = false;

                picojson::value CurrentValue;
                try
                {
                    picojson::parse(CurrentValue, UserAgentDataRaw);
                    IsBrandsParsed = true;
                }
                catch (...)
                {
                    IsBrandsParsed = false;
                }

                if(IsBrandsParsed)
                {
                    if (CurrentValue.is<picojson::value::object>())
                    {
                        picojson::value::object CurrentObject = CurrentValue.get<picojson::value::object>();
                        if (CurrentObject.count("brands") > 0)
                        {
                            CurrentValue = CurrentObject["brands"];
                            if (CurrentValue.is<picojson::value::array>())
                            {
                                picojson::value::array CurrentArray = CurrentValue.get<picojson::value::array>();
                                for(picojson::value& CurrentBrandValue: CurrentArray)
                                {
                                    if (CurrentBrandValue.is<picojson::value::object>())
                                    {
                                        picojson::value::object CurrentBrandObject = CurrentBrandValue.get<picojson::value::object>();
                                        if(CurrentBrandObject.count("brand") > 0 && CurrentBrandObject.count("version") > 0)
                                        {
                                            std::map<std::string, Variant> CurrentBrandMap;
                                            CurrentBrandMap["brand"] = Variant(CurrentBrandObject["brand"].get<std::string>());
                                            CurrentBrandMap["version"] = Variant(CurrentBrandObject["version"].get<std::string>());
                                            Brands.push_back(Variant(CurrentBrandMap));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                UserAgentDataMap["brands"] = Variant(Brands);

                CurrentParams["userAgentMetadata"] = Variant(UserAgentDataMap);
            }
            IsSettingHeaders = false;
            IsSettingUA = true;
            SendWebSocket("Network.setUserAgentOverride", CurrentParams);

        }

    }

    if(IsSettingUA)
    {
        GlobalState->IsUserAgentChanged = true;
        Result->Success();
        State = Finished;
    }

}
