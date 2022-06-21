#include "DevToolsActionSetProxy.h"
#include "converter.h"
#include <windows.h>
#include <fstream>
#include <chrono>

using namespace std::chrono;

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
    GlobalState->ProxySaver->Save("127.0.0.1", 0, true, std::string(), std::string(), Path);

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

                //Generate proxy data
                GlobalState->ProxySaver->Save(Server, Port, IsHttp, Login, Password, Path);

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
