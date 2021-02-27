#ifndef RAWCPPWEBSOCKETCLIENT_H
#define RAWCPPWEBSOCKETCLIENT_H

#include "IWebSocketClient.h"
#include "ixwebsocket/IXWebSocket.h"
#include <memory>

class RawCppWebSocketClient : public IWebSocketClient
{
    std::shared_ptr<ix::WebSocket> WebSocket = 0;

    enum MessageType
    {
        ReceivedMessage,
        Connection,
        Disconnected
    };

    struct MessageClass
    {
        MessageType Type;
        std::string Data;
        bool IsSuccess;
    };

    std::mutex DataMutex;
    std::vector<MessageClass> Messages;

    long long ConnectionStart = 0;

public:
    ~RawCppWebSocketClient();
    virtual void Connect(const std::string& Url);
    virtual void Disconnect();
    virtual void Send(const std::string& Data);

    virtual void Timer();

    virtual void GlobalActivate();
    virtual void GlobalDeactivate();

private:
    void OnMessageFunction(const ix::WebSocketMessagePtr& Message);
    long long Now();

};

#endif // RAWCPPWEBSOCKETCLIENT_H
