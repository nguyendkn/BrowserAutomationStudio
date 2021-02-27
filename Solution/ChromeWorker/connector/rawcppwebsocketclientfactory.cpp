#include "rawcppwebsocketclientfactory.h"
#include "rawcppwebsocketclient.h"

IWebSocketClient* RawCppWebSocketClientFactory::Create()
{
    return new RawCppWebSocketClient();
}

