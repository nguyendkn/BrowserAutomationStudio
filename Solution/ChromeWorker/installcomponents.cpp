#include "installcomponents.h"
#include "copyfolder.h"
#include "deletefolder.h"
#include "replaceall.h"
#include "readallfile.h"
#include "writefile.h"
#include "fileutils.h"
#include "fileexists.h"
#include "picojson.h"
#include <windows.h>


void UpdatePreferences(const std::wstring& ProfilePathAbsolute, bool EnableSafeBrowsing)
{

    bool NeedWrite = false;
    std::wstring PreferencesPath = ProfilePathAbsolute + std::wstring(L"\\Default\\Preferences");
    ReplaceAllInPlace(PreferencesPath, L"/", L"\\");
    if(FileExists(PreferencesPath))
    {
        std::string PreferencesString = ReadAllString(PreferencesPath);
        picojson::value PreferencesValue;
        try
        {
            picojson::parse(PreferencesValue, PreferencesString);
            picojson::value::object& PreferencesObject = PreferencesValue.get<picojson::value::object>();

            if(PreferencesObject.count("safebrowsing") && PreferencesObject["safebrowsing"].is<picojson::value::object>())
            {
                picojson::value::object& SafeBrowsingObject = PreferencesObject["safebrowsing"].get<picojson::value::object>();

                if(EnableSafeBrowsing)
                {
                    if(SafeBrowsingObject.count("enabled"))
                    {
                        SafeBrowsingObject.erase("enabled");
                        NeedWrite = true;
                    }
                    if(SafeBrowsingObject.count("enhanced"))
                    {
                        SafeBrowsingObject.erase("enhanced");
                        NeedWrite = true;
                    }
                }else
                {
                    SafeBrowsingObject["enabled"] = picojson::value(false);
                    SafeBrowsingObject["enhanced"] = picojson::value(false);
                    NeedWrite = true;
                }
            }
            if(NeedWrite)
            {
                PreferencesString = PreferencesValue.serialize();
                WriteStringToFile(PreferencesPath, PreferencesString);
            }
        }catch(...)
        {

        }
    }


}

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

    //Update Default/Preferences json file. Remove safebrowsing.enabled and safebrowsing.enhanced properties.
    UpdatePreferences(ProfilePathAbsolute, true);
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

    //Update Default/Preferences json file. Set safebrowsing.enabled and safebrowsing.enhanced to false.
    UpdatePreferences(ProfilePathAbsolute, false);

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
