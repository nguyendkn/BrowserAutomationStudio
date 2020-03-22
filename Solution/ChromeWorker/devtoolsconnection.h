#ifndef DEVTOOLSCONNECTION_H
#define DEVTOOLSCONNECTION_H

#include <string>

class DevClientSource;

class DevToolsConnection
{
    DevClientSource *_DevClientSource;

public:
    DevToolsConnection();
    void Start(int RemoteDebuggingPort);
    bool GetSourceFromUrlStart(const std::string& Url, int LineNumber, int ColumnNumber);
    bool GetSourceFromUrlEnd(std::string& Result);
};

#endif // DEVTOOLSCONNECTION_H
