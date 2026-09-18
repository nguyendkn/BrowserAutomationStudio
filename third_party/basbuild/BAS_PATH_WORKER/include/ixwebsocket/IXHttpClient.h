#pragma once
#include <string>
#include <memory>
#include <functional>
#include <mutex>
#include <vector>
namespace ix {
  enum HttpErrorCode { Ok=0, CannotConnect=1, Timeout=2 };
  struct HttpResponse { std::string body; int statusCode=0; HttpErrorCode errorCode=Ok; };
  using HttpResponsePtr = std::shared_ptr<HttpResponse>;
  struct HttpRequestArgs { int connectTimeout=10; int transferTimeout=60; bool compress=false; };
  using HttpRequestArgsPtr = std::shared_ptr<HttpRequestArgs>;
  class HttpClient {
  public:
    enum Method { kGet, kPost };
    HttpClient(bool=false){}
    HttpRequestArgsPtr createRequest(const std::string&, Method){ return std::make_shared<HttpRequestArgs>(); }
    void performRequest(HttpRequestArgsPtr, std::function<void(HttpResponsePtr)>) {}
  };
}
