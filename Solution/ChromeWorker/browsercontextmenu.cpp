#include "browsercontextmenu.h"
#include "translate.h"
#include "writefile.h"
#include "browsereventsemulator.h"
#include "log.h"
#include "picojson.h"


void BrowserContextMenu::ShowMenu(HWND hwnd, POINT& p, bool IsRecord, bool CanGoBack, bool CanGoForward)
{
    if(hMenu)
    {
        DestroyMenu(hMenu);
        hMenu = 0;
    }

    hMenu = CreatePopupMenu();
    UINT Enabled = MF_BYPOSITION | MF_STRING;
    UINT Disabled = Enabled | MF_DISABLED;


    AppendMenu(hMenu, ( CanGoBack ) ? Enabled : Disabled, IdBackward, Translate::Tr(L"Backward").c_str());
    AppendMenu(hMenu, ( CanGoForward ) ? Enabled : Disabled, IdForward, Translate::Tr(L"Forward").c_str());
    AppendMenu(hMenu, Enabled, IdReload, Translate::Tr(L"Reload").c_str());
    AppendMenu(hMenu, Enabled, IdFind, Translate::Tr(L"Find").c_str());
    AppendMenu(hMenu, Enabled, IdGetPageSource, Translate::Tr(L"Get page source").c_str());
    if(!IsRecord)
    {
        AppendMenu(hMenu, Enabled, IdSavePageAs, Translate::Tr(L"Save page as").c_str());
    }
    AppendMenu(hMenu, Enabled, IdOpenDeveloperTools, Translate::Tr(L"Open developer tools").c_str());


    TrackPopupMenu(hMenu, TPM_TOPALIGN | TPM_LEFTALIGN, p.x, p.y, 0, hwnd, NULL);
    if(hMenu)
    {
        DestroyMenu(hMenu);
        hMenu = 0;
    }
}

