#include "proxyconfigreplace.h"

#include "replaceall.h"
#include "log.h"
#include "converter.h"
#include "MinHook.h"

std::wstring pid;
HANDLE CreateToolhelp32SnapshotRes = 0;
std::vector<THREADENTRY32> threads;
int ThreadIndex = 0;
bool Disabled = false;

void PrecomputeThreads()
{
    if(CreateToolhelp32SnapshotRes)
        return;
    //PATCH_LOG("PrecomputeThreads Start");
    DWORD PID = GetCurrentProcessId();
    CreateToolhelp32SnapshotRes = CreateToolhelp32Snapshot(4, GetCurrentProcessId());
    THREADENTRY32 te32;
    te32.dwSize = sizeof(THREADENTRY32);
    if(!Thread32First(CreateToolhelp32SnapshotRes,&te32))
    {
        return;
    }
    if(PID == te32.th32OwnerProcessID)
        threads.push_back(te32);

    do
    {
        if(PID == te32.th32OwnerProcessID)
            threads.push_back(te32);
    } while( Thread32Next(CreateToolhelp32SnapshotRes, &te32 ) );
    //PATCH_LOG(std::string("PrecomputeThreads End, threads.size == ") + std::to_string(threads.size()) );
}

typedef
HANDLE
(WINAPI *BAS_TYPE_CreateFileW)(
    LPCWSTR,
    DWORD,
    DWORD,
    LPSECURITY_ATTRIBUTES,
    DWORD,
    DWORD,
    HANDLE
    );

typedef
FARPROC
(WINAPI *BAS_TYPE_GetProcAddress)(
  HMODULE,
  LPCSTR
);

typedef
BOOL
(WINAPI *BAS_TYPE_CloseHandle)(
  HANDLE
);


BAS_TYPE_CreateFileW BAS_POINTER_CreateFileW = NULL;
BAS_TYPE_GetProcAddress BAS_POINTER_GetProcAddress = NULL;
BAS_TYPE_CloseHandle BAS_POINTER_CloseHandle = NULL;

HANDLE WINAPI BAS_REPLACED_CreateFileW(LPCWSTR lpFileName, DWORD dwDesiredAccess, DWORD dwShareMode, LPSECURITY_ATTRIBUTES lpSecurityAttributes, DWORD dwCreationDisposition, DWORD dwFlagsAndAttributes, HANDLE hTemplateFile)
{
    std::wstring str(lpFileName);
    //PATCH_LOG("CreateFileW Start");


    //PATCH_LOG(std::string("CreateFileW ") + std::to_string(str.size()));
    //PATCH_LOG(std::string("CreateFileW ") + ws2s(str));


    std::size_t pos = str.find(L"_spd.cfg");
    if(pos != std::string::npos)
    {
        ReplaceAllInPlace(str,std::wstring(L"config\\_spd.cfg"),std::wstring(L"t\\") + pid + std::wstring(L"\\s"));
        ReplaceAllInPlace(str,std::wstring(L"config/_spd.cfg"),std::wstring(L"t/") + pid + std::wstring(L"/s"));
    }else
    {
        pos = str.find(L"proxyrule.ini");
        if(pos != std::string::npos)
        {
            ReplaceAllInPlace(str,std::wstring(L"config\\proxyrule.ini"),std::wstring(L"t\\") + pid + std::wstring(L"\\p"));
            ReplaceAllInPlace(str,std::wstring(L"config/proxyrule.ini"),std::wstring(L"t/") + pid + std::wstring(L"/p"));
        }else
        {
            pos = str.find(L"localhost.ini");
            if(pos != std::string::npos)
            {
                ReplaceAllInPlace(str,std::wstring(L"config\\localhost.ini"),std::wstring(L"t\\") + pid + std::wstring(L"\\l"));
                ReplaceAllInPlace(str,std::wstring(L"config/localhost.ini"),std::wstring(L"t/") + pid + std::wstring(L"/l"));
            }else
            {
                pos = str.find(L"filter.ini");
                if(pos != std::string::npos)
                {
                    ReplaceAllInPlace(str,std::wstring(L"config\\filter.ini"),std::wstring(L"t\\") + pid + std::wstring(L"\\f"));
                    ReplaceAllInPlace(str,std::wstring(L"config/filter.ini"),std::wstring(L"t/") + pid + std::wstring(L"/f"));
                }
            }
        }
    }
    //PATCH_LOG("CreateFileW Update");

    HANDLE res = BAS_POINTER_CreateFileW(str.data(),dwDesiredAccess,dwShareMode,lpSecurityAttributes,dwCreationDisposition,dwFlagsAndAttributes,hTemplateFile);

    //PATCH_LOG("CreateFileW End");

    return res;
}

HANDLE WINAPI BAS_REPLACED_CreateToolhelp32Snapshot(DWORD dwFlags, DWORD th32ProcessID)
{
    //PATCH_LOG("CreateToolhelp32Snapshot Start");
    if(Disabled)
    {
        return CreateToolhelp32Snapshot(dwFlags, th32ProcessID);
    }

    PrecomputeThreads();

    //PATCH_LOG("CreateToolhelp32Snapshot End");
    return CreateToolhelp32SnapshotRes;
    //return CreateToolhelp32Snapshot(dwFlags, th32ProcessID);
}

BOOL WINAPI BAS_REPLACED_CloseHandle(HANDLE h)
{
    ////PATCH_LOG("CloseHandle Start");

    if(h == CreateToolhelp32SnapshotRes)
    {
        //PATCH_LOG("CloseHandle CreateToolhelp32SnapshotRes");
        return TRUE;
    }
    ////PATCH_LOG("CloseHandle Update");
    BOOL res = BAS_POINTER_CloseHandle(h);
    ////PATCH_LOG("CloseHandle End");
    return res;
}

