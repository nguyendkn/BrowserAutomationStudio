#ifndef SHAREDMEMORYIPC_H
#define SHAREDMEMORYIPC_H

#include <string>
#include <vector>

#if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
    #include <windows.h>
#endif


#define SHARED_MEMORY_IPC_BUF_SIZE 16818223
#define SHARED_MEMORY_OFFSET_VERSION 0
#define SHARED_MEMORY_OFFSET_CURSOR_X 1
#define SHARED_MEMORY_OFFSET_CURSOR_Y 5
#define SHARED_MEMORY_OFFSET_INSPECT_X 9
#define SHARED_MEMORY_OFFSET_INSPECT_Y 13
#define SHARED_MEMORY_OFFSET_SCROLL_X 17
#define SHARED_MEMORY_OFFSET_SCROLL_Y 21
#define SHARED_MEMORY_OFFSET_BROWSER_SCROLL_X 25
#define SHARED_MEMORY_OFFSET_BROWSER_SCROLL_Y 29
#define SHARED_MEMORY_OFFSET_INSPECT_STATE 33
#define SHARED_MEMORY_OFFSET_INSPECT_RESULT 34
#define SHARED_MEMORY_OFFSET_HIGHLIGHT_REQUEST 4130
#define SHARED_MEMORY_OFFSET_HIGHLIGHT_RESPONCE 8226
#define SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_LENGTH 24610
#define SHARED_MEMORY_OFFSET_EVENTS_FROM_BROWSER_DATA 24611
#define SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_LENGTH 32803
#define SHARED_MEMORY_OFFSET_EVENTS_TO_BROWSER_DATA 32804
#define SHARED_MEMORY_OFFSET_IMAGE_WIDTH 40996
#define SHARED_MEMORY_OFFSET_IMAGE_HEIGHT 41000
#define SHARED_MEMORY_OFFSET_IMAGE_ID 41004
#define SHARED_MEMORY_OFFSET_IMAGE_DATA 41008

class SharedMemoryIPC
{
    bool IsStarted = false;
    bool IsError = false;
    std::string ErrorString;
    std::string MemoryName;
    std::string MutexName;

    #if defined(_WIN32) || defined(WIN32) || defined(OS_WIN)
        HANDLE MappingHandler = 0;
        HANDLE MutexHandler = 0;
    #else
        int MappingHandler = 0;
        int MutexHandler = 0;
    #endif

    unsigned char *Data = 0;
    void SetError(const std::string& ErrorString);
    void ClearError();
    int32_t GetWord(int Offset);
    void SetWord(int Offset, int32_t Number);
    unsigned char GetByte(int Offset);
    void SetByte(int Offset, unsigned char Number);
    std::string GetString(int Offset);
    void SetString(int Offset, const std::string& Text);
public:
    SharedMemoryIPC();
    ~SharedMemoryIPC();

    bool Start(const std::string& Id);
    bool Connect(const std::string& Id);
    bool Stop();
    bool Lock();
    bool Unlock();
    int32_t GetCursorX();
    void SetCursorX(int32_t Value);
    int32_t GetCursorY();
    void SetCursorY(int32_t Value);
    unsigned char GetInspectState();
    void SetInspectState(unsigned char Value);
    int32_t GetInspectX();
    void SetInspectX(int32_t Value);
    int32_t GetInspectY();
    void SetInspectY(int32_t Value);
    int32_t GetScrollX();
    void SetScrollX(int32_t Value);
    int32_t GetScrollY();
    void SetScrollY(int32_t Value);
    int32_t GetBrowserScrollX();
    void SetBrowserScrollX(int32_t Value);
    int32_t GetBrowserScrollY();
    void SetBrowserScrollY(int32_t Value);
    int32_t GetImageWidth();
    void SetImageWidth(int32_t Value);
    int32_t GetImageHeight();
    void SetImageHeight(int32_t Value);
    int32_t GetImageId();
    void SetImageId(int32_t Value);
    std::string GetImageData();
    void SetImageData(const std::string& Text);
    std::string GetInspectResult();
    void SetInspectResult(const std::string Text);
    std::string GetHighlightRequest();
    void SetHighlightRequest(const std::string Text);
    std::string GetHighlightResponce();
    void SetHighlightResponce(const std::string Text);
    void AddFromBrowserEvent(const std::string Text);
    std::vector<std::string> GetFromBrowserEvents();
    void AddToBrowserEvent(const std::string Text);
    std::vector<std::string> GetToBrowserEvents();

    bool GetIsStarted();
    bool GetIsError();
    std::string GetErrorString();
};

class SharedMemoryIPCLockGuard
{
    SharedMemoryIPC * IPC;
    public:
    SharedMemoryIPCLockGuard(SharedMemoryIPC * IPC);
    ~SharedMemoryIPCLockGuard();
};

#endif // SHAREDMEMORYIPC_H
