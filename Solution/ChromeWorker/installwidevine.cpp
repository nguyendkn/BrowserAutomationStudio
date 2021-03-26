#include "installwidevine.h"
#include "copyfolder.h"
#include "deletefolder.h"
#include "replaceall.h"
#include "readallfile.h"
#include "fileutils.h"
#include <windows.h>

void InstallWidevine(const std::wstring& ProfilePathAbsolute)
{
    std::wstring From = GetRelativePathToExe(std::wstring(L"WidevineCdm\\*"));
    std::wstring To = ProfilePathAbsolute + std::wstring(L"\\WidevineCdm\\");

    ReplaceAllInPlace(From, L"/", L"\\");
    ReplaceAllInPlace(To, L"/", L"\\");

    CreateDirectoryW(ProfilePathAbsolute.c_str(), NULL);
    CreateDirectoryW(To.c_str(), NULL);


    if(GetFilesInDirectory(To).empty())
    {
        CopyFolder(From, To);
    }
}

void DeinstallWidevine(const std::wstring& ProfilePathAbsolute)
{
    std::wstring To = ProfilePathAbsolute + std::wstring(L"\\WidevineCdm\\");
    DeleteFolder(To);
}
