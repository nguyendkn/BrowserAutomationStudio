#include "DevToolsActionSetRequestsRestrictions.h"

void DevToolsActionSetRequestsRestrictions::OnWebSocketMessage(const std::string& Message, const std::string& Error)
{
    Result->Success();
    State = Finished;
}

IDevToolsAction::ActionSaverBehavior DevToolsActionSetRequestsRestrictions::GetActionSaverBehavior()
{
    return IDevToolsAction::SaveClearSameType;
}

bool DevToolsActionSetRequestsRestrictions::IsNeedToRunForAllActiveTabs()
{
    return true;
}

void DevToolsActionSetRequestsRestrictions::OnTabSwitching()
{

}

void DevToolsActionSetRequestsRestrictions::OnTabCreation()
{
    Run();
}

void DevToolsActionSetRequestsRestrictions::RemoveDuplicates(std::vector<RequestRestriction>& Rules)
{
    while(true)
    {
        bool changed = false;

        size_t size = Rules.size();

        for (int curr = size - 1; curr >= 0; curr--)
        {
            auto currRule = Rules[curr];

            for (int prev = curr - 1; prev >= 0; prev--)
            {
                auto prevRule = Rules[prev];

                if (match(currRule.Mask, prevRule.Mask))
                {
                    Rules.erase(Rules.begin() + prev);
                    changed = true;
                    break;
                }
            }
        }
        if(!changed)
            break;
    }
}



void DevToolsActionSetRequestsRestrictions::Run()
{
    State = Running;

    std::vector<RequestRestriction> Rules;

    for (RequestRestriction& Rule : GlobalState->BlockRequests)
    {
        if(!Rule.IsAllow)
        {
            Rules.push_back(Rule);
        }
    }

    for (RequestRestriction& Rule : GlobalState->CacheCapture)
    {
        if(Rule.IsAllow)
        {
            Rules.push_back(Rule);
        }
    }

    RemoveDuplicates(Rules);

    std::vector<Variant> Patterns;

    for (RequestRestriction& Rule : Rules)
    {
        std::map<std::string, Variant> Pattern = {};
        Pattern["urlPattern"] = Variant(Rule.Mask);
        Patterns.push_back(Variant(Pattern));
    }


    if (Patterns.empty())
    {
        SendWebSocket("Fetch.disable", Params);
    }
    else
    {
        Params["patterns"] = Variant(Patterns);
        SendWebSocket("Fetch.enable", Params);
    }
}
