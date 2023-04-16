#include "proxysaver.h"
#include "replaceall.h"
#include <windows.h>
#include <fstream>
#include <vector>
#include <algorithm>
#include "converter.h"
#include "readallfile.h"
#include "md5.h"
#include "aes.h"

void ProxySaver::Initialize(const std::string &ParentProcessId)
{
    this->ParentProcessId = ParentProcessId;
}

std::wstring ProxySaver::GetConfigFilePath(const std::string& Filename)
{
    std::vector<wchar_t> buffer(MAX_PATH);
    int size = GetModuleFileName(NULL, buffer.data(), MAX_PATH);
    buffer.resize(size);
    for(size_t i = 0;i<buffer.size();i++)
    {
        if(buffer[i] == L'/')
        {
            buffer[i] = L'\\';
        }
    }
    wchar_t separator[] = {L'\\'};
    std::vector<wchar_t>::iterator it = std::find_end(buffer.begin(), buffer.end(), separator, separator + 1);
    size = it - buffer.begin();
    buffer.resize(size);
    it = std::find_end(buffer.begin(), buffer.end(), separator, separator + 1);
    size = it - buffer.begin() + 1;
    buffer.resize(size);

    std::wstring Result = std::wstring(buffer.data(),buffer.size());

    Result += std::wstring(L"t");
    CreateDirectoryW(Result.c_str(), NULL);

    Result += std::wstring(L"\\") + s2ws(ParentProcessId);
    CreateDirectoryW(Result.c_str(), NULL);

    Result += std::wstring(L"\\") + s2ws(Filename);

    return Result;
}

void ProxySaver::WriteConfigFile(const std::string& Filename, const std::string& Data)
{
    std::wstring Path = GetConfigFilePath(Filename);
    DeleteFileW(Path.c_str());
    try
    {
        std::ofstream outfile(Path, std::ios::binary);
        if (outfile.is_open())
        {
            outfile << Data;
        }
        outfile.flush();
        outfile.close();
    }
    catch (...)
    {
    }
}


std::string ProxySaver::GenerateProxyConfig(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password)
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

void ProxySaver::WriteProxyConfig(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password)
{
    std::string ConfigData = GenerateProxyConfig(Server, Port, IsHttp, Login, Password);
    WriteConfigFile("s", ConfigData);
}

void ProxySaver::WriteDirectConnectionConfig()
{
    WriteProxyConfig(std::string(), 0, true, std::string(), std::string());
}

bool ProxySaver::IsCurrentProxyConfigEquals(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password)
{
    std::string OldProxyData = GenerateProxyConfig(Server, Port, IsHttp, Login, Password);
    std::string NewProxyData = ReadAllString(GetConfigFilePath("s"));
    return OldProxyData == NewProxyData;
}

void ProxySaver::ResetAllConnections()
{
    WriteConfigFile("r", "reset");
}

void ProxySaver::ResetDPI()
{
    WriteConfigFile("dpi", "reset");
}

void ProxySaver::SetMinCapturePeriod(int MinCapturePeriod)
{
    WriteConfigFile("f", std::to_string(MinCapturePeriod));
}

void ProxySaver::TriggerExtensionButton(const std::string& ExtensionId)
{
    WriteConfigFile(ExtensionId, "-");
}
