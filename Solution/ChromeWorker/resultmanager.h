#ifndef RESULTMANAGER_H
#define RESULTMANAGER_H

#include "devtoolsconnector.h"

class ResultManager
{
    DevToolsConnector *Connector = 0;
    int LastActionUniqueId = 0;
public:
    void Init(DevToolsConnector *Connector);
    Async ProcessResult(Async Result);
};

#endif // RESULTMANAGER_H