void BrowserContextMenu::Show(HWND hwnd, CefRefPtr<CefContextMenuParams> Params, bool CanGoBack, bool CanGoForward)
{

    LastClickX = Params->GetXCoord();
    LastClickY = Params->GetYCoord();
    Url = Params->GetUnfilteredLinkUrl().ToString();
    UrlMedia = Params->GetSourceUrl().ToString();
    LastSelectText = Params->GetSelectionText();

    if(hMenu)
    {
        DestroyMenu(hMenu);
        hMenu = 0;
    }

    hMenu = CreatePopupMenu();
    UINT Enabled = MF_BYPOSITION | MF_STRING;
    UINT Disabled = Enabled | MF_DISABLED;


    AppendMenu(hMenu, ( CanGoBack ) ? Enabled : Disabled, IdBackward, Translate::Tr(L"Backward").c_str());
    AppendMenu(hMenu, ( CanGoForward ) ? Enabled : Disabled, IdForward, Translate::Tr(L"Forward").c_str());
    AppendMenu(hMenu, Enabled, IdReload, Translate::Tr(L"Reload").c_str());
    AppendMenu(hMenu, Enabled, IdFind, Translate::Tr(L"Find").c_str());
    AppendMenu(hMenu, Enabled, IdGetPageSource, Translate::Tr(L"Get page source").c_str());
    AppendMenu(hMenu, Enabled, IdSavePageAs, Translate::Tr(L"Save page as").c_str());
    AppendMenu(hMenu, Enabled, IdOpenDeveloperTools, Translate::Tr(L"Open developer tools").c_str());
    AppendMenu(hMenu, Enabled, IdInspectElement, Translate::Tr(L"Inspect element").c_str());


    if(Params->GetTypeFlags() & CM_TYPEFLAG_LINK)
    {
        AppendMenu(hMenu,MF_SEPARATOR,NULL,L"Separator");
        AppendMenu(hMenu, Enabled, IdCopyLinkLocation, Translate::Tr(L"Copy link location").c_str());
        AppendMenu(hMenu, Enabled, IdOpenLinkInANewTab, Translate::Tr(L"Open link in a new tab").c_str());
    }
    if(Params->GetTypeFlags() & CM_TYPEFLAG_MEDIA)
    {
        AppendMenu(hMenu,MF_SEPARATOR,NULL,L"Separator");
        AppendMenu(hMenu, Enabled, IdCopyUrl, Translate::Tr(L"Copy media url").c_str());
        AppendMenu(hMenu, Enabled, IdSaveAs, Translate::Tr(L"Save media as").c_str());
    }
    if(Params->GetTypeFlags() & CM_TYPEFLAG_SELECTION)
    {
        AppendMenu(hMenu,MF_SEPARATOR,NULL,L"Separator");
        AppendMenu(hMenu, Enabled, IdCopyText, Translate::Tr(L"Copy selected text").c_str());
        std::wstring Text = Translate::Tr(L"Find ");
        std::wstring TextAdd = Params->GetSelectionText().ToWString();
        if(TextAdd.length() > 20)
            TextAdd = TextAdd.substr(0,20) + std::wstring(L" ... ");
        Text += std::wstring(L"\"");
        Text += TextAdd;
        Text += std::wstring(L"\"");
        Text += Translate::Tr(L" in Google");
        AppendMenu(hMenu, Enabled, IdFindInGoogle, Text .c_str());
    }
    if(Params->GetTypeFlags() & CM_TYPEFLAG_EDITABLE)
    {
        AppendMenu(hMenu,MF_SEPARATOR,NULL,L"Separator");
        AppendMenu(hMenu, Enabled, IdCutEditable, Translate::Tr(L"Cut").c_str());
        AppendMenu(hMenu, Enabled, IdCopyEditable, Translate::Tr(L"Copy").c_str());
        AppendMenu(hMenu, Enabled, IdPasteEditable, Translate::Tr(L"Paste").c_str());
        AppendMenu(hMenu, Enabled, IdSelectAllEditable, Translate::Tr(L"Select all").c_str());
    }


    POINT p;
    p.x = 0;
    p.y = 0;

    GetCursorPos(&p);

    TrackPopupMenu(hMenu, TPM_TOPALIGN | TPM_LEFTALIGN, p.x, p.y, 0, hwnd, NULL);
    if(hMenu)
    {
        DestroyMenu(hMenu);
        hMenu = 0;
    }

}

void SourceSaver::Visit(const CefString& string)
{
    //Getting page source
    WriteStringToFile("source.txt",string.ToString());
    ShellExecute(0, 0, L"source.txt", 0, 0 , SW_SHOW );
}

void BrowserContextMenu::Input(CefRefPtr<CefBrowser> Browser, const std::string Text)
{
    std::string TextCurrent = Text;
    KeyState State;
    while(true)
    {
        BrowserEventsEmulator::Key(Browser, TextCurrent, State, LastClickX, LastClickY, false);
        if(TextCurrent.length() == 0 && State.IsClear() && !State.IsPresingCharacter())
        {
            return;
        }
    }
}

void BrowserContextMenu::SetClipboard(const std::string& Text)
{
    std::string data = Text;
    if (OpenClipboard(0))
    {
        HGLOBAL clipbuffer;
        char * buffer;
        EmptyClipboard();
        clipbuffer = GlobalAlloc(GMEM_DDESHARE, data.length() + 1);
        buffer = (char*)GlobalLock(clipbuffer);
        memcpy(buffer, data.data(),data.size());
        buffer[data.length()] = 0;
        GlobalUnlock(clipbuffer);
        SetClipboardData(CF_TEXT,clipbuffer);
        CloseClipboard();
    }
}

