#ifndef DEVTOOLSACTIONCLOSETAB_H
#define DEVTOOLSACTIONCLOSETAB_H

#include "idevtoolsaction.h"

class DevToolsActionCloseTab : public IDevToolsAction
{
    bool IsCurrentTabClosing = false;

public:
    virtual void Run();
    virtual void OnWebSocketMessage(const std::string& Message);
    virtual void OnWebSocketEvent(const std::string& Method, const std::string& Message);
};

#endif // DEVTOOLSACTIONCLOSETAB_H