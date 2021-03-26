#ifndef DEVTOOLSACTIONEXECUTEJAVASCRIPT_H
#define DEVTOOLSACTIONEXECUTEJAVASCRIPT_H

#include "idevtoolsaction.h"
class DevToolsActionExecuteJavascript :	public IDevToolsAction
{
    std::vector<std::pair<std::string, std::string> > ElementSelector;
    std::string Expression;
    std::string Variables;
    std::string InitialVariables;
    std::string LastMessage;
    std::string RemoteObjectId;
    std::string CurrentLoaderId;
    std::vector<std::pair<std::string, std::string> > CurrentPrefix;
    int CurrentNodeId = -1;
    int CurrentContextId = -1;
    std::string LocalObjectId;
    std::string CurrentFrame;
    std::vector<std::string> FrameCandidates;
    std::string CurrentFrameCandidate;
    bool ScrollDataWasObtained = false;
    bool IsDoingScrollRequest = false;
    bool IsDoingScroll = false;
    bool UsesScrollData = false;
    bool UsesPositionData = false;
    bool DoScroll = false;
    int PositionX = 0;
    int PositionY = 0;
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
    std::vector<std::pair<std::string, std::string> > ParseSelector(const std::string& SelectorString);
    std::string SerializeSelector(const std::vector<std::pair<std::string, std::string> >& SelectorData);
    std::string Javascript(const std::string& Script);
public:
    virtual void Run();
    virtual void OnWebSocketMessage(const std::string& Message, const std::string& Error);
};

#endif // DEVTOOLSACTIONEXECUTEJAVASCRIPT_H
