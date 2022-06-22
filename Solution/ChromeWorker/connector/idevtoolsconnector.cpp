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

  // Path of file to write
  std::string Path = Folder + std::string("/s");

  // Generate proxy data
  std::string Data = std::string("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23\xa5\x68\xe4\xb4\x0d\xb4\x06\xfd\x29\xdb\x14\x9b\xe3\x56\x3b\xb1\x29\x00\x00\x00\x9f\x1d\x56\x48\xcf\x61\x27\xd7\xfc\x8d\x18\x4e\x89\xfd\x2e\x59\x72\x11\x95\xa4\x89\xcb\x7f\xe6\xc4\x44\x06\xd8\xf8\xc2\xd1\x8a\xd6\x18\xb7\x8f\xdb\xda\x48\x41\xd7\x23\x4d\x43\x00", 88);

  // Delete file
  DeleteFileA(Path.c_str());

  // Write it again
  std::ofstream outfile(Path, std::ios::binary);
  if (outfile.is_open())
  {
    outfile << Data;
  }
  outfile.flush();
  outfile.close();
}
