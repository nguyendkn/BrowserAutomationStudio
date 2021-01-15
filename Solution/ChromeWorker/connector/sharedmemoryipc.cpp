#include "sharedmemoryipc.h"

void SharedMemoryIPC::SetError(const std::string& CurrentErrorString)
{
    IsError = true;
    this->ErrorString = CurrentErrorString;
}
void SharedMemoryIPC::ClearError()
{
    IsError = false;
    ErrorString.clear();
}
int32_t SharedMemoryIPC::GetWord(int Offset)
{
    if(!Data)
        return -1;

    int32_t Res = 0;

    Res += Data[Offset];
    Res += Data[Offset + 1] << 8;
    Res += Data[Offset + 2] << 16;
    Res += Data[Offset + 3] << 24;

    return Res;
}
void SharedMemoryIPC::SetWord(int Offset, int32_t Number)
{
    if(!Data)
        return;

    Data[Offset] = (unsigned char)((Number & 0xFF));
    Data[Offset + 1] = (unsigned char)((Number >> 8) & 0xFF);
    Data[Offset + 2] = (unsigned char)((Number >> 16) & 0xFF);
    Data[Offset + 3] = (unsigned char)((Number >> 24) & 0xFF);

}

unsigned char SharedMemoryIPC::GetByte(int Offset)
{
    if(!Data)
        return 0;

    return Data[Offset];
}

void SharedMemoryIPC::SetByte(int Offset, unsigned char Number)
{
    if(!Data)
        return;

    Data[Offset] = Number;
}

std::string SharedMemoryIPC::GetString(int Offset)
{
    if(!Data)
        return std::string();

    return std::string((const char *)(Data +Offset));
}
void SharedMemoryIPC::SetString(int Offset, const std::string& Text)
{
    if(!Data)
        return;
    if(!Text.empty())
        memcpy(Data + Offset,Text.data(),Text.length());
    Data[Offset + Text.length()] = 0;
}
SharedMemoryIPC::SharedMemoryIPC()
{
}

SharedMemoryIPC::~SharedMemoryIPC()
{
    Stop();
}

bool SharedMemoryIPC::Start(const std::string& Id)
{
    #if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
        Stop();
        this->MemoryName = std::string("BASMLAMEMORY") + Id;
        this->MutexName = std::string("BASMLAMUTEX") + Id;

        MappingHandler = CreateFileMappingA(INVALID_HANDLE_VALUE, NULL, PAGE_READWRITE, 0, SHARED_MEMORY_IPC_BUF_SIZE,  MemoryName.c_str());

        if(MappingHandler == NULL)
        {
            Stop();
            SetError(std::string("Error during file mapping creation: ") + std::to_string(GetLastError()));
            return false;
        }

        Data = (unsigned char *)MapViewOfFile(MappingHandler, FILE_MAP_ALL_ACCESS,0,0,SHARED_MEMORY_IPC_BUF_SIZE);

        if(Data == NULL)
        {
            Stop();
            SetError(std::string("Error during opening file mapping: ") + std::to_string(GetLastError()));
            return false;
        }

        memset(Data,0,SHARED_MEMORY_IPC_BUF_SIZE);

        //Set version
        Data[0] = 1;

        MutexHandler = CreateMutexA(0,false,MutexName.c_str());

        if(MutexHandler == NULL)
        {
            Stop();
            SetError(std::string("Error creating mutex: ") + std::to_string(GetLastError()));
            return false;
        }

        IsStarted = true;

        return true;
    #else
        SetError("Wrong platform");
        return false;
    #endif

}

