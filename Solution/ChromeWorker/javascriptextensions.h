#ifndef JAVASCRIPTEXTENSIONS_H
#define JAVASCRIPTEXTENSIONS_H

#include <string>

class JavaScriptExtensions
{
public:
    JavaScriptExtensions();

    std::string GetReferrerExtension(const std::string& Referrer);
    std::string GetReferrerEmptyExtension();

    std::string GetBasicExtension(bool IsRecord);
    std::string GetJqueryExtension();

    std::string GetHideExtensionFirst(const std::string& UniqueProcessId);
    std::string GetHideExtensionLast(const std::string& UniqueProcessId);
    std::string ProcessJs(const std::string& Script, const std::string& UniqueProcessId);
};

#endif // JAVASCRIPTEXTENSIONS_H
