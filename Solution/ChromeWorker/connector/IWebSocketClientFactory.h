#ifndef IWEBSOCKETCLIENTFACTORY_H
#define IWEBSOCKETCLIENTFACTORY_H

#include "IWebSocketClient.h"


class IWebSocketClientFactory
{
    public:
    virtual IWebSocketClient* Create() = 0;
};

#endif // IWEBSOCKETCLIENTFACTORY_H
