#ifndef MODULEDLL_H
#define MODULEDLL_H

extern "C" {
typedef char* (*ResizeFunction)(int,void*);

__declspec(dllexport) void* StartDll();
__declspec(dllexport) void EndDll(void * DllData);
__declspec(dllexport) void* StartThread();
__declspec(dllexport) void EndThread(void * ThreadData);

__declspec(dllexport) void StringToDate(char *InputJson, ResizeFunction AllocateSpace, void* AllocateData, void* DllData, void* ThreadData, unsigned int ThreadId, bool *NeedToStop, bool* WasError);
__declspec(dllexport) void DateToString(char *InputJson, ResizeFunction AllocateSpace, void* AllocateData, void* DllData, void* ThreadData, unsigned int ThreadId, bool *NeedToStop, bool* WasError);
__declspec(dllexport) void SystemTimezone(char *InputJson, ResizeFunction AllocateSpace, void* AllocateData, void* DllData, void* ThreadData, unsigned int ThreadId, bool *NeedToStop, bool* WasError);

}

#endif // MODULEDLL_H
