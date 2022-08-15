#include "idevtoolsconnector.h"
#include "replaceall.h"
#include <windows.h>
#include <fstream>

void IDevToolsConnector::ResetProxy(const std::string& ParentProcessId)
{
  // Create folder if needed
  std::string Folder(std::string("Worker/chrome/t/"));
  CreateDirectoryA(Folder.c_str(), NULL);
  Folder += ParentProcessId;
  CreateDirectoryA(Folder.c_str(), NULL);

  // Generate proxy data
  GlobalState.ProxySaver->Reset(Folder + std::string("/s"));
}
