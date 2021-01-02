#include "devtoolsactionexecutejavascript.h"
#include <regex>

void DevToolsActionExecuteJavascript::Run()
{
    State = Running;

    ElementSelector = Params["path"].String;
    Params.erase("path");

    Expression = Params["expression"].String;
    Params.erase("expression");

    Variables = Params["variables"].String;
    Params.erase("variables");

    UsesPositionData = Expression.find("positionx") != std::string::npos || Expression.find("positiony") != std::string::npos;
    UsesScrollData = Expression.find("scrollx") != std::string::npos || Expression.find("scrolly") != std::string::npos;


    picojson::object VariablesList;

    std::regex pieces_regex("\\[\\[([A-Z0-9_]+)\\]\\]");

    while(true)
    {
        std::smatch pieces_match;

        if(!std::regex_search(Expression.cbegin(), Expression.cend(), pieces_match, pieces_regex))
            break;

        std::ssub_match sub_match = pieces_match[1];
        std::string piece = sub_match.str();

        Expression.replace(pieces_match.position(), pieces_match.length(), std::string("_BAS_VARIABLES[\"") + piece + std::string("\"]"));


        picojson::value VariableValue;
        bool VariableFound;
        Parser.GetValueFromJson(Variables, piece, VariableValue, VariableFound);

        if(VariableFound)
        {
            VariablesList[piece] = VariableValue;
        } else
        {
            VariablesList[piece] = picojson::value();
        }

    }

    InitialVariables = picojson::value(VariablesList).serialize();

    Result->SetResult(InitialVariables);

    LastMessage.clear();
    Next();
}

void DevToolsActionExecuteJavascript::ParseFrameCandidates(const std::string& FrameMessage, const std::string ParentFrameId)
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

void DevToolsActionExecuteJavascript::ParseFrameCandidatesIteration(picojson::object& Obj, const std::string ParentFrameId)
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

