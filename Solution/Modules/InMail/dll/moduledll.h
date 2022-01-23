#ifndef MODULEDLL_H
#define MODULEDLL_H

#include <boost/thread.hpp>
#include <chrono>
#include <atomic>

class Timer
{
	boost::thread sleepyThread;

	public:
		~Timer();

		template <typename Function>
		void setTimeout(Function function, int delay);

		template <typename Function>
		void setInterval(Function function, int interval);

		void stop();
};

Timer::~Timer()
{
	//We should never leave the sleepy thread alone.
	stop();
}

void Timer::stop()
{
	//Stop the thread from sleep state
	sleepyThread.interrupt();
	//Wait for exit
	if (sleepyThread.joinable())
	{
		try
		{
			sleepyThread.join();
		}
		catch (std::exception)
		{
			abort();
		}
	}
}

template <typename Function>
void Timer::setTimeout(Function function, int delay)
{
	//Check if there's a previous thread not finished, cancel it. 
	stop();

	sleepyThread = boost::thread([=]()
	{
		try
		{
			boost::this_thread::sleep_for(boost::chrono::milliseconds(delay));
			function();
		}
		catch (boost::thread_interrupted interrupted)
		{
			//Wake up.
		}
	});
}

template <typename Function>
void Timer::setInterval(Function function, int interval)
{
	//Check if there's a previous thread not finished, cancel it. 
	stop();

	sleepyThread = boost::thread([=]()
	{
		try
		{
			while (true)
			{
				boost::this_thread::sleep_for(boost::chrono::milliseconds(interval));
				function();
			}
		}
		catch (boost::thread_interrupted interrupted)
		{
			//Wake up.
		}
	});
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
