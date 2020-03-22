#include "sharedmemoryipc.h"
#include "log.h"

void SharedMemoryIPC::SetError(const std::string& ErrorString)
{
    IsError = true;
    this->ErrorString = ErrorString;
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

int32_t SharedMemoryIPC::GetCursorX()
{
    return GetWord(SHARED_MEMORY_OFFSET_CURSOR_X);
}

void SharedMemoryIPC::SetCursorX(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_CURSOR_X, Value);
}

int32_t SharedMemoryIPC::GetCursorY()
{
    return GetWord(SHARED_MEMORY_OFFSET_CURSOR_Y);
}

void SharedMemoryIPC::SetCursorY(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_CURSOR_Y, Value);
}

unsigned char SharedMemoryIPC::GetInspectState()
{
    return GetByte(SHARED_MEMORY_OFFSET_INSPECT_STATE);
}

void SharedMemoryIPC::SetInspectState(unsigned char Value)
{
    SetByte(SHARED_MEMORY_OFFSET_INSPECT_STATE, Value);
}

int32_t SharedMemoryIPC::GetInspectX()
{
    return GetWord(SHARED_MEMORY_OFFSET_INSPECT_X);
}

void SharedMemoryIPC::SetInspectX(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_INSPECT_X, Value);
}

int32_t SharedMemoryIPC::GetInspectY()
{
    return GetWord(SHARED_MEMORY_OFFSET_INSPECT_Y);
}

void SharedMemoryIPC::SetInspectY(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_INSPECT_Y, Value);
}

int32_t SharedMemoryIPC::GetScrollX()
{
    int32_t res = GetWord(SHARED_MEMORY_OFFSET_SCROLL_X);
    SetWord(SHARED_MEMORY_OFFSET_SCROLL_X, 0);
    return res;
}

void SharedMemoryIPC::SetScrollX(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_SCROLL_X, Value);
}


int32_t SharedMemoryIPC::GetScrollY()
{
    int32_t res = GetWord(SHARED_MEMORY_OFFSET_SCROLL_Y);
    SetWord(SHARED_MEMORY_OFFSET_SCROLL_Y, 0);
    return res;
}

void SharedMemoryIPC::SetScrollY(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_SCROLL_Y, Value);
}

int32_t SharedMemoryIPC::GetBrowserScrollX()
{
    return GetWord(SHARED_MEMORY_OFFSET_BROWSER_SCROLL_X);
}

void SharedMemoryIPC::SetBrowserScrollX(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_BROWSER_SCROLL_X, Value);
}

int32_t SharedMemoryIPC::GetBrowserScrollY()
{
    return GetWord(SHARED_MEMORY_OFFSET_BROWSER_SCROLL_Y);
}

void SharedMemoryIPC::SetBrowserScrollY(int32_t Value)
{
    SetWord(SHARED_MEMORY_OFFSET_BROWSER_SCROLL_Y, Value);
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

std::string SharedMemoryIPC::GetImageData()
{
    if(!Data)
        return std::string();
    return GetString(SHARED_MEMORY_OFFSET_IMAGE_DATA);
}

void SharedMemoryIPC::SetImageData(const std::string& Text)
{
    if(!Data)
        return;
    SetString(SHARED_MEMORY_OFFSET_IMAGE_DATA, Text);
}

std::string SharedMemoryIPC::GetInspectResult()
{
    if(!Data)
        return std::string();
    std::string res = GetString(SHARED_MEMORY_OFFSET_INSPECT_RESULT);
    SetString(SHARED_MEMORY_OFFSET_INSPECT_RESULT, std::string());
    return res;
}

void SharedMemoryIPC::SetInspectResult(const std::string Text)
{
    if(!Data)
        return;
    SetString(SHARED_MEMORY_OFFSET_INSPECT_RESULT, Text);
}

std::string SharedMemoryIPC::GetHighlightRequest()
{
    if(!Data)
        return std::string();
    std::string res = GetString(SHARED_MEMORY_OFFSET_HIGHLIGHT_REQUEST);
    SetString(SHARED_MEMORY_OFFSET_HIGHLIGHT_REQUEST, std::string());
    return res;
}

void SharedMemoryIPC::SetHighlightRequest(const std::string Text)
{
    if(!Data)
        return;
    SetString(SHARED_MEMORY_OFFSET_HIGHLIGHT_REQUEST, Text);
}

std::string SharedMemoryIPC::GetHighlightResponce()
{
    if(!Data)
        return std::string();
    std::string res = GetString(SHARED_MEMORY_OFFSET_HIGHLIGHT_RESPONCE);
    SetString(SHARED_MEMORY_OFFSET_HIGHLIGHT_RESPONCE, std::string());
    return res;
}

void SharedMemoryIPC::SetHighlightResponce(const std::string Text)
{
    if(!Data)
        return;
    SetString(SHARED_MEMORY_OFFSET_HIGHLIGHT_RESPONCE, Text);
}

void SharedMemoryIPC::AddFromBrowserEvent(const std::string Text)
{
    if(!Data)
        return;
    unsigned char Length = GetByte(SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_LENGTH);
    if(Length > 7)
    {
        return;
    }
    SetString(SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_DATA + Length * 1024,Text);
    SetByte(SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_LENGTH, Length + 1);
}

std::vector<std::string> SharedMemoryIPC::GetFromBrowserEvents()
{
    std::vector<std::string> Res;
    if(!Data)
        return Res;
    unsigned char Length = GetByte(SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_LENGTH);

    for(int i = 0;i<Length;i++)
    {
        std::string Text = GetString(SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_DATA + i * 1024);
        Res.push_back(Text);
    }
    SetByte(SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_LENGTH, 0);

    return Res;
}

void SharedMemoryIPC::AddToBrowserEvent(const std::string Text)
{
    if(!Data)
        return;
    unsigned char Length = GetByte(SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_LENGTH);
    if(Length > 7)
    {
        return;
    }
    SetString(SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_DATA + Length * 1024,Text);
    SetByte(SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_LENGTH, Length + 1);
}

std::vector<std::string> SharedMemoryIPC::GetToBrowserEvents()
{
    std::vector<std::string> Res;
    if(!Data)
        return Res;
    unsigned char Length = GetByte(SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_LENGTH);

    for(int i = 0;i<Length;i++)
    {
        std::string Text = GetString(SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_DATA + i * 1024);
        Res.push_back(Text);
    }
    SetByte(SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_LENGTH, 0);

    return Res;
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
