#ifndef DEVTOOLSACTIONGETTABS_H
#define DEVTOOLSACTIONGETTABS_H

#include "idevtoolsaction.h"

class DevToolsActionGetTabs : public IDevToolsAction
{
public:
    virtual void Run();
    virtual void OnWebSocketMessage(const std::string& Message);
};

#endif // DEVTOOLSACTIONGETTABS_H
