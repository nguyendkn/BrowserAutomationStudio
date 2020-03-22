#include <Windows.h>
#include "fontreplace.h"
#include "MinHook.h"
#include "converter.h"
#include "split.h"
#include "trim.h"
#include "multithreading.h"
#include <string>
#include "startwith.h"
#include "converter.h"
#include "replaceall.h"

#define MAX_KEY_LENGTH 255
#define MAX_VALUE_NAME 16383


typedef
HANDLE
(WINAPI *BAS_TYPE2_CreateFileW)(
    LPCWSTR,
    DWORD,
    DWORD,
    LPSECURITY_ATTRIBUTES,
    DWORD,
    DWORD,
    HANDLE
    );

BAS_TYPE2_CreateFileW BAS_POINTER2_CreateFileW = NULL;

HANDLE WINAPI BAS_REPLACED2_CreateFileW(LPCWSTR lpFileName, DWORD dwDesiredAccess, DWORD dwShareMode, LPSECURITY_ATTRIBUTES lpSecurityAttributes, DWORD dwCreationDisposition, DWORD dwFlagsAndAttributes, HANDLE hTemplateFile)
{
    std::wstring str(lpFileName);
    std::wstring strb = str;

    if(starts_with(str,L"c:\\windows\\fonts\\"))
    {
        try{std::transform(str.begin(), str.end(), str.begin(), ::tolower);}catch(...){}

        std::wstring FontFile = ReplaceAll(str,L"c:\\windows\\fonts\\",L"");
        std::wstring FontName = FontReplace::GetInstance().ConvertFontFileToFontName(FontFile);

        if(!FontName.empty())
        {
            if(FontReplace::GetInstance().IsStandartFont(FontName))
            {
                //font is standart
            }else
            {
                if(!FontReplace::GetInstance().NeedDisplayFont(FontName))
                {
                    //No need to display font, change to standart
                    str = L"c:\\windows\\fonts\\arial.ttf";
                }
            }

        }else
        {
            str = L"c:\\windows\\fonts\\arial.ttf";
        }

    }



    HANDLE res = BAS_POINTER2_CreateFileW(str.data(),dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);

    return res;
}


void FontReplace::CollectFonts()
{
    if(IsFontsCollectedSystem)
        return;

    {
        LOCK_FONTS
        font_path.clear();
    }
    HKEY RegKey;
    if(RegOpenKeyEx( HKEY_LOCAL_MACHINE, L"SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts", 0, KEY_READ, &RegKey) == ERROR_SUCCESS)
    {

        TCHAR    achClass[MAX_PATH] = TEXT("");  // buffer for class name
        DWORD    cchClassName = MAX_PATH;  // size of class string
        DWORD    cSubKeys=0;               // number of subkeys
        DWORD    cbMaxSubKey;              // longest subkey size
        DWORD    cchMaxClass;              // longest class string
        DWORD    cValues;              // number of values for key
        DWORD    cchMaxValue;          // longest value name
        DWORD    cbMaxValueData;       // longest value data
        DWORD    cbSecurityDescriptor; // size of security descriptor
        FILETIME ftLastWriteTime;      // last write time

        DWORD i, retCode;

        TCHAR  achKey[MAX_VALUE_NAME];
        TCHAR  achValue[MAX_VALUE_NAME];
        DWORD cchValue = MAX_VALUE_NAME;
        DWORD cchKey = MAX_VALUE_NAME;


            // Get the class name and the value count.
            retCode = RegQueryInfoKey(
                RegKey,                  // key handle
                achClass,                // buffer for class name
                &cchClassName,           // size of class string
                NULL,                    // reserved
                &cSubKeys,               // number of subkeys
                &cbMaxSubKey,            // longest subkey size
                &cchMaxClass,            // longest class string
                &cValues,                // number of values for this key
                &cchMaxValue,            // longest value name
                &cbMaxValueData,         // longest value data
                &cbSecurityDescriptor,   // security descriptor
                &ftLastWriteTime);       // last write time

            // Enumerate the subkeys, until RegEnumKeyEx fails.


            for (i=0; i<cValues; i++)
            {
                std::wstring key,value;

                cchValue = MAX_VALUE_NAME;
                achValue[0] = '\0';
                cchKey = MAX_VALUE_NAME;
                achKey[0] = '\0';
                retCode = RegEnumValue(RegKey, i,
                    achKey,
                    &cchKey,
                    NULL,
                    NULL,
                    (LPBYTE)achValue,
                    &cchValue);

                if (retCode == ERROR_SUCCESS )
                {
                    key = achKey;
                    value = achValue;
                    ReplaceAllInPlace(key,L" (TrueType)",L"");
                    try{std::transform(key.begin(), key.end(), key.begin(), ::tolower);}catch(...){}
                    try{std::transform(value.begin(), value.end(), value.begin(), ::tolower);}catch(...){}

                    if(!key.empty() && !value.empty())
                    {
                        LOCK_FONTS
                        font_path[value] = key;
                    }


                }



            }
    }
    RegCloseKey(RegKey);


    IsFontsCollectedSystem = true;
}

