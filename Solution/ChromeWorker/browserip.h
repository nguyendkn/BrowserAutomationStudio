#ifndef IPREQUEST_H
#define IPREQUEST_H

#include "include/cef_urlrequest.h"
#include <vector>
#include <functional>
#include <string>

class BrowserIp : public CefURLRequestClient
{
    CefRefPtr<CefURLRequest> IpRequest;
    CefRefPtr<CefRequest> IpData;
    std::vector<char> Data;

    int IpReuestId;

public:
    BrowserIp();

    void Start(int IpReuestId, bool IsHttps);
    void Stop();
    
    virtual void OnRequestComplete(CefRefPtr<CefURLRequest> request) OVERRIDE;
    virtual void OnUploadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total) OVERRIDE;
    virtual void OnDownloadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total) OVERRIDE;
    virtual void OnDownloadData(CefRefPtr<CefURLRequest> request, const void* data, size_t data_length) OVERRIDE;
    virtual bool GetAuthCredentials(bool isProxy, const CefString& host, int port, const CefString& realm, const CefString& scheme, CefRefPtr<CefAuthCallback> callback) OVERRIDE;

    std::vector<std::function<void(std::string, int)> > Done;
private:
    IMPLEMENT_REFCOUNTING(BrowserIp);
};

#endif // IPREQUEST_H
