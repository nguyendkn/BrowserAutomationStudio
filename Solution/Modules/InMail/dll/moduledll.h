#ifndef MODULEDLL_H
#define MODULEDLL_H

extern "C" {
typedef char *(*ResizeFunction)(int,void*);

__declspec(dllexport) void *StartDll();
__declspec(dllexport) void EndDll(void *DllData);
__declspec(dllexport) void *StartThread();
__declspec(dllexport) void EndThread(void *ThreadData);

__declspec(dllexport) void InMail_CurlInit(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlIsInit(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlSetOpts(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlRequest(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);
__declspec(dllexport) void InMail_CurlCleanup(char *InputJson, ResizeFunction AllocateSpace, void *AllocateData, void *DllData, void *ThreadData, unsigned int ThreadId, bool *NeedToStop, bool *WasError);

}

#endif // MODULEDLL_H