BOOL WINAPI BAS_REPLACED_Thread32First(HANDLE hSnapshot, LPTHREADENTRY32 lpte)
{
    //PATCH_LOG("Thread32First Start");

    if(hSnapshot == CreateToolhelp32SnapshotRes && !Disabled)
    {
        //PATCH_LOG("Thread32First CreateToolhelp32SnapshotRes");

        ThreadIndex = 0;
        if(ThreadIndex >= threads.size())
        {
            //PATCH_LOG("Thread32First FALSE");
            return FALSE;
        }

        lpte->cntUsage = threads[ThreadIndex].cntUsage;
        lpte->dwFlags = threads[ThreadIndex].dwFlags;
        lpte->dwSize = threads[ThreadIndex].dwSize;
        lpte->th32OwnerProcessID = threads[ThreadIndex].th32OwnerProcessID;
        lpte->th32ThreadID = threads[ThreadIndex].th32ThreadID;
        lpte->tpBasePri = threads[ThreadIndex].tpBasePri;
        lpte->tpDeltaPri = threads[ThreadIndex].tpDeltaPri;
        ThreadIndex++;
        //PATCH_LOG("Thread32First TRUE");
        return TRUE;
    }
    //PATCH_LOG("Thread32First Update");
    BOOL res = Thread32First(hSnapshot, lpte);
    //PATCH_LOG("Thread32First End");
    return res;
}


BOOL WINAPI BAS_REPLACED_Thread32Next(HANDLE hSnapshot,LPTHREADENTRY32 lpte)
{
    //PATCH_LOG("Thread32Next Start");

    if(hSnapshot == CreateToolhelp32SnapshotRes && !Disabled)
    {
        //PATCH_LOG("Thread32Next CreateToolhelp32SnapshotRes");

        if(ThreadIndex >= threads.size())
        {
            //PATCH_LOG("Thread32Next FALSE");
            return FALSE;
        }

        lpte->cntUsage = threads[ThreadIndex].cntUsage;
        lpte->dwFlags = threads[ThreadIndex].dwFlags;
        lpte->dwSize = threads[ThreadIndex].dwSize;
        lpte->th32OwnerProcessID = threads[ThreadIndex].th32OwnerProcessID;
        lpte->th32ThreadID = threads[ThreadIndex].th32ThreadID;
        lpte->tpBasePri = threads[ThreadIndex].tpBasePri;
        lpte->tpDeltaPri = threads[ThreadIndex].tpDeltaPri;
        ThreadIndex++;
        //PATCH_LOG("Thread32Next TRUE");
        return TRUE;
    }
    //PATCH_LOG("Thread32Next Update");
    BOOL res = Thread32Next(hSnapshot, lpte);
    //PATCH_LOG("Thread32Next End");
    return res;
}


FARPROC WINAPI BAS_REPLACED_GetProcAddress(HMODULE hModule, LPCSTR lpProcName)
{
    //PATCH_LOG("GetProcAddress Start");

    FARPROC res1 = BAS_POINTER_GetProcAddress(hModule, lpProcName);
    //PATCH_LOG("GetProcAddress Update");

    if(res1 != NULL)
    {
        FARPROC res2 = BAS_POINTER_GetProcAddress(hModule, "CreateToolhelp32Snapshot");
        if(res1 == res2)
        {
            //PATCH_LOG("GetProcAddress CreateToolhelp32Snapshot");
            return (FARPROC)BAS_REPLACED_CreateToolhelp32Snapshot;
        }

        FARPROC res3 = BAS_POINTER_GetProcAddress(hModule, "Thread32First");
        if(res1 == res3)
        {
            //PATCH_LOG("GetProcAddress Thread32First");
            return (FARPROC)BAS_REPLACED_Thread32First;
        }

        FARPROC res4 = BAS_POINTER_GetProcAddress(hModule, "Thread32Next");
        if(res1 == res4)
        {
            //PATCH_LOG("GetProcAddress Thread32Next");
            return (FARPROC)BAS_REPLACED_Thread32Next;
        }
    }
    //PATCH_LOG("GetProcAddress End");

    return res1;
}

void ProxyConfigReplace::SetPid(const std::wstring& Pid)
{
    pid = Pid;
}

void ProxyConfigReplace::Replace()
{
    if (MH_CreateHook(&CreateFileW, &BAS_REPLACED_CreateFileW, reinterpret_cast<LPVOID*>(&BAS_POINTER_CreateFileW)) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Initialize Failed MH_CreateHook");
        return;
    }

    if (MH_EnableHook(&CreateFileW) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Hook failed MH_EnableHook");
        return;
    }

    if (MH_CreateHook(&GetProcAddress, &BAS_REPLACED_GetProcAddress, reinterpret_cast<LPVOID*>(&BAS_POINTER_GetProcAddress)) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Initialize Failed MH_CreateHook");
        return;
    }

    if (MH_EnableHook(&GetProcAddress) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Hook failed MH_EnableHook");
        return;
    }

    if (MH_CreateHook(&CloseHandle, &BAS_REPLACED_CloseHandle, reinterpret_cast<LPVOID*>(&BAS_POINTER_CloseHandle)) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Initialize Failed MH_CreateHook");
        return;
    }

    if (MH_EnableHook(&CloseHandle) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Hook failed MH_EnableHook");
        return;
    }



}

void ProxyConfigReplace::Disable()
{
    if (MH_DisableHook(&GetProcAddress) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Hook failed MH_DisableHook");
        return;
    }

    if (MH_DisableHook(&CloseHandle) != MH_OK)
    {
        //PATCH_LOG("ProxyConfigReplace::Hook failed MH_DisableHook");
        return;
    }

    Disabled = true;
}
