#include "devtoolsactiondialogresult.h"
#include <chrono>

using namespace std::chrono;

void DevToolsActionDialogResult::Run()
{
    //Parse params
    TypeString = Params["type"].String;
    Params.erase("type");


    FinishActionTime = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() + 1000;
    SubscribbedEvents.push_back("Timer");
    State = Running;

}


void DevToolsActionDialogResult::OnWebSocketEvent(const std::string& Method, const std::string& Message)
{

    if(Method == "Timer")
    {
        long long Now = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
        if(Now > FinishActionTime)
        {

            std::map<std::string, Variant> CurrentParams;
            CurrentParams["accept"] = Variant(true);

            if (TypeString == "prompt")
            {
                CurrentParams["promptText"] = Variant(GlobalState->PromptResult);
            }

            SendWebSocket("Page.handleJavaScriptDialog", CurrentParams);


            State = Finished;
            Result->Success();
        }
    }

}
