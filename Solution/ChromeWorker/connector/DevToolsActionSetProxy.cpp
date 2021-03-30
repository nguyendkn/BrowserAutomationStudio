#include "DevToolsActionSetProxy.h"
#include "converter.h"
#include "replaceall.h"
#include "md5.h"
#include "aes.h"
#include <windows.h>
#include <fstream>
#include <chrono>

using namespace std::chrono;

std::string DevToolsActionSetProxy::GenerateProxyData(const std::string& Server, int Port, bool IsHttp, const std::string& Login, const std::string& Password)
{
    std::string data;

    if(Server.empty())
    {
        data = std::string("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23\xa5\x68\xe4\xb4\x0d\xb4\x06\xfd\x29\xdb\x14\x9b\xe3\x56\x3b\xb1\x29\x00\x00\x00\x9f\x1d\x56\x48\xcf\x61\x27\xd7\xfc\x8d\x18\x4e\x89\xfd\x2e\x59\x72\x11\x95\xa4\x89\xcb\x7f\xe6\xc4\x44\x06\xd8\xf8\xc2\xd1\x8a\xd6\x18\xb7\x8f\xdb\xda\x48\x41\xd7\x23\x4d\x43\x00", 88);
    } else
    {
        std::string proxy_type_string = "3";
        if(!IsHttp)
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
        data += (len) & 0xFF;
        data += (len >> 8) & 0xFF;
        data += (len >> 16) & 0xFF;
        data += (len >> 24) & 0xFF;
        data += encrypt_aes_cfb_128(proxy, std::string("*&-sockscap64-&*", 16), std::string("0000000000000000", 16));
        data += std::string("\x23\x4d\x43\x00", 4);
    }
    return data;
}

void DevToolsActionSetProxy::Run()
{
    //This action will do following steps:
    // 1) Stop new reqeusts from being send.
    // 2) Wait 3 seconds.
    // 3) Close all connections.
    // 4) Wait 3 seconds.
    // 5) Make all connection run through proxy.
    // 4) Wait 0.5 seconds.

    //Initialization

    WaitingForSetProxy = false;
    WaitingForResetAllConnections = false;
    WaitingForStopNetworkActivity = false;

    std::string Folder(GlobalState->ChromeExecutableLocation + std::string("/t/"));
    CreateDirectoryA(Folder.c_str(), NULL);
    Folder += GlobalState->ParentProcessId;
    CreateDirectoryA(Folder.c_str(), NULL);

    std::string Path = Folder + std::string("/s");

    //Stop new reqeusts from being send
    DeleteFileA(Path.c_str());
    std::string Data = GenerateProxyData("127.0.0.1", 0, true, std::string(), std::string());
    try
    {
        std::ofstream outfile(Path, std::ios::binary);
        if(outfile.is_open())
        {
            outfile << Data;
        }
        outfile.flush();
        outfile.close();
    } catch(...)
    {

    }

    //Wait 3 seconds
    FinishActionTime = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() + 3000;
    WaitingForStopNetworkActivity = true;
    SubscribbedEvents.push_back("Timer");
    State = Running;
}


void DevToolsActionSetProxy::OnWebSocketEvent(const std::string& Method, const std::string& Message)
{
    if(Method == "Timer")
    {
        long long Now = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
        if(Now > FinishActionTime)
        {
            if(WaitingForStopNetworkActivity)
            {
                //Initialization
                WaitingForSetProxy = false;
                WaitingForResetAllConnections = false;
                WaitingForStopNetworkActivity = false;

                std::string Folder(GlobalState->ChromeExecutableLocation + std::string("/t/"));
                CreateDirectoryA(Folder.c_str(), NULL);
                Folder += GlobalState->ParentProcessId;
                CreateDirectoryA(Folder.c_str(), NULL);

                //Path of file to write
                std::string Path = Folder + std::string("/s");
                std::string ResetPath = Folder + std::string("/r");


                //This will create file, which tells browser to reset all sockets
                try
                {
                    std::ofstream outfile(ResetPath, std::ios::binary);
                    if(outfile.is_open())
                    {
                        outfile << "reset";
                    }
                    outfile.flush();
                    outfile.close();
                } catch(...)
                {

                }

                FinishActionTime = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() + 3000;
                WaitingForResetAllConnections = true;
                return;
            }

            if(WaitingForResetAllConnections)
            {
                //Initialization
                WaitingForSetProxy = false;
                WaitingForResetAllConnections = false;
                WaitingForStopNetworkActivity = false;

                std::string Folder(GlobalState->ChromeExecutableLocation + std::string("/t/"));
                CreateDirectoryA(Folder.c_str(), NULL);
                Folder += GlobalState->ParentProcessId;
                CreateDirectoryA(Folder.c_str(), NULL);

                //Path of file to write
                std::string Path = Folder + std::string("/s");
                std::string ResetPath = Folder + std::string("/r");

                //Parse params
                std::string Server = Params["server"].String;
                Params.erase("server");

                int Port = Params["port"].Number;
                Params.erase("port");

                bool IsHttp = Params["is_http"].Boolean;
                Params.erase("is_http");

                std::string Login = Params["login"].String;
                Params.erase("login");

                std::string Password = Params["password"].String;
                Params.erase("password");

                DeleteFileA(Path.c_str());

                //Generate proxy data
                std::string Data = GenerateProxyData(Server, Port, IsHttp, Login, Password);

                //Set proxy
                try
                {
                    std::ofstream outfile(Path, std::ios::binary);
                    if(outfile.is_open())
                    {
                        outfile << Data;
                    }
                    outfile.flush();
                    outfile.close();
                } catch(...)
                {

                }

                FinishActionTime = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() + 500;
                WaitingForSetProxy = true;
                return;
            }

            if(WaitingForSetProxy)
            {
                WaitingForSetProxy = false;
                WaitingForResetAllConnections = false;
                WaitingForStopNetworkActivity = false;

                State = Finished;
                Result->Success();
                return;
            }



        }
    }
}
