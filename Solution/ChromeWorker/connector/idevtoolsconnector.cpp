#include "idevtoolsconnector.h"
#include <windows.h>

void IDevToolsConnector::ResetProxy(const std::string& ParentProcessId)
{
  // Create folder if needed
  std::string Folder(GlobalState.ChromeExecutableLocation + std::string("/t/"));
  CreateDirectoryA(Folder.c_str(), NULL);
  Folder += ParentProcessId;
  CreateDirectoryA(Folder.c_str(), NULL);

  // Generate proxy data
  GlobalState.ProxySaver->Reset(Folder + std::string("/s"));
}
