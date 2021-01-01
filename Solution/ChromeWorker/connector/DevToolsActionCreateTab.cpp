#include "DevToolsActionCreateTab.h"

void DevToolsActionCreateTab::Run()
{
    State = Running;

    IsInstant = Params["instant"].Boolean;
    Params.erase("instant");

    Referrer = Params["referrer"].String;
    Params.erase("referrer");

    Url = Params["url"].String;
    Params["url"].String = "chrome://newtab/";

    SubscribbedEvents.push_back("Target.targetActivated");
    
    
    
    SendWebSocket("Target.createTarget", Params);
}

void DevToolsActionCreateTab::StartLoad()
{
    if(IsInstant)
    {
        State = Finished;
        Result->Success();
    }

    std::map<std::string, Variant> CurrentParams;

    CurrentParams["url"] = Variant(Url);
    if(!Referrer.empty())
        CurrentParams["referrer"] = Variant(Referrer);

    SendWebSocket("Page.navigate", CurrentParams);

}


void DevToolsActionCreateTab::OnWebSocketMessage(const std::string& Message)
{
    if(!IsTargetCreated)
    {
        TargetId = GetStringFromJson(Message, "targetId");
        IsTargetCreated = true;
        if(IsTabConnected)
        {
            StartLoad();
            return;
        }
    } else
    {
        std::string ErrorText = GetStringFromJson(Message, "errorText", "BAS_NO_VALUE");
        if(ErrorText == "BAS_NO_VALUE")
        {
            SubscribbedEvents.push_back("Page.frameStoppedLoading");
            return;
        }

        Result->Fail(ErrorText);
        State = Finished;
    }
}

void DevToolsActionCreateTab::OnWebSocketEvent(const std::string& Method, const std::string& Message)
{
    if(Method == "Target.targetActivated")
    {
        std::string TargetIdCandidate = GetStringFromJson(Message, "targetInfo.targetId");
        if(!IsTabConnected && TargetIdCandidate == TargetId)
        {
            IsTabConnected = true;
            if(IsTargetCreated)
            {
                StartLoad();
                return;
            }
        }
    }

    if(Method == "Page.frameStoppedLoading")
    {
        std::string CurrentLoaderId = GetStringFromJson(Message, "frameId");
        if(TargetId == CurrentLoaderId)
        {
            Result->Success();
            State = Finished;
        }
    }
}
