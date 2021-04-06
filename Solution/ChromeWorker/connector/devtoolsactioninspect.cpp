#include "devtoolsactioninspect.h"
#include <regex>

void DevToolsActionInspect::Run()
{
    State = Running;

    X = Params["x"].Number;
    Params.erase("x");

    Y = Params["y"].Number;
    Params.erase("y");

    Position = Params["position"].Number;
    Params.erase("position");

    Next();
}

std::string DevToolsActionInspect::PrepareResult()
{
    std::map<std::string, Variant> ResultObject;
    ResultObject["x"] = Variant(x);
    ResultObject["y"] = Variant(y);
    ResultObject["mousex"] = Variant(mousex);
    ResultObject["mousey"] = Variant(mousey);
    ResultObject["width"] = Variant(width);
    ResultObject["height"] = Variant(height);
    ResultObject["label"] = Variant(label);
    ResultObject["css"] = Variant(css);
    ResultObject["css2"] = Variant(css2);
    ResultObject["css3"] = Variant(css3);
    ResultObject["xpath"] = Variant(xpath);
    ResultObject["match"] = Variant(match);
    ResultObject["active"] = Variant(active);
    ResultObject["position"] = Variant(Position);

    return Serializer.SerializeObjectToString(ResultObject);
}

std::string DevToolsActionInspect::Javascript(const std::string& Script)
{
    std::string Res = Script;
    try{
        static std::regex Replacer("_BAS_HIDE\\(([^\\)]+)\\)");
        return std::regex_replace(Res,Replacer,std::string("(atob(\"") + GlobalState->UniqueProcessId + std::string("\", \"STASH\")[\"$1\"])"));
    }catch(...)
    {

    }

    return Res;
}

void DevToolsActionInspect::ParseFrameCandidates(const std::string& FrameMessage, const std::string ParentFrameId)
{
    std::string CurrentParentFrameId = ParentFrameId;
    if(ParentFrameId.empty())
    {
        CurrentParentFrameId = GetStringFromJson(LastMessage, "frameTree.frame.id");
    }else
    {
        CurrentParentFrameId = ParentFrameId;
    }
    FrameCandidates.clear();
    picojson::value MessageValue;
    picojson::parse(MessageValue, FrameMessage);
    picojson::object Obj = MessageValue.get<picojson::object>();
    ParseFrameCandidatesIteration(Obj, CurrentParentFrameId);
}

void DevToolsActionInspect::ParseFrameCandidatesIteration(picojson::object& Obj, const std::string ParentFrameId)
{
    for (picojson::object::iterator it = Obj.begin(); it != Obj.end(); it++)
    {
        if(it->first == "frame" && it->second.is<picojson::object>())
        {
            picojson::object FrameObject = it->second.get<picojson::object>();
            if(FrameObject["parentId"].is<std::string>() && FrameObject["id"].is<std::string>() && ParentFrameId == FrameObject["parentId"].get<std::string>())
            {
                FrameCandidates.push_back(FrameObject["id"].get<std::string>());
            }
        }else if (it->first == "childFrames" && it->second.is<picojson::array>())
        {
            picojson::array FrameList = it->second.get<picojson::array>();
            for(picojson::value& Value: FrameList)
            {
                if (Value.is<picojson::object>())
                {
                    ParseFrameCandidatesIteration(Value.get<picojson::object>(), ParentFrameId);
                }
            }
        }else if (it->second.is<picojson::object>())
        {
            ParseFrameCandidatesIteration(it->second.get<picojson::object>(), ParentFrameId);
        }

    }
}

