#include "noneconnector.h"
#include "json/picojson.h"
#include <fstream>

using namespace std::placeholders;

void NoneConnector::Initialize
(
        std::shared_ptr<ISimpleHttpClientFactory> SimpleHttpClientFactory,
        std::shared_ptr<IWebSocketClientFactory> WebSocketClientFactory,
        int Port, const std::string& UniqueProcessId, const std::string& ParentProcessId, const std::string& ChromeExecutableLocation,
        const std::string& ConstantStartupScript,
        const std::vector<std::pair<std::string,std::string> >& CommandLineAdditional
)
{
}

char* NoneConnector::GetPaintData()
{
    return std::string().data();
}

int NoneConnector::GetPaintWidth()
{
    return 0;
}

int NoneConnector::GetPaintHeight()
{
    return 0;
}

int NoneConnector::GetWidth()
{
    return 0;
}

int NoneConnector::GetHeight()
{
    return 0;
}

int NoneConnector::GetScrollX()
{
    return 0;
}

int NoneConnector::GetScrollY()
{
    return 0;
}

void NoneConnector::SetProfilePath(const std::wstring& Path)
{
}

void NoneConnector::SetExtensionList(const std::vector<std::wstring>& Extensions)
{
}

void NoneConnector::OpenDevTools()
{
}

void NoneConnector::InspectAt(int X, int Y)
{
}

void NoneConnector::StartProcess()
{
}

void NoneConnector::Timer()
{
}

void NoneConnector::InsertAction(std::shared_ptr<IDevToolsAction> Action)
{
    Async Result = std::make_shared<AsyncResult>();
    Result->Success();
    Action->SetResult(Result);
}

Async NoneConnector::GetTabsList(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::GetCurrentUrl(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

int NoneConnector::GetTabNumber()
{
    return 0;
}

int NoneConnector::GetCurrentTabIndex()
{
    return -1;
}

Async NoneConnector::GetBrowserSize(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::ResizeBrowser(int Width, int Height, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::ResetDeviceScaleFactor(float DeviceScaleFactor, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::Screenshot(int X, int Y, int Width, int Height, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

void NoneConnector::EnableBackgroundMode()
{
}

void NoneConnector::DisableBackgroundMode()
{
}

Async NoneConnector::StartScreenCast(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::StopScreenCast(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::Load(const std::string& Url, bool IsInstant, const std::string& Referrer, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::Reload(bool IsInstant, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SetProxy(const std::string Server, int Port, bool IsHttp, const std::string Login, const std::string Password, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::GetHistory(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SetHeaders(const std::vector<std::pair<std::string, std::string>>& Headers, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SetUserAgentData(const std::string& Data, const std::vector<std::pair<std::string, std::string>>& Headers, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::NavigateBack(bool IsInstant, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::NavigateForward(bool IsInstant, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::CreateTab(const std::string& Url, bool IsInstant, bool IsDelayed, const std::string& Referrer, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SwitchToTab(int Index, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::CloseTab(int Index, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

void NoneConnector::CloseBrowser()
{
}

Async NoneConnector::SetStartupScript(const std::string& Script, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::ExecuteJavascript(const std::string& Script, const std::string& Variables, const std::string& ElementPath, bool ScrollToElement, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::Inspect(int X, int Y, int Position, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SetRequestsRestrictions(const std::vector<std::pair<bool, std::string> >& Rules, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SetHttpAuth(const std::string& UserName, const std::string& Password, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

void NoneConnector::SetCacheMasks(const std::vector<std::pair<bool, std::string> >& Rules)
{
}

std::string NoneConnector::GetAllCacheData(const std::string& Mask)
{
    return std::string();
}

std::string NoneConnector::GetSingleCacheData(const std::string& Mask, bool IsBase64)
{
    return std::string();
}

void NoneConnector::ClearNetworkData()
{
}

int NoneConnector::GetStatusForURL(const std::string& UrlPattern)
{
    return 0;
}

std::string NoneConnector::FindLoadedURL(const std::string& UrlPattern)
{
    return std::string();
}

bool NoneConnector::IsURLLoaded(const std::string& UrlPattern)
{
    return false;
}

void NoneConnector::Focus()
{
}

std::vector<std::pair<std::string, std::string>> NoneConnector::GetExtensionList()
{
    return std::vector<std::pair<std::string, std::string>>{};
}

void NoneConnector::TriggerExtensionButton(const std::string ExtensionIdOrNamePart)
{
}

Async NoneConnector::StartDragFile(const std::string& Path, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

void NoneConnector::Mouse(MouseEvent Event, int X, int Y, MouseButton Button, int MousePressed, int KeyboardPresses, int ClickCount)
{
}

void NoneConnector::Wheel(int X, int Y, bool IsUp, int Delta, int MousePressed, int KeyboardPresses)
{
}

void NoneConnector::Touch(TouchEvent Event, int X, int Y, int Id, double RadiusX, double RadiusY, double RotationAngle, double Pressure)
{
}

void NoneConnector::Key(KeyEvent Event, const std::string& Char, int KeyboardPresses)
{
}

void NoneConnector::KeyRaw(KeyEvent Event, WPARAM WindowsVirtualKeyCode, LPARAM NativeVirtualKeyCode, int KeyboardPresses)
{
}

bool NoneConnector::IsLoading()
{
    return false;
}

Async NoneConnector::Reset(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

bool NoneConnector::InterruptAction(int ActionUniqueId)
{
    return true;
}

void NoneConnector::SetOpenFileDialogResult(const std::string& Result)
{
}

void NoneConnector::SetOpenFileDialogManualMode(bool IsManual)
{
}

void NoneConnector::SetPromptResult(const std::string& PromptResult)
{
}

Async NoneConnector::AllowDownloads(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::RestrictDownloads(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

bool NoneConnector::IsFileDownloadReady()
{
    return true;
}

std::string NoneConnector::GetDownloadedFilePath()
{
    return std::string();
}

void NoneConnector::RestrictPopups()
{
}

void NoneConnector::AllowPopups()
{
}

Async NoneConnector::RestoreCookies(const std::string& Cookies, int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}

Async NoneConnector::SaveCookies(int Timeout)
{
    std::shared_ptr<IDevToolsAction> NewAction;
    NewAction->SetTimeout(Timeout);
    InsertAction(NewAction);
    return NewAction->GetResult();
}
