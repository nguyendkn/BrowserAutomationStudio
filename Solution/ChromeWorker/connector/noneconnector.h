#ifndef NONECONNECTOR_H
#define NONECONNECTOR_H

#include "idevtoolsconnector.h"
#include "IWebSocketClientFactory.h"
#include "ISimpleHttpClientFactory.h"
#include "InputEventsEnumerations.h"
#include "KeyboardEmulation.h"
#include <windows.h>

class NoneConnector : public IDevToolsConnector
{
    void ResetProxy(const std::string& ParentProcessId);
    void InsertAction(std::shared_ptr<IDevToolsAction> Action);

    public:
        char* GetPaintData();
        int GetPaintWidth();
        int GetPaintHeight();
        int GetWidth();
        int GetHeight();
        int GetScrollX();
        int GetScrollY();

        std::vector<std::function<void(std::string&, std::string&)> > OnMessage;

        void Timer();

        void Initialize
        (
                std::shared_ptr<ISimpleHttpClientFactory> SimpleHttpClientFactory,
                std::shared_ptr<IWebSocketClientFactory> WebSocketClientFactory,
                int Port, const std::string& UniqueProcessId, const std::string& ParentProcessId, const std::string& ChromeExecutableLocation,
                const std::string& ConstantStartupScript,
                const std::vector<std::pair<std::string,std::string> >& CommandLineAdditional
        );
        void SetProfilePath(const std::wstring& Path);
        void SetExtensionList(const std::vector<std::wstring>& Extensions);
        bool InterruptAction(int ActionUniqueId);
        void StartProcess();
        void OpenDevTools();
        void InspectAt(int X, int Y);

        //Browser life cycle
        Async Reset(int Timeout = -1);
        bool IsLoading();
        void CloseBrowser();

        //Tabs
        Async GetTabsList(int Timeout = -1);
        Async CreateTab(const std::string& Url, bool IsInstant = false, bool IsDelayed = false, const std::string& Referrer = std::string(), int Timeout = -1);
        Async SwitchToTab(int Index, int Timeout = -1);
        Async CloseTab(int Index, int Timeout = -1);
        int GetTabNumber();
        int GetCurrentTabIndex();

        //Rendering
        Async Screenshot(int X, int Y, int Width, int Height, int Timeout = -1);
        Async StartScreenCast(int Timeout = -1);
        Async StopScreenCast(int Timeout = -1);
        void EnableBackgroundMode();
        void DisableBackgroundMode();
        Async ResetDeviceScaleFactor(float DeviceScaleFactor, int Timeout = -1);

        //Network
        Async Load(const std::string& Url, bool IsInstant = false, const std::string& Referrer = std::string(), int Timeout = -1);
        Async Reload(bool IsInstant = false, int Timeout = -1);
        Async NavigateBack(bool IsInstant = false, int Timeout = -1);
        Async NavigateForward(bool IsInstant = false, int Timeout = -1);
        Async GetCurrentUrl(int Timeout = -1);
        Async SetRequestsRestrictions(const std::vector<std::pair<bool, std::string> >& Rules, int Timeout = -1);
        Async SetHttpAuth(const std::string& UserName, const std::string& Password, int Timeout = -1);


        //Cache
        void SetCacheMasks(const std::vector<std::pair<bool, std::string> >& Rules);
        std::string GetSingleCacheData(const std::string& Mask, bool IsBase64);
        std::string GetAllCacheData(const std::string& Mask);
        void ClearNetworkData();

        int GetStatusForURL(const std::string& UrlPattern);
        std::string FindLoadedURL(const std::string& UrlPattern);
        bool IsURLLoaded(const std::string& UrlPattern);
        Async SetProxy(const std::string Server, int Port, bool IsHttp = true, const std::string Login = std::string(), const std::string Password = std::string(), int Timeout = -1);
        Async GetHistory(int Timeout = -1);
        Async SetHeaders(const std::vector<std::pair<std::string, std::string>>& Headers, int Timeout = -1);
        Async SetUserAgentData(const std::string& Data, const std::vector<std::pair<std::string, std::string>>& Headers, int Timeout = -1);

        //Size
        Async GetBrowserSize(int Timeout = -1);
        Async ResizeBrowser(int Width, int Height, int Timeout = -1);

        //Javascript
        Async SetStartupScript(const std::string& Script, int Timeout = -1);
        Async ExecuteJavascript(const std::string& Script, const std::string& Variables = std::string(), const std::string& ElementPath = std::string(), bool ScrollToElement = false, int Timeout = -1);

        //Inputs
        void Mouse(MouseEvent Event, int X, int Y, MouseButton Button = MouseButtonLeft, int MousePressed = MouseButtonNone, int KeyboardPresses = KeyboardModifiersNone, int ClickCount = 1);
        void Wheel(int X, int Y, bool IsUp, int Delta = 100, int MousePressed = MouseButtonNone, int KeyboardPresses = KeyboardModifiersNone);
        void Touch(TouchEvent Event, int X, int Y, int Id, double RadiusX = 11.5, double RadiusY = 11.5, double RotationAngle = 0.0, double Pressure = 1.0);
        void Key(KeyEvent Event, const std::string& Char, int KeyboardPresses = KeyboardModifiersNone);
        void KeyRaw(KeyEvent Event, WPARAM WindowsVirtualKeyCode, LPARAM NativeVirtualKeyCode, int KeyboardPresses = KeyboardModifiersNone);
        void Focus();

        //Interacting with elements
        Async Inspect(int X, int Y, int Position = 0, int Timeout = -1);

        //Dialogs
        void SetOpenFileDialogResult(const std::string& Result);
        void SetOpenFileDialogManualMode(bool IsManual);
        void SetPromptResult(const std::string& PromptResult);

        //Downloads
        Async AllowDownloads(int Timeout = -1);
        Async RestrictDownloads(int Timeout = -1);
        bool IsFileDownloadReady();
        std::string GetDownloadedFilePath();

        //Popups
        void AllowPopups();
        void RestrictPopups();

        //Cookies
        Async RestoreCookies(const std::string& Cookies, int Timeout = -1);
        Async SaveCookies(int Timeout = -1);

        //Extensions
        void TriggerExtensionButton(const std::string ExtensionIdOrNamePart);
        std::vector<std::pair<std::string, std::string> > GetExtensionList();

        //Drag and drop
        Async StartDragFile(const std::string& Path, int Timeout = -1);
};

#endif // NONECONNECTOR_H
