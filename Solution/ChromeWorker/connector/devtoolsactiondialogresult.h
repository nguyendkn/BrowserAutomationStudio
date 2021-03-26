#ifndef DEVTOOLSACTIONDIALOGRESULT_H
#define DEVTOOLSACTIONDIALOGRESULT_H


#include "idevtoolsaction.h"

class DevToolsActionDialogResult : public IDevToolsAction
{
    long long FinishActionTime = 0;
    std::string TypeString;
public:
    virtual void Run();
    virtual void OnWebSocketEvent(const std::string& Method, const std::string& Message);

};


#endif // DEVTOOLSACTIONDIALOGRESULT_H
