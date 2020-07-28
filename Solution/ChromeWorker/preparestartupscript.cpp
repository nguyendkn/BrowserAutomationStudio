#include "preparestartupscript.h"
#include "javascriptextensions.h"
#include "modulesdata.h"
#include "multithreading.h"
#include "languagemanager.h"


std::string PrepareStartupScript(BrowserData* Data, const std::string Url, int TabId)
{
    JavaScriptExtensions extensions;
    std::string jscode;
    jscode += GetAllBrowserDataCode(Data->_ModulesData);

    {
        LOCK_BROWSER_DATA
        std::string UserAgent;
        std::string AcceptLanguage;

        for(std::shared_ptr<std::map<std::string,std::string> > HeadersMap: Data->_Headers.MatchAll(Url,TabId))
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

        if(!Url.empty())
        {
            if(Data->_NextReferrer == "_BAS_NO_REFERRER")
            {
                jscode += extensions.GetReferrerExtension("");
            }else if(!Data->_NextReferrer.empty())
            {
                jscode += extensions.GetReferrerExtension(Data->_NextReferrer);
            }else
            {
                jscode += extensions.GetReferrerEmptyExtension();
            }
            //Data->_NextReferrer.clear();
        }

        Data->Saver.Save();
    }

    {
        LOCK_BROWSER_DATA
        for (auto& Startup : Data->_StartupScript)
        {
             std::string StartupScript = Startup.second.Match(Url,TabId);
             if(!StartupScript.empty())
             {
                 if(!jscode.empty())
                     jscode += ";";
                 jscode += "try{";
                 jscode += StartupScript;
                 jscode += "}catch(e){};";
             }
        }


    }

    jscode += std::string(";_BAS_HIDE(BrowserAutomationStudio_RecaptchaV3ActionList) = ") + picojson::value(Data->_RecaptchaV3List).serialize() + std::string(";");

    return jscode;

}
