#include "proxysaver.h"
#include "replaceall.h"
#include <fstream>
#include "md5.h"
#include "aes.h"

std::string ProxySaver::Generate(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password)
{
    std::string data;

    if (Server.empty())
    {
        data = std::string("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23\xa5\x68\xe4\xb4\x0d\xb4\x06\xfd\x29\xdb\x14\x9b\xe3\x56\x3b\xb1\x29\x00\x00\x00\x9f\x1d\x56\x48\xcf\x61\x27\xd7\xfc\x8d\x18\x4e\x89\xfd\x2e\x59\x72\x11\x95\xa4\x89\xcb\x7f\xe6\xc4\x44\x06\xd8\xf8\xc2\xd1\x8a\xd6\x18\xb7\x8f\xdb\xda\x48\x41\xd7\x23\x4d\x43\x00", 88);
    }
    else
    {
        std::string proxy_type_string = "3";
        if (!IsHttp)
        {
            proxy_type_string = "5";
        }
        std::string proxy =
            Server + std::string("|") +
            std::to_string(Port) + std::string("|") +
            ReplaceAll(Login, "|", "") + std::string("|") +
            ReplaceAll(Password, "|", "") + std::string("|") +
            proxy_type_string + std::string("|2|29815|0|0|1111|SCAP_END!");

        data += std::string("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23", 23);
        data += md5(proxy);
        int len = proxy.length();
        data += (len)&0xFF;
        data += (len >> 8) & 0xFF;
        data += (len >> 16) & 0xFF;
        data += (len >> 24) & 0xFF;
        data += encrypt_aes_cfb_128(proxy, std::string("*&-sockscap64-&*", 16), std::string("0000000000000000", 16));
        data += std::string("\x23\x4d\x43\x00", 4);
    }

    return data;
}

void ProxySaver::Save(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password, const std::string &Path)
{
    try
    {
        std::ofstream outfile(Path, std::ios::binary);
        if (outfile.is_open())
        {
            outfile << Generate(Server, Port, IsHttp, Login, Password);
        }
        outfile.flush();
        outfile.close();
    }
    catch (...)
    {
    }
}