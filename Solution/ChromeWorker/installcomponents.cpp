#include "installcomponents.h"
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

void InstallSafeBrowsing(const std::wstring& ProfilePathAbsolute)
{
    std::wstring From = GetRelativePathToExe(std::wstring(L"Safe Browsing\\*"));
    std::wstring To = ProfilePathAbsolute + std::wstring(L"\\Safe Browsing\\");

    ReplaceAllInPlace(From, L"/", L"\\");
    ReplaceAllInPlace(To, L"/", L"\\");

    CreateDirectoryW(ProfilePathAbsolute.c_str(), NULL);
    CreateDirectoryW(To.c_str(), NULL);


    if(GetFilesInDirectory(To).empty())
    {
        CopyFolder(From, To);
    }
}

void InstallComponents(const std::wstring& ProfilePathAbsolute)
{
    std::wstring ComponentsFolder = GetRelativePathToExe(std::wstring(L"Components\\"));
    for(const FileEntry& Entry: GetFilesInDirectory(ComponentsFolder))
    {
        if(!Entry.IsDirectory)
        {
            continue;
        }

        std::wstring From = GetRelativePathToExe(std::wstring(L"Components\\") + Entry.FileNameWString + std::wstring(L"\\*"));
        std::wstring To = ProfilePathAbsolute + std::wstring(L"\\") + Entry.FileNameWString + std::wstring(L"\\");

        ReplaceAllInPlace(From, L"/", L"\\");
        ReplaceAllInPlace(To, L"/", L"\\");

        CreateDirectoryW(ProfilePathAbsolute.c_str(), NULL);
        CreateDirectoryW(To.c_str(), NULL);


        if(GetFilesInDirectory(To).empty())
        {
            CopyFolder(From, To);
        }
    }
}

void DeinstallWidevine(const std::wstring& ProfilePathAbsolute)
{
    std::wstring To = ProfilePathAbsolute + std::wstring(L"\\WidevineCdm\\");
    DeleteFolder(To);
}

void DeinstallSafeBrowsing(const std::wstring& ProfilePathAbsolute)
{
    std::wstring To = ProfilePathAbsolute + std::wstring(L"\\Safe Browsing\\");
    DeleteFolder(To);
}

void DeinstallComponents(const std::wstring& ProfilePathAbsolute)
{
    std::wstring ComponentsFolder = GetRelativePathToExe(std::wstring(L"Components\\"));
    for(const FileEntry& Entry: GetFilesInDirectory(ComponentsFolder))
    {
        std::wstring To = ProfilePathAbsolute + std::wstring(L"\\") + Entry.FileNameWString + std::wstring(L"\\");
        DeleteFolder(To);
    }
}
