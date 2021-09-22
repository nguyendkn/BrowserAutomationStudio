#ifndef POPUPEMULATION_H
#define POPUPEMULATION_H

#include "browserdata.h"
#include "ipcsimple.h"
#include <windows.h>

class PopupEmulation
{
    BrowserData *Data = 0;
    IPCSimple SelectElementIPC;
    bool IsActive = false;
    HMENU hMenu = 0;
    int FirstIndex = 0;
    HWND hwnd;
    std::string CurrentElementId;
    void ShowMenu(int X, int Y, std::vector<std::string> Options);
    void CloseMenu();

public:


    void Init(BrowserData *Data, int FirstIndex, HWND hwnd);
    void Timer();

    std::vector<std::function<void()> > EventPopupShown;
};

#endif // POPUPEMULATION_H
