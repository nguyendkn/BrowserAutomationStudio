#ifndef DEVTOOLSACTIONSETPROXY_H
#define DEVTOOLSACTIONSETPROXY_H

#include "idevtoolsaction.h"

class DevToolsActionSetProxy : public IDevToolsAction
{
	std::string GenerateProxyData(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password);
public:
	virtual void Run();
};

#endif // DEVTOOLSACTIONSETPROXY_H
