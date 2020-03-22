#ifndef DEVCLIENTSOURCE_H
#define DEVCLIENTSOURCE_H

#include <string>
#include <vector>
#include <map>
#include <mutex>
#include "picojson.h"
#include "websocketpp/config/asio_no_tls_client.hpp"
#include "websocketpp/client.hpp"
#include "include/cef_urlrequest.h"
#include "asio.hpp"

class DevClientSource : public CefURLRequestClient
{
private:

    //Url request
    CefRefPtr<CefRequest> WebsocketEndpoint;
    CefRefPtr<CefURLRequest> WebsocketRequest;
    std::vector<char> WebsocketRequestData;


    //Defines
    using ClientClass = websocketpp::client<websocketpp::config::asio_client>;
    using MessageClass = websocketpp::config::asio_client::message_type::ptr;
    using HandleClass = websocketpp::connection_hdl;

    //Data, everything must be protected by mutex DataMutex_CurrentScriptSourceRequest
    //Current request data
    int CurrentTaskId = -1;
    int CurrentLineNumber = -1;
    int CurrentColumnNumber = -1;
    int CurrentSourceLineNumber = -1;
    int CurrentSourceColumnNumber = -1;

    std::string CurrentSourceUrl;
    std::string CurrentScriptSourceResult;

    bool IsStoppingDebugger = false;
    bool IsStoppingDebuggerBecauseSuccess = false;

    int DebuggerCloseRequest = - 1;
    bool IsFinished = false;

    //Pending request data
    bool IsBusy = false;
    std::string NextSourceUrl;
    int NextLineNumber = -1;
    int NextColumnNumber = -1;

    //Mutex
    std::mutex DataMutex;

    std::atomic_bool IsSuccessEnding = false;


    std::atomic_int TaskId = 1;
    bool IsStarted = false;

    ClientClass Client;
    HandleClass ConnectionHandle;

    //Events
    void OnMessage(ClientClass* Client, HandleClass Handle, MessageClass Message);
    void OnTimeout();

    //Helpers
    int Send(const std::string& Method);
    int Send(const std::string& Data, const picojson::object& Params);
    void StartNextIfNeeded();

    void Start(const std::string& Endpoint);

    asio::steady_timer *Timeout = nullptr;


    //Http request
    virtual void OnRequestComplete(CefRefPtr<CefURLRequest> request) OVERRIDE;
    virtual void OnUploadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total) OVERRIDE;
    virtual void OnDownloadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total) OVERRIDE;
    virtual void OnDownloadData(CefRefPtr<CefURLRequest> request, const void* data, size_t data_length) OVERRIDE;
    virtual bool GetAuthCredentials(bool isProxy, const CefString& host, int port, const CefString& realm, const CefString& scheme, CefRefPtr<CefAuthCallback> callback) OVERRIDE;


public:
    DevClientSource();
    void Start(int RemoteDebuggingPort);
    bool GetSourceFromUrlStart(const std::string& Url, int LineNumber, int ColumnNumber);
    bool DevClientSource::GetSourceFromUrlEnd(std::string& Result);

private:
    IMPLEMENT_REFCOUNTING(DevClientSource);

};

#endif // DEVCLIENTSOURCE_H
