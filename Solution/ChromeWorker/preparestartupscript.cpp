#include "preparestartupscript.h"
#include "javascriptextensions.h"
#include "modulesdata.h"
#include "multithreading.h"
#include "languagemanager.h"


std::string PrepareConstantStartupScript(BrowserData* Data)
{
    JavaScriptExtensions Extensions;
    std::string extension = Extensions.GetBasicExtension(Data->IsRecord);

    std::string modules;
    modules += GetAllBrowserDataCode(Data->_ModulesData);

    std::string hide;
    hide = Extensions.GetHideExtension(Data->_UniqueProcessId);


    std::string AllScript = hide + std::string(";") + extension + std::string(";") + modules + std::string(";");
    AllScript = Extensions.ProcessJs(AllScript,Data->_UniqueProcessId);
    return AllScript;
}

std::string PrepareMutableStartupScript(BrowserData* Data)
{
    std::string jscode;

    for (auto& Startup : Data->_StartupScript)
    {
         std::string StartupScript = Startup.second.Last();
         if(!StartupScript.empty())
         {
             if(!jscode.empty())
                 jscode += ";";
             jscode += "try{";
             jscode += StartupScript;
             jscode += "}catch(e){};";
         }
    }

    jscode += std::string(";_BAS_HIDE(BrowserAutomationStudio_RecaptchaV3ActionList) = ") + picojson::value(Data->_RecaptchaV3List).serialize() + std::string(";");

    JavaScriptExtensions Extensions;
    jscode = Extensions.ProcessJs(jscode,Data->_UniqueProcessId);
    return jscode;
}

void UpdateBrowserData(BrowserData* Data)
{
    std::string UserAgent;
    std::string AcceptLanguage;

    for(std::shared_ptr<std::map<std::string,std::string> > HeadersMap: Data->_Headers.All())
    {
        for(const auto& Header: *HeadersMap)
        {
            if(Header.first == "User-Agent")
            {
                UserAgent = Header.second;
            }else if(Header.first == "Accept-Language")
            {
                AcceptLanguage = Header.second;
            }
        }
    }
    Data->Saver.UserAgent = UserAgent;

    Data->Saver.Languages = CombineAcceptLanguageWithPattern(AcceptLanguage,Data->_AcceptLanguagePattern).NavigatorLanguages;

    //WORKER_LOG(std::string("Data->_NextReferrer") + Data->_NextReferrer + "; " + frame->GetURL().ToString());

    Data->Saver.Save();
}

