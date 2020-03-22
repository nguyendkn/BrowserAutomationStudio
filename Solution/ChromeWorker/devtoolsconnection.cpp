#include "devtoolsconnection.h"
#include "devclientsource.h"


DevToolsConnection::DevToolsConnection()
{
    _DevClientSource = new DevClientSource();
}

void DevToolsConnection::Start(int RemoteDebuggingPort)
{
    _DevClientSource->Start(RemoteDebuggingPort);
}

bool DevToolsConnection::GetSourceFromUrlStart(const std::string& Url, int LineNumber, int ColumnNumber)
{
    return _DevClientSource->GetSourceFromUrlStart(Url, LineNumber, ColumnNumber);
}

bool DevToolsConnection::GetSourceFromUrlEnd(std::string& Result)
{
    return _DevClientSource->GetSourceFromUrlEnd(Result);
}
