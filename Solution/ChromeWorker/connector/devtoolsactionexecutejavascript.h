#ifndef DEVTOOLSACTIONEXECUTEJAVASCRIPT_H
#define DEVTOOLSACTIONEXECUTEJAVASCRIPT_H

#include "idevtoolsaction.h"
class DevToolsActionExecuteJavascript :	public IDevToolsAction
{
    std::string ElementSelector;
    std::string Expression;
    std::string Variables;
    std::string InitialVariables;
    std::string LastMessage;
    std::string RemoteObjectId;
    std::string CurrentLoaderId;
    std::string CurrentPrefix;
    int CurrentNodeId = -1;
    int CurrentContextId = -1;
    std::string LocalObjectId;
    std::string CurrentFrame;
    std::vector<std::string> FrameCandidates;
    std::string CurrentFrameCandidate;
    bool ScrollDataWasObtained = false;
    bool IsDoingScrollRequest = false;
    bool UsesScrollData = false;
    bool UsesPositionData = false;
    int PositionX = 0;
    int PositionY = 0;
    int ScrollX = 0;
    int ScrollY = 0;
    enum {
        NodeSearch,
        FrameSearchEvaluate,
        FrameSearchGetNodeId,
        FrameSearchReleaseObject,
        FrameSearchGetPosition,
        FrameSearchGetFrameList,
        FrameSearchGetFrameId,
        FrameSearchGetFrameIdResult,
        JavascriptExecution
    }RequestType;
    void Next();
    void ParseFrameCandidates(const std::string& FrameMessage, const std::string ParentFrameId);
    void ParseFrameCandidatesIteration(picojson::object& Obj, const std::string ParentFrameId);
public:
    virtual void Run();
    virtual void OnWebSocketMessage(const std::string& Message);
};

#endif // DEVTOOLSACTIONEXECUTEJAVASCRIPT_H