void DevToolsActionExecuteJavascript::Next()
{
    if(!LastMessage.empty())
    {
        if (RequestType == FrameSearchGetFrameList)
        {
            ParseFrameCandidates(LastMessage, CurrentFrame);
            RequestType = FrameSearchGetFrameId;
        }
        if (RequestType == FrameSearchGetFrameIdResult)
        {
            int CandidateNodeId = GetFloatFromJson(LastMessage, "backendNodeId");
            if(CurrentNodeId == CandidateNodeId)
            {
                if (GlobalState->FrameIdToContextId.count(CurrentFrameCandidate) == 0)
                {
                    Result->Fail("Failed to find context", "NoContext");
                    State = Finished;
                    return;
                }
                CurrentFrame = CurrentFrameCandidate;
                CurrentContextId = GlobalState->FrameIdToContextId[CurrentFrameCandidate];
                RequestType = NodeSearch;
                Next();
                return;
            }
            RequestType = FrameSearchGetFrameId;
        }

        if(RequestType == JavascriptExecution)
        {
            if(GetStringFromJson(LastMessage, "result.subtype") == "error")
            {
                Result->Fail(GetStringFromJson(LastMessage, "result.description"), "JsError");
                State = Finished;
                return;
            }else if(GetStringFromJson(LastMessage,"result.value","BAS_NOT_FOUND") != "BAS_NOT_FOUND")
            {
                LastMessage = GetStringFromJson(LastMessage, "result.value");
                if(GetStringFromJson(LastMessage, "variables", "BAS_NOT_FOUND") != "BAS_NOT_FOUND")
                {
                    if(GetBooleanFromJson(LastMessage, "is_success"))
                    {
                        Result->Success(GetStringFromJson(LastMessage, "variables"));
                    } else
                    {
                        Result->Fail(GetStringFromJson(LastMessage, "error"), "JsError", GetStringFromJson(LastMessage, "variables"));
                    }
                    State = Finished;
                    return;
                }
            }
            
            Result->Fail("Unknown response", "UnknownResponse");
            State = Finished;
            return;

        }else if(RequestType == FrameSearchEvaluate)
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
            if(UsesPositionData)
            {
                RequestType = FrameSearchGetPosition;
                std::map<std::string, Variant> CurrentParams;
                std::string Script = std::string("{JSON.stringify(BrowserAutomationStudio_GetInternalBoundingRect(BrowserAutomationStudio_FindElement(JSON.stringify(BrowserAutomationStudio_FormatSelector(") + CurrentPrefix + std::string(")))));}");
                CurrentParams["expression"] = Variant(Script);
                if(CurrentContextId >= 0)
                    CurrentParams["contextId"] = Variant(CurrentContextId);

                SendWebSocket("Runtime.evaluate", CurrentParams);
                return;
            } else
            {
                RequestType = FrameSearchGetFrameList;
                std::map<std::string, Variant> CurrentParams;
                SendWebSocket("Page.getFrameTree", CurrentParams);
                return;
            }
        } else if(RequestType == FrameSearchGetPosition)
        {
            std::string ResponseMessage = GetStringFromJson(LastMessage, "result.value", "BAS_NOT_FOUND");
            if(ResponseMessage == "BAS_NOT_FOUND")
            {
                Result->Fail("Failed to find frame position", "NoFramePosition");
                State = Finished;
                return;
            } else
            {
                PositionX += GetFloatFromJson(ResponseMessage, "left");
                PositionY += GetFloatFromJson(ResponseMessage, "top");
                RequestType = FrameSearchGetFrameList;
                std::map<std::string, Variant> CurrentParams;
                SendWebSocket("Page.getFrameTree", CurrentParams);
            }
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
        }
    }
    std::size_t Index = ElementSelector.find(">FRAME>");
    if(Index != std::string::npos)
    {
        CurrentPrefix = ElementSelector.substr(0, Index);
        CurrentPrefix = picojson::value(CurrentPrefix).serialize();
        ElementSelector.erase(0, Index + 7);
        RequestType = FrameSearchEvaluate;
        std::map<std::string, Variant> CurrentParams;
        std::string Script = std::string("{BrowserAutomationStudio_FindElement(JSON.stringify(BrowserAutomationStudio_FormatSelector(") + CurrentPrefix + std::string(")));}");
        CurrentParams["expression"] = Variant(Script);
        if(CurrentContextId >= 0)
            CurrentParams["contextId"] = Variant(CurrentContextId);
        
        SendWebSocket("Runtime.evaluate", CurrentParams);
        return;
    }

    if(IsDoingScrollRequest)
    {
        ScrollDataWasObtained = true;
        ScrollX = GetFloatFromJson(LastMessage, "visualViewport.pageX");
        ScrollY = GetFloatFromJson(LastMessage, "visualViewport.pageY");
        
    }

    if(UsesScrollData && !ScrollDataWasObtained)
    {
        IsDoingScrollRequest = true;
        std::map<std::string, Variant> CurrentParams;
        SendWebSocket("Page.getLayoutMetrics", CurrentParams);
        return;
    }

    std::map<std::string, Variant> CurrentParams;

    if (CurrentContextId >= 0)
        CurrentParams["contextId"] = Variant(CurrentContextId);
    RequestType = JavascriptExecution;
    std::string Script;

    Script += std::string("{\n");
    
    if (!ElementSelector.empty())
    {
        std::string Prefix = ElementSelector;
        Prefix = picojson::value(Prefix).serialize();
        Script += std::string("var self = BrowserAutomationStudio_FindElement(JSON.stringify(BrowserAutomationStudio_FormatSelector(") + Prefix + std::string(")));");
    }else
    {
        Script += std::string("var self = null;");
    }
    
    Script += std::string("var _BAS_VARIABLES = ") + InitialVariables;

    Script += ";\n";

    if(UsesScrollData)
    {
        Script += std::string("var scrollx = ") + std::to_string(ScrollX);
        Script += ";\n";
        Script += std::string("var scrolly = ") + std::to_string(ScrollY);
        Script += ";\n";
    }

    if(UsesPositionData)
    {
        Script += std::string("var positionx = ") + std::to_string(PositionX);
        Script += ";\n";
        Script += std::string("var positiony = ") + std::to_string(PositionY);
        Script += ";\n";
    }

    Script += std::string("var _BAS_RESULT = {is_success: true, error: \"\", variables: _BAS_VARIABLES}");

    Script += ";\n";

    Script += "await (async function(){";

    Script += "\n";

    Script += "try{";
    
    Script += "\n";

    Script += Expression;

    Script += "}catch(e){_BAS_RESULT.error = e.toString();_BAS_RESULT.is_success = false;}";

    Script += "\n";

    Script += "_BAS_RESULT.variables = JSON.stringify(_BAS_RESULT.variables);";

    Script += "\n";

    Script += "return JSON.stringify(_BAS_RESULT)})();";

    Script += "\n";

    Script += std::string("}");

    CurrentParams["expression"] = Variant(Script);
    CurrentParams["replMode"] = Variant(true);
    
    SendWebSocket("Runtime.evaluate", CurrentParams);
}

void DevToolsActionExecuteJavascript::OnWebSocketMessage(const std::string& Message, const std::string& Error)
{
    LastMessage = Message;
    Next();
}

