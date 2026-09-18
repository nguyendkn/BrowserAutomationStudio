#pragma once
#include <string>
#include <memory>
#include <functional>
#include <mutex>
#include <vector>
#include <chrono>
namespace ix {
  enum class WebSocketMessageType { Message, Open, Close, Error, Ping, Pong, Fragment };
  struct WebSocketMessage { WebSocketMessageType type=WebSocketMessageType::Message; std::string str; std::string errorInfo; };
  using WebSocketMessagePtr = std::shared_ptr<WebSocketMessage>;
  class WebSocket {
  public:
    void setUrl(const std::string&){}
    void disablePerMessageDeflate(){}
    void setOnMessageCallback(std::function<void(WebSocketMessagePtr)>){}
    void start(){}
    void stop(){}
    void send(const std::string&){}
  };
}
