#ifndef REQUESTLIST_H
#define REQUESTLIST_H

#include <map>
#include <string>
#include <vector>

class RequestList
{
    std::map<unsigned long long,long long> Requests;
    /*bool _IsWaiting = false;
    std::vector<unsigned long long> _WaitRequests;
    long long _WaitStarted;*/
public:
    void Add(unsigned long long id);
    void Remove(unsigned long long id);
    void RemoveOld();
    unsigned long long Oldest();
    int Size();

    /*void Wait();
    bool IsWaiting();
    bool IsFinished();*/

};

#endif // REQUESTLIST_H
