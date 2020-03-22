#ifndef CEFREQUEST2ACTION_H
#define CEFREQUEST2ACTION_H

#include <string>
#include <map>
#include <vector>
#include "include/cef_app.h"


class CefReqest2Action
{
    //std::map<std::string, std::string> Headers;
    std::string JsonEscape(const std::string & Text);
    std::string JsonEscapeInsideString(const std::string & Text);

public:
    std::string Convert(CefRefPtr<CefRequest> request);
    void Reset();

};

#endif // CEFREQUEST2ACTION_H