bool SharedMemoryIPC::Connect(const std::string& Id)
{
    #if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
        Stop();

        this->MemoryName = std::string("BASMLAMEMORY") + Id;
        this->MutexName = std::string("BASMLAMUTEX") + Id;

        MappingHandler = OpenFileMappingA(FILE_MAP_ALL_ACCESS, false,  MemoryName.c_str());

        if(MappingHandler == NULL)
        {
            Stop();
            SetError(std::string("Error during file mapping creation: ") + std::to_string(GetLastError()));
            return false;
        }

        Data = (unsigned char *)MapViewOfFile(MappingHandler, FILE_MAP_ALL_ACCESS,0,0,SHARED_MEMORY_IPC_BUF_SIZE);

        if(Data == NULL)
        {
            Stop();
            SetError(std::string("Error during opening file mapping: ") + std::to_string(GetLastError()));
            return false;
        }

        //Set version
        if(Data[0] != 1)
        {
            Stop();
            SetError(std::string("Wrong version of file mapper: ") + std::to_string(Data[0]));
            return false;
        }

        MutexHandler = OpenMutexA(MUTEX_ALL_ACCESS,false,MutexName.c_str());


        if(MutexHandler == NULL)
        {
            Stop();
            SetError(std::string("Error opening mutex: ") + std::to_string(GetLastError()));
            return false;
        }

        IsStarted = true;

        return true;
    #else
        SetError("Wrong platform");
        return false;
    #endif

}


bool SharedMemoryIPC::Stop()
{
    ClearError();
    MemoryName.clear();
    MutexName.clear();

    #if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
        if(Data)
            UnmapViewOfFile(Data);

        Data = 0;

        if(MappingHandler)
            CloseHandle(MappingHandler);

        MappingHandler = 0;

        if(MutexHandler)
            CloseHandle(MutexHandler);

        MutexHandler = 0;

        IsStarted = false;


    #else
        Data = 0;
        MappingHandler = 0;
        MutexHandler = 0;
        IsStarted = false;
    #endif

    return true;


}

bool SharedMemoryIPC::Lock()
{
    ClearError();

    if(!IsStarted)
    {
        SetError(std::string("Need to start first"));
        return false;
    }

    #if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
        WaitForSingleObject(MutexHandler,INFINITE);
    #endif

    return true;
}

bool SharedMemoryIPC::Unlock()
{
    ClearError();

    if(!IsStarted)
    {
        SetError(std::string("Need to start first"));
        return false;
    }
    #if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
        ReleaseMutex(MutexHandler);
    #endif
    return true;
}

unsigned char* SharedMemoryIPC::GetImagePointer()
{
    if(!Data)
        return 0;

    return Data + SHARED_MEMORY_OFFSET_IMAGE_DATA + 4;
}

int32_t SharedMemoryIPC::GetImageWidth()
{
    return GetWord(SHARED_MEMORY_OFFSET_IMAGE_WIDTH);
}

void SharedMemoryIPC::SetImageWidth(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_IMAGE_WIDTH, Value);
}

int32_t SharedMemoryIPC::GetImageHeight()
{
    return GetWord(SHARED_MEMORY_OFFSET_IMAGE_HEIGHT);
}

void SharedMemoryIPC::SetImageHeight(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_IMAGE_HEIGHT, Value);
}

int32_t SharedMemoryIPC::GetImageId()
{
    return GetWord(SHARED_MEMORY_OFFSET_IMAGE_ID);
}

void SharedMemoryIPC::SetImageId(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_IMAGE_ID, Value);
}

int32_t SharedMemoryIPC::GetImageSize()
{
    return GetWord(SHARED_MEMORY_OFFSET_IMAGE_DATA);
}

void SharedMemoryIPC::SetImageSize(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_IMAGE_DATA, Value);
}

bool SharedMemoryIPC::GetIsStarted()
{
    return IsStarted;
}

bool SharedMemoryIPC::GetIsError()
{
    return IsError;
}

std::string SharedMemoryIPC::GetErrorString()
{
    return ErrorString;
}

SharedMemoryIPCLockGuard::SharedMemoryIPCLockGuard(SharedMemoryIPC * IPC)
{
    this->IPC = IPC;
    IPC->Lock();
}

SharedMemoryIPCLockGuard::~SharedMemoryIPCLockGuard()
{
    IPC->Unlock();
}
