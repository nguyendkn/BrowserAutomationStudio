#include "prepareurladressbar.h"
#include "include/cef_parser.h"


std::string prepare_url_adressbar(const std::string& UrlOriginal)
{
    //Check if need to do Google search.
    bool DoGoogleSearch = false;

    bool IsSchemePresent = false;
    std::string UrlToCheck = UrlOriginal;
    for(int i = 0;i<UrlOriginal.size();i++)
    {
        char c = UrlOriginal.at(i);
        if(c == ':')
        {
            IsSchemePresent = i > 0;
            break;
        }
        if(!(c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c >= '0' && c <= '9' || c == '+' || c == '.' || c == '-'))
        {
            //Not allowed char for scheme
            IsSchemePresent = false;
            break;
        }
    }


    if(!IsSchemePresent)
    {
        UrlToCheck = std::string("http://") + UrlOriginal;
    }

    CefURLParts ParsedUrl;
    if(!CefParseURL(UrlToCheck,ParsedUrl))
    {
        DoGoogleSearch = true;
    }
    CefString SchemeCefString(&ParsedUrl.scheme);
    CefString HostCefString(&ParsedUrl.host);

    std::string SchemeString = SchemeCefString.ToString();
    std::string HostString = HostCefString.ToString();

    std::transform(SchemeString.begin(), SchemeString.end(), SchemeString.begin(), ::tolower);
    std::transform(HostString.begin(), HostString.end(), HostString.begin(), ::tolower);


    if((SchemeString == std::string("http") || SchemeString == std::string("https")) && HostString.find(".") == std::string::npos)
    {
        DoGoogleSearch = true;
    }

    if((SchemeString == std::string("http") || SchemeString == std::string("https")) && (HostString.find(" ") != std::string::npos || HostString.find("%20") != std::string::npos))
    {
        DoGoogleSearch = true;
    }

    std::string Url;

    if(DoGoogleSearch)
    {
        Url = std::string("https://www.google.com/search?q=") + CefURIEncode(UrlOriginal,true).ToString();
    }else
    {
        Url = UrlToCheck;
    }

    return Url;
}