bool FontReplace::IsStandartFont(const std::wstring& font)
{
    std::wstring font_copy = font;
    std::transform(font_copy.begin(), font_copy.end(), font_copy.begin(), ::tolower);

    return  font_copy == std::wstring(L"arial")
            || font_copy == std::wstring(L"arial bold")
            || font_copy == std::wstring(L"arial bold italic")
            || font_copy == std::wstring(L"arial italic")

            || font_copy == std::wstring(L"times new roman")
            || font_copy == std::wstring(L"times new roman bold")
            || font_copy == std::wstring(L"times new roman bold italic")
            || font_copy == std::wstring(L"times new roman italic")

            || font_copy == std::wstring(L"courier new")
            || font_copy == std::wstring(L"courier new bold")
            || font_copy == std::wstring(L"courier new bold italic")
            || font_copy == std::wstring(L"courier new italic")

            || font_copy == std::wstring(L"lucida console")

            || font_copy == std::wstring(L"georgia")
            || font_copy == std::wstring(L"georgia bold")
            || font_copy == std::wstring(L"georgia bold italic")
            || font_copy == std::wstring(L"georgia italic")

            || font_copy == std::wstring(L"")
            || font_copy.find(L"==") != std::wstring::npos;

}

std::wstring FontReplace::ConvertFontFileToFontName(const std::wstring& FontFile)
{
    LOCK_FONTS
    if(font_path.count(FontFile) == 0)
        return std::wstring();

    return font_path[FontFile];
}

bool FontReplace::NeedDisplayFont(const std::wstring& font)
{
    std::wstring font_copy = font;
    std::transform(font_copy.begin(), font_copy.end(), font_copy.begin(), ::tolower);

    LOCK_FONTS
    for(std::wstring& f: fonts)
    {
        if(font.find(f) != std::wstring::npos)
            return true;
    }
    return false;
}



bool FontReplace::Initialize()
{


    if (MH_CreateHook(&CreateFileW, &BAS_REPLACED2_CreateFileW, reinterpret_cast<LPVOID*>(&BAS_POINTER2_CreateFileW)) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Initialize Failed MH_CreateHook");
        return false;
    }


    //WORKER_LOG("FontReplace::Initialize Success");
    IsHookInstalled = false;
    return true;
}

bool FontReplace::Hook()
{
    if(IsHookInstalled)
        return true;

    CollectFonts();

    if (MH_EnableHook(&CreateFileW) != MH_OK)
    {
        //WORKER_LOG("FontReplace::Hook failed MH_EnableHook");
        return false;
    }

    IsHookInstalled = true;
    return true;
}
void FontReplace::SetFonts(const std::string& fonts)
{
    LOCK_FONTS
    this->fonts.clear();
    std::vector<std::string> all = split(fonts,';');
    for(std::string& font: all)
    {
        std::string tf = trim(font);
        std::transform(tf.begin(), tf.end(), tf.begin(), ::tolower);

        if(tf.size() > 0)
            this->fonts.push_back(s2ws(tf));
    }
}

bool FontReplace::UnHook()
{
    if(!IsHookInstalled)
        return true;

    {
        LOCK_FONTS
        fonts.clear();
    }

    if (MH_DisableHook(&CreateFileW) != MH_OK)
    {
       //WORKER_LOG("FontReplace::UnHook Failed MH_DisableHook");
       return false;
    }

    //WORKER_LOG("FontReplace::UnHook Success");
    IsHookInstalled = false;
    return true;
}


bool FontReplace::Uninitialize()
{
    UnHook();

    return true;
}
