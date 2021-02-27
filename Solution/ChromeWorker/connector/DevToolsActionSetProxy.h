#ifndef DEVTOOLSACTIONSETPROXY_H
#define DEVTOOLSACTIONSETPROXY_H

#include "idevtoolsaction.h"

class DevToolsActionSetProxy : public IDevToolsAction
{
	std::string GenerateProxyData(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password);
	long long FinishActionTime = 0;
public:
	virtual void Run();
	virtual void OnWebSocketEvent(const std::string& Method, const std::string& Message);

};

#endif // DEVTOOLSACTIONSETPROXY_H
