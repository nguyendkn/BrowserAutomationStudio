#include "requestlist.h"
#include <chrono>
#include "log.h"
#include "multithreading.h"


using namespace std::chrono;

void RequestList::Add(unsigned long long id)
{
    Requests[id] = duration_cast< milliseconds >( system_clock::now().time_since_epoch() ).count();
}

void RequestList::Remove(unsigned long long id)
{
    Requests.erase(id);
}

void RequestList::RemoveOld()
{
    long long limit = duration_cast< milliseconds >( system_clock::now().time_since_epoch() ).count() - 120000;
    auto i = Requests.begin();
    while (i != Requests.end())
    {
        if(i->second < limit)
            i = Requests.erase(i);
        else
            i++;
    }
}

unsigned long long RequestList::Oldest()
{
    unsigned long long res = 0;
    for(std::map<unsigned long long,long long>::iterator it = Requests.begin(); it != Requests.end(); ++it)
    {
        if(it->second < res || res == 0)
            res = it->second;
    }
    return res;
}

int RequestList::Size()
{
    return Requests.size();
}

/*void RequestList::Wait()
{
    _IsWaiting = true;
    _WaitRequests.clear();
    for(std::map<unsigned long long,long long>::iterator it = Requests.begin(); it != Requests.end(); ++it)
    {
        _WaitRequests.push_back(it->first);
    }
    _WaitStarted = duration_cast< milliseconds >( system_clock::now().time_since_epoch() ).count();
}

bool RequestList::IsWaiting()
{
    return _IsWaiting;
}

bool RequestList::IsFinished()
{
    if(!_IsWaiting)
    {
        return true;
    }
    long long now = duration_cast< milliseconds >( system_clock::now().time_since_epoch() ).count();
    if(now - _WaitStarted > 5000)
    {
        _IsWaiting = false;
        return true;
    }

    for(unsigned long long Id: _WaitRequests)
    {
        auto it = Requests.find(Id);
        if(it != Requests.end())
           return false;
    }


    return false;
}*/