void BrowserContextMenu::OnFind(CefRefPtr<CefBrowser> Browser, LPFINDREPLACE Data)
{
    if(Data->Flags & FR_DIALOGTERM)
    {
        Browser->GetHost()->StopFinding(true);
        find_what_last_.clear();
        find_next_ = false;
        find_hwnd_ = 0;
    }else if (Data->Flags & FR_FINDNEXT)
    {
        bool match_case = (Data->Flags & FR_MATCHCASE) ? true : false;
        const std::wstring& find_what = find_buff_;
        if (match_case != find_match_case_last_ || find_what != find_what_last_)
        {
            if(!find_what.empty())
            {
                Browser->GetHost()->StopFinding(true);
                find_next_ = false;
            }
            find_match_case_last_ = match_case;
            find_what_last_ = find_buff_;
        }
        Browser->GetHost()->Find(0, find_what, (find_state_.Flags & FR_DOWN) ? true : false, match_case, find_next_);
        if(!find_next_)
            find_next_ = true;
    }

}

void BrowserContextMenu::ShowFindDialog(HWND hwnd)
{
    if(find_hwnd_)
    {
        // Give focus to the existing find dialog.
        ::SetFocus(find_hwnd_);
        return;
    }

    ZeroMemory(&find_state_, sizeof(find_state_));
    find_state_.lStructSize = sizeof(find_state_);
    find_state_.hwndOwner = hwnd;
    find_state_.lpstrFindWhat = find_buff_;
    find_state_.wFindWhatLen = sizeof(find_buff_);
    find_state_.Flags = FR_HIDEWHOLEWORD | FR_DOWN;

    find_hwnd_ = FindText(&find_state_);
}

void BrowserContextMenu::Process(HWND hwnd, int Command, CefRefPtr<CefBrowser> Browser)
{
    if(!Browser)
        return;

    if(Command == IdBackward)
    {
        Browser->GoBack();
    }else if(Command == IdForward)
    {
        Browser->GoForward();
    }else if(Command == IdReload)
    {
        Browser->Reload();
    }else if(Command == IdGetPageSource)
    {
        if(!_SourceSaver)
            _SourceSaver = new SourceSaver();
        Browser->GetMainFrame()->GetSource(_SourceSaver);
    }else if(Command == IdOpenDeveloperTools)
    {
        CefWindowInfo window_info;
        window_info.SetAsPopup(0, "Developer tools");
        CefBrowserSettings browser_settings;
        Browser->GetHost()->ShowDevTools(window_info, NULL, browser_settings, CefPoint(0,0));
    }else if(Command == IdInspectElement)
    {
        CefWindowInfo window_info;
        window_info.SetAsPopup(0, "Developer tools");
        CefBrowserSettings browser_settings;
        Browser->GetHost()->ShowDevTools(window_info, NULL, browser_settings, CefPoint(LastClickX,LastClickY));
    }else if(Command == IdCopyLinkLocation)
    {
        SetClipboard(Url);

    }else if(Command == IdOpenLinkInANewTab)
    {
        Input(Browser, "<CONTROL><MOUSELEFT>");

    }else if(Command == IdCopyUrl)
    {
        SetClipboard(UrlMedia);

    }else if(Command == IdCopyText)
    {
        Input(Browser, "<CONTROL>c");
    }else if(Command == IdFindInGoogle)
    {
        std::string Text = picojson::value(LastSelectText).serialize();
        std::string Script = std::string("window.open(\"https://www.google.com/search?q=\" + encodeURIComponent(") + Text + std::string("))");
        Browser->GetMainFrame()->ExecuteJavaScript(Script,"",0);
    }
    else if(Command == IdCutEditable)
    {
        Input(Browser, "<CONTROL>x");
    }else if(Command == IdCopyEditable)
    {
        Input(Browser, "<CONTROL>c");
    }else if(Command == IdPasteEditable)
    {
        Input(Browser, "<CONTROL>v");
    }else if(Command == IdSelectAllEditable)
    {
        Input(Browser, "<CONTROL>a");
    }else if(Command == IdFind)
    {
        ShowFindDialog(hwnd);

    }else if(Command == IdSaveAs)
    {
        Browser->GetHost()->StartDownload(UrlMedia);
    }else if(Command == IdSavePageAs)
    {
        Browser->GetHost()->StartDownload(Browser->GetMainFrame()->GetURL());
    }




}
