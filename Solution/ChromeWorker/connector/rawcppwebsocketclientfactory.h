#ifndef RAWCPPWEBSOCKETCLIENTFACTORY_H
#define RAWCPPWEBSOCKETCLIENTFACTORY_H


#include "IWebSocketClientFactory.h"

class RawCppWebSocketClientFactory: public IWebSocketClientFactory
{
    public:
    virtual IWebSocketClient* Create();
};

#endif // RAWCPPWEBSOCKETCLIENTFACTORY_H