void DevToolsActionInspect::Next()
{
    if (RequestType == FrameSearchGetFrameList)
    {
        ParseFrameCandidates(LastMessage, CurrentFrame);
        RequestType = FrameSearchGetFrameId;
    }

    if (RequestType == FrameSearchGetFrameIdResult)
    {
        int CandidateNodeId = GetFloatFromJson(LastMessage, "backendNodeId");
        if(CurrentNodeId == CandidateNodeId && GlobalState->FrameIdToContextId.count(CurrentFrameCandidate) > 0)
        {
            CurrentFrame = CurrentFrameCandidate;
            CurrentContextId = GlobalState->FrameIdToContextId[CurrentFrameCandidate];
            RequestType = Initial;
            Next();
            return;
        }
        RequestType = FrameSearchGetFrameId;
    }

    if(RequestType == FrameSearchEvaluate)
    {
        CurrentLoaderId = GetStringFromJson(LastMessage, "result.objectId", "BAS_NOT_FOUND");
        if(CurrentLoaderId == "BAS_NOT_FOUND")
        {
            CurrentLoaderId.clear();
            Result->Fail("Failed to find frame", "NoFrame");
            State = Finished;
            return;
        }else
        {
            std::map<std::string, Variant> CurrentParams;
            CurrentParams["objectId"] = Variant(CurrentLoaderId);
            RequestType = FrameSearchGetNodeId;
            SendWebSocket("DOM.describeNode", CurrentParams);
        }
        return;
    } else if(RequestType == FrameSearchGetNodeId)
    {
        CurrentNodeId = GetFloatFromJson(LastMessage, "node.backendNodeId");
        RequestType = FrameSearchReleaseObject;
        std::map<std::string, Variant> CurrentParams;
        CurrentParams["objectId"] = Variant(CurrentLoaderId);
        SendWebSocket("Runtime.releaseObject", CurrentParams);
        return;
    } else if(RequestType == FrameSearchReleaseObject)
    {
        RequestType = FrameSearchGetFrameList;
        std::map<std::string, Variant> CurrentParams;
        SendWebSocket("Page.getFrameTree", CurrentParams);
        return;
    } else if(RequestType == FrameSearchGetFrameId)
    {
        if(FrameCandidates.empty())
        {
            Result->Fail("Failed to find frame", "NoFrame");
            State = Finished;

            return;
        }
        CurrentFrameCandidate = FrameCandidates.at(0);
        FrameCandidates.erase(FrameCandidates.begin());

        RequestType = FrameSearchGetFrameIdResult;
        std::map<std::string, Variant> CurrentParams;
        CurrentParams["frameId"] = Variant(CurrentFrameCandidate);
        SendWebSocket("DOM.getFrameOwner", CurrentParams);
        return;
    } else if(RequestType == InspectPosition)
    {
        std::string Value = GetStringFromJson(LastMessage, "result.value", "BAS_NOT_FOUND");

        picojson::value v;
        picojson::parse(v, Value);
        if(!v.is<picojson::value::array>())
        {
            Result->Fail("Failed to inspect element");
            State = Finished;
            return;
        }
        picojson::array ValueList = v.get<picojson::value::array>();
        if(ValueList.size() != 18)
        {
            Result->Fail("Failed to inspect element");
            State = Finished;
            return;
        }


        int current_x = ValueList[0].get<double>();
        int current_y = ValueList[1].get<double>();
        int current_width = ValueList[2].get<double>();
        int current_height = ValueList[3].get<double>();
        std::string current_label = ValueList[4].get<std::string>();
        std::string current_css = ValueList[5].get<std::string>();
        std::string current_css2 = ValueList[6].get<std::string>();
        std::string current_css3 = ValueList[7].get<std::string>();
        std::string current_match = ValueList[8].get<std::string>();
        std::string current_xpath = ValueList[9].get<std::string>();
        int current_mousex = ValueList[10].get<double>();
        int current_mousey = ValueList[11].get<double>();
        bool current_active = ValueList[12].get<bool>();
        bool current_is_frame = ValueList[13].get<bool>();
        int current_x_with_padding = ValueList[15].get<double>();
        int current_y_with_padding = ValueList[16].get<double>();


        if(mousex < 0 && mousey < 0)
        {
            mousex = current_mousex;
            mousey = current_mousey;
        }

        active = current_active;

        if(!current_is_frame)
        {
            x = current_x + x_with_padding;
            y = current_y + y_with_padding;
            width = current_width;
            height = current_height;
            label = label + current_label;
            css = css + current_css;
            css2 = css2 + current_css2;
            css3 = css3 + current_css3;
            match = match + current_match;
            xpath = xpath + current_xpath;
            Result->Success(PrepareResult());
            State = Finished;
            return;
        }else
        {


            label = label + current_label + std::string(">FRAME>");
            css = css + current_css + std::string(">FRAME>");
            css2 = css2 + current_css2 + std::string(">FRAME>");
            css3 = css3 + current_css3 + std::string(">FRAME>");
            match = match + current_match + std::string(">FRAME>");
            xpath = xpath + current_xpath + std::string(">FRAME>");

            std::map<std::string, Variant> CurrentParams;
            RequestType = FrameSearchEvaluate;

            if (CurrentContextId >= 0)
                CurrentParams["contextId"] = Variant(CurrentContextId);

            std::string Script;

            Script += Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_InspectElement)(") + std::to_string(X - x_with_padding) + std::string(",") + std::to_string(Y - y_with_padding) + std::string(",") + std::to_string(Position) + std::string(", true)[14]"));

            x_with_padding += current_x_with_padding;
            y_with_padding += current_y_with_padding;

            CurrentParams["expression"] = Variant(Script);
            CurrentParams["replMode"] = Variant(true);

            SendWebSocket("Runtime.evaluate", CurrentParams);
        }

    }else if(RequestType == Initial)
    {
        std::map<std::string, Variant> CurrentParams;
        RequestType = InspectPosition;

        if (CurrentContextId >= 0)
            CurrentParams["contextId"] = Variant(CurrentContextId);

        std::string Script;

        Script += Javascript(std::string("JSON.stringify(_BAS_HIDE(BrowserAutomationStudio_InspectElement)(") + std::to_string(X - x_with_padding) + std::string(",") + std::to_string(Y - y_with_padding) + std::string(",") + std::to_string(Position) + std::string(", false))"));

        CurrentParams["expression"] = Variant(Script);
        CurrentParams["replMode"] = Variant(true);

        SendWebSocket("Runtime.evaluate", CurrentParams);
    }



}

void DevToolsActionInspect::OnWebSocketMessage(const std::string& Message, const std::string& Error)
{
    LastMessage = Message;
    Next();
}

