#ifndef MODULEDLL_H
#define MODULEDLL_H

#include <thread>
#include <chrono>
#include <atomic>

class Timer
{
	std::atomic<bool> active{true};
	
    public:
		template <typename Function>
		void setTimeout(Function function, int delay);
		
		template <typename Function>
        void setInterval(Function function, int interval);
		
        void stop();
};

template <typename Function>
void Timer::setTimeout(Function function, int delay)
{
    active = true;
    std::thread t([=]() {
        if(!active.load()) return;
        std::this_thread::sleep_for(std::chrono::milliseconds(delay));
        if(!active.load()) return;
        function();
    });
    t.detach();
}

template <typename Function>
void Timer::setInterval(Function function, int interval)
{
    active = true;
    std::thread t([=]() {
        while(active.load()) {
            std::this_thread::sleep_for(std::chrono::milliseconds(interval));
            if(!active.load()) return;
            function();
        }
    });
    t.detach();
}

void Timer::stop()
{
    active = false;
}

extern "C" {
typedef char *(*ResizeFunction)(int,void*);

__declspec(dllexport) void *StartDll();
__declspec(dllexport) void EndDll(void *DllData);
__declspec(dllexport) void *StartThread();
__declspec(dllexport) void EndThread(void *ThreadData);

__declspec(dllexport) void InMail_CurlInit(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlIsInit(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlSetOpts(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_ClearTimeout(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlRequest(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlCleanup(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_Decoder(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_MultipleBase64ToOne(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);

}

#endif // MODULEDLL_H
