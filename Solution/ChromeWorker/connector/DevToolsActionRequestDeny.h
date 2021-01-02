#ifndef DEVTOOLSACTIONREQUESTDENY_H
#define DEVTOOLSACTIONREQUESTDENY_H

#include "idevtoolsaction.h"

class DevToolsActionRequestDeny : public IDevToolsAction
{
public:
    virtual ActionSaverBehavior GetActionSaverBehavior();
    virtual bool IsNeedToRunForAllActiveTabs();
    virtual void OnTabCreation();
    virtual void OnTabSwitching();

    virtual void Run();
    virtual void OnWebSocketMessage(const std::string& Message, const std::string& Error);
};

#endif // DEVTOOLSACTIONREQUESTDENY_H
