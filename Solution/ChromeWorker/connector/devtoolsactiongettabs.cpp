#include "devtoolsactiongettabs.h"
#include "json/picojson.h"


void DevToolsActionGetTabs::Run()
{
    State = Running;
    SendWebSocket("Target.getTargets", Params);
}

void DevToolsActionGetTabs::OnWebSocketMessage(const std::string& Message, const std::string& Error)
{
    std::vector<std::string> ListValue;

    picojson::value AllValue;
    picojson::parse(AllValue, Message);
    picojson::array AllList = AllValue.get<picojson::object>()["targetInfos"].get<picojson::array>();

    for(std::shared_ptr<TabData> Tab : this->GlobalState->Tabs)
    {
        //Only tab in state Connected is visible to client
        if(Tab->ConnectionState == TabData::Connected)
        {
            std::string CurrentUrl;
            for(picojson::value& Value : AllList)
            {
                picojson::object ValueObject = Value.get<picojson::object>();
                if(ValueObject["attached"].get<bool>() && ValueObject["type"].get<std::string>() == "page" && ValueObject["targetId"].get<std::string>() == Tab->FrameId)
                {
                    std::string Url = ValueObject["url"].get<std::string>();
                    CurrentUrl = Url;
                }
            }
            ListValue.push_back(CurrentUrl);
        }
    }

    Result->Success(ListValue);
    State = Finished;
}

