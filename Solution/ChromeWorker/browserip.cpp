#include "browserip.h"

BrowserIp::BrowserIp()
{

}

void BrowserIp::Start(int IpReuestId)
{
    this->IpReuestId = IpReuestId;

    IpData = CefRequest::Create();
    IpData->SetURL(std::string("http://ip.bablosoft.com/?requestid=") + std::to_string(IpReuestId));
    IpData->SetMethod("GET");
    IpData->SetFlags(UR_FLAG_SKIP_CACHE);
    IpRequest = CefURLRequest::Create(IpData,this,NULL);
}

void BrowserIp::Stop()
{
    IpRequest = NULL;
    IpData = NULL;
}


void BrowserIp::OnRequestComplete(CefRefPtr<CefURLRequest> request)
{
    std::string Res(Data.begin(),Data.end());
    for(auto f:Done)
        f(Res,IpReuestId);

    Stop();
}

void BrowserIp::OnUploadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total)
{
}

void BrowserIp::OnDownloadProgress(CefRefPtr<CefURLRequest> request, int64 current, int64 total)
{
}

void BrowserIp::OnDownloadData(CefRefPtr<CefURLRequest> request, const void* data, size_t data_length)
{
    Data.insert(Data.end(),(char *)data,(char *)data + data_length);
}

bool BrowserIp::GetAuthCredentials(bool isProxy, const CefString& host, int port, const CefString& realm, const CefString& scheme, CefRefPtr<CefAuthCallback> callback)
{
    return false;
}
