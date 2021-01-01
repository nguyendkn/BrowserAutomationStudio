#include "devtoolsactionwebsocketquery.h"

void DevToolsActionWebsocketQuery::Run()
{
    State = Running;

    Variant ReturnTypeVariant = Params["ReturnType"];

    if(ReturnTypeVariant.String == "String")
        ReturnType = String;

    if(ReturnTypeVariant.String == "Bool")
        ReturnType = Bool;

    if(ReturnTypeVariant.String == "Number")
        ReturnType = Number;

    if(ReturnTypeVariant.String == "None")
        ReturnType = None;

    WebSocketMethod = Params["WebSocketMethod"].String;
    ReturnPath = Params["ReturnPath"].String;

    SendWebSocket(WebSocketMethod,Params);


}

void DevToolsActionWebsocketQuery::OnWebSocketMessage(const std::string& Message)
{
    if(ReturnType == String)
    {
        Result->Success(GetStringFromJson(Message, ReturnPath));
    }else if(ReturnType == Bool)
    {
        Result->Success(GetBooleanFromJson(Message, ReturnPath));
    }else if(ReturnType == Number)
    {
        Result->Success((int)GetFloatFromJson(Message, ReturnPath));
    }

    State = Finished;
}
