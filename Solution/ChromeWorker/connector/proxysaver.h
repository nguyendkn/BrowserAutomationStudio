#ifndef PROXYSAVER_H
#define PROXYSAVER_H

#include <string>

class ProxySaver
{
private:
    std::string Generate(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password);

public:
    void Save(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password, const std::string &Path);
    void Reset(const std::string &Path);
};

#endif // PROXYSAVER_H
