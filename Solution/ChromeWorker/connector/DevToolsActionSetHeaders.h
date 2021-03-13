#ifndef DEVTOOLSACTIONSETHEADERS_H
#define DEVTOOLSACTIONSETHEADERS_H

#include "idevtoolsaction.h"

class DevToolsActionSetHeaders : public IDevToolsAction
{
    bool IsSettingHeaders = false;
    bool IsSettingUA = false;
public:
    virtual void OnWebSocketMessage(const std::string& Message, const std::string& Error);
    virtual ActionSaverBehavior GetActionSaverBehavior();
    virtual bool IsNeedToRunForAllActiveTabs();
    virtual void OnTabSwitching();
    virtual void OnTabCreation();
    virtual void Run();
};

#endif // DEVTOOLSACTIONSETHEADERS_H
