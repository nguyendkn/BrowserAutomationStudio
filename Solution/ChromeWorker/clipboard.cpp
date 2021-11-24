#include "clipboard.h"
#include <windows.h>

std::string read_clipboard()
{
    std::string res;
    if (OpenClipboard(0))
    {
        HANDLE hData = GetClipboardData( CF_TEXT );
        if(hData)
        {
            char * buffer = (char*)GlobalLock( hData );
            res = buffer;
            GlobalUnlock( hData );
        }
        CloseClipboard();

    }

    if(starts_with(res,"BAS:"))
    {
        res = res.substr(4,res.length() - 4);
        return res;
    }else
        return std::string();
}

void write_clipboard(const std::string data, bool use_prefix)
{
    if (OpenClipboard(0))
    {
        HGLOBAL clipbuffer;
        char * buffer;
        EmptyClipboard();
        int offset = use_prefix ? 4 : 0;
        clipbuffer = GlobalAlloc(GMEM_DDESHARE, data.length() + offset + 1);
        buffer = (char*)GlobalLock(clipbuffer);
        if (use_prefix)
        {
            buffer[0] = 'B';
            buffer[1] = 'A';
            buffer[2] = 'S';
            buffer[3] = ':';
        }
        memcpy(buffer + offset, data.data(), data.size());
        buffer[data.length() + offset] = 0;
        GlobalUnlock(clipbuffer);
        SetClipboardData(CF_TEXT,clipbuffer);
        CloseClipboard();
    }
}
