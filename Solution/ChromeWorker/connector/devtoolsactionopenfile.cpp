#include "devtoolsactionopenfile.h"
#include <chrono>
#include <windows.h>
#include "converter.h"

using namespace std::chrono;

void DevToolsActionOpenFile::Run()
{
    //Parse params
    NodeId = Params["node_id"].Float;
    Params.erase("node_id");

    IsMultiple = Params["is_multiple"].Boolean;
    Params.erase("is_multiple");

    OpenFileDialogIsManual = GlobalState->OpenFileDialogIsManual;
    OpenFileDialogResult = GlobalState->OpenFileDialogResult;

    if(OpenFileDialogIsManual)
    {
        State = Running;
        OPENFILENAME ofn = {0};
        TCHAR szFile[4096]={0};
        ofn.lStructSize = sizeof(ofn);
        ofn.hwndOwner = NULL;
        ofn.lpstrFile = szFile;
        ofn.nMaxFile = sizeof(szFile);
        ofn.lpstrFilter = L"All\0*.*\0";
        ofn.nFilterIndex = 1;
        ofn.lpstrFileTitle = NULL;
        ofn.nMaxFileTitle = 0;
        ofn.lpstrInitialDir = NULL;
        ofn.Flags = OFN_PATHMUSTEXIST | OFN_FILEMUSTEXIST | OFN_EXPLORER;

        if(IsMultiple)
            ofn.Flags |= OFN_ALLOWMULTISELECT;

        if(GetOpenFileName(&ofn) == TRUE)
        {
            std::vector<Variant> Files;

            if(IsMultiple)
            {
                wchar_t* Pointer = ofn.lpstrFile;
                std::wstring Folder = Pointer;
                Pointer += ( Folder.length() + 1 );
                int FileNumber = 0;
                while ( *Pointer )
                {
                  std::wstring Filename = Pointer;
                  Pointer += ( Filename.length() + 1 );
                  Filename = Folder + L"/" + Filename;

                  Files.push_back(ws2s(Filename));
                  FileNumber++;
                }
                if(!FileNumber)
                {
                    Files.push_back(ws2s(Folder));
                }
            }else
            {
                std::wstring ResultFileWstring(ofn.lpstrFile);
                std::string ResultFile = ws2s(ResultFileWstring);
                Files.push_back(Variant(ResultFile));
            }

            std::map<std::string, Variant> CurrentParams;

            CurrentParams["backendNodeId"] = Variant(NodeId);
            CurrentParams["files"] = Variant(Files);

            SendWebSocket("DOM.setFileInputFiles", CurrentParams);

            State = Finished;
            Result->Success();
        }else
        {
            State = Finished;
            Result->Success();
        }
    }else
    {
        if (!OpenFileDialogResult.empty())
        {
            FinishActionTime = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count() + 1000;
            SubscribbedEvents.push_back("Timer");
            State = Running;
        }else
        {
            State = Finished;
            Result->Success();
        }
    }

}


void DevToolsActionOpenFile::OnWebSocketEvent(const std::string& Method, const std::string& Message)
{
    if(OpenFileDialogIsManual)
    {

    }else
    {
        if(Method == "Timer")
        {
            long long Now = duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
            if(Now > FinishActionTime)
            {

                std::vector<Variant> Files;
                picojson::value Json;

                std::string Error = picojson::parse(Json, OpenFileDialogResult);

                if (Error.empty() && Json.is<picojson::array>())
                {
                    for (const auto& File : Json.get<picojson::array>())
                    {
                        if (File.is<std::string>())
                        {
                            Files.push_back(File.get<std::string>());
                            if(!IsMultiple)
                                break;
                        }
                    }
                }
                else
                {
                    Files.push_back(OpenFileDialogResult);
                }

                std::map<std::string, Variant> CurrentParams;

                CurrentParams["backendNodeId"] = Variant(NodeId);
                CurrentParams["files"] = Variant(Files);

                SendWebSocket("DOM.setFileInputFiles", CurrentParams);

                State = Finished;
                Result->Success();
            }
        }
    }
}
