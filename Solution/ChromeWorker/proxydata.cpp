#include "proxydata.h"
#include "replaceall.h"
#include "writefile.h"
#include "aes.h"
#include <Windows.h>
#include "md5.h"

ProxyData::ProxyData()
{
    Clear();
}

bool ProxyData::IsEqual(const ProxyData& Proxy)
{
    return Server == Proxy.Server &&
           Port == Proxy.Port &&
           ProxyType == Proxy.ProxyType &&
           UserName == Proxy.UserName &&
           Password == Proxy.Password &&
           IsNull == Proxy.IsNull;

}

void ProxyData::Write()
{
    std::string path = std::string("t/") + std::to_string(GetCurrentProcessId()) + std::string("/s");
    std::string data;

    if(IsNull)
    {
        data = std::string("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23\xa5\x68\xe4\xb4\x0d\xb4\x06\xfd\x29\xdb\x14\x9b\xe3\x56\x3b\xb1\x29\x00\x00\x00\x9f\x1d\x56\x48\xcf\x61\x27\xd7\xfc\x8d\x18\x4e\x89\xfd\x2e\x59\x72\x11\x95\xa4\x89\xcb\x7f\xe6\xc4\x44\x06\xd8\xf8\xc2\xd1\x8a\xd6\x18\xb7\x8f\xdb\xda\x48\x41\xd7\x23\x4d\x43\x00",88);

    }else
    {
        std::string proxy_type_string = "3";
        if(ProxyType == Socks4)
        {
            proxy_type_string = "4";
        }else if(ProxyType == Socks5)
        {
            proxy_type_string = "5";
        }
        std::string proxy =
                Server + std::string("|") +
                std::to_string(Port) + std::string("|") +
                UserName + std::string("|") +
                Password + std::string("|") +
                proxy_type_string + std::string("|2|29815|0|0|1111|SCAP_END!");

        data += std::string("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23",23);
        data += md5(proxy);
        int len = proxy.length();
        data += (len) & 0xFF;
        data += (len >> 8) & 0xFF;
        data += (len >> 16) & 0xFF;
        data += (len >> 24) & 0xFF;
        data += encrypt_aes_cfb_128(proxy,std::string("*&-sockscap64-&*",16),std::string("0000000000000000",16));
        data += std::string("\x23\x4d\x43\x00",4);
    }

    try
    {
        std::remove(path.data());
    }catch(...)
    {

    }
    WriteStringToFile(path,data);
}

void ProxyData::Clear()
{
    Server.clear();
    Port = 0;
    ProxyType = Http;
    UserName.clear();
    Password.clear();
    IsNull = true;
}



std::string ProxyData::AuthToString()
{
    if(UserName.empty() || Password.empty())
        return std::string();

    return ReplaceAll(UserName,":","%3A") + ":" + ReplaceAll(Password,":","%3A");
}

std::string ProxyData::ToString()
{
    std::string res;
    if(IsNull)
        return res;

    if(ProxyType == Socks4)
    {
        res += "socks4";
    }else if(ProxyType == Socks5)
    {
        res += "socks5h";
    }else if(ProxyType == Http)
    {
        res += "http";
    }
    res += "://";
    res += Server;
    res += ":";
    res += std::to_string(Port);
    return res;
}

