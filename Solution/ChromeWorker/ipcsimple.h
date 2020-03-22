#ifndef IPCSIMPLE_H
#define IPCSIMPLE_H

#include <string>
#include <vector>
#include <windows.h>

class IPCSimple
{
    std::string GenerateRandomId();
    std::string Id;
    HANDLE MappingHandler = 0;
    unsigned char *Data = 0;
    HANDLE MutexHandler = 0;



public:

    std::string Init(const std::string& IdDefault = std::string());
    bool Peek();
    std::string GetId();
    std::vector<std::string> Read();
    static bool Write(const std::string Id, const std::string& Message);
};

#endif // IPCSIMPLE_H
