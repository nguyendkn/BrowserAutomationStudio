#ifndef SCENARIOV8HANDLER_H
#define SCENARIOV8HANDLER_H

#include "include/cef_app.h"
#include <functional>
#include <mutex>

class ScenarioV8Handler : public CefBaseRefCounted
{
public:
    enum RestartType{None, Restart, Stop};
    struct LastResultStruct
    {
        std::string LastResultCodeDiff;
        std::string LastResultVariables;
        std::string LastResultGlobalVariables;
        std::string LastResultFunctions;
        std::string LastResultResources;
        std::string LastResultLabels;
    };
    struct WebInterfaceTaskResultStruct
    {
        std::string LastWebInterfaceResultData;
        int LastWebInterfaceResultId;
    };
    struct PrepareFunctionResultStruct
    {
        std::string FunctionName;
        std::string FunctionData;
    };
private:
    std::vector<LastResultStruct> LastResult;
    WebInterfaceTaskResultStruct WebInterfaceTaskResult;
    PrepareFunctionResultStruct PrepareFunctionResult;

    std::string LastResultExecute;
    std::string LastCurrentFunction;
    std::string OpenActionName;
    bool Changed;
    bool ChangedExecute;
    bool ChangedCurrentFunction;
    RestartType NeedRestart;

    bool ChangedIsInsideElementLoop;
    bool IsInsideElementLoop;

    bool IsEditStart;
    bool IsEditEnd;
    bool IsUpdateEmbeddedData;
    std::string EditStartScript;

    std::string url;
    bool url_changed;

    std::string UpdateEmbeddedData;

    std::string RunFunctionName;
    std::string RunFunctionInSeveralThreadsName;
    std::string RunFunctionAsyncName;

    bool IsThreadNumberEditStart;
    bool IsSuccessNumberEditStart;
    bool IsFailNumberEditStart;
    bool IsRunFunctionStart;
    bool IsIf;
    bool IsSetVariable;
    bool IsSetLabel;
    bool IsMoveLabel;
    bool IsRunFunctionSeveralThreadsStart;
    bool IsRunFunctionAsync;
    bool IsOpenAction;

    std::string DetectorData;
    bool ChangedDetectorData;


    std::mutex mut_threadnumbereditstart;
    std::mutex mut_successnumbereditstart;
    std::mutex mut_failnumbereditstart;

    std::mutex mut_clipboard_get;
    std::mutex mut_clipboard_set;

    bool IsClipboardGetRequest;
    bool IsClipboardSetRequest;

    std::string clipboard_set;

    bool ChangedWebInterfaceResult;
    bool ChangedPrepareFunctionResult;
    bool IsEditSaveStart;

    bool IsInitialized;

public:

    ScenarioV8Handler();
    bool Execute(const CefString& name, CefRefPtr<CefListValue> arguments);
    std::pair<std::vector<ScenarioV8Handler::LastResultStruct>, bool> GetResult();
    std::pair<WebInterfaceTaskResultStruct, bool> GetWebInterfaceTaskResult();
    std::pair<PrepareFunctionResultStruct, bool> GetPrepareFunctionResult();

    std::pair<std::string, bool> GetExecuteCode();
    RestartType GetNeedRestart();
    bool GetIsInitialized();
    bool GetIsEditEnd();
    bool GetIsThreadNumberEditStart();
    bool GetIsSuccessNumberEditStart();
    bool GetIsFailNumberEditStart();
    std::pair<std::string, bool> GetIsRunFunctionStart();
    bool GetIsSetLabel();
    bool GetIsIf();
    bool GetIsSetVariable();
    bool GetIsMoveLabel();
    std::pair<std::string, bool> GetIsRunFunctionSeveralThreadsStart();
    std::pair<std::string, bool> GetIsRunFunctionAsync();
    std::pair<std::string, bool> GetIsOpenAction();
    std::pair<std::string, bool> GetIsEditStart();
    bool GetIsEditSaveStart();
    std::pair<std::string, bool> GetClipboardSetRequest();
    std::pair<std::string, bool> GetUpdateEmbeddedData();
    std::pair<std::string, bool> GetDetectorDataCode();
    std::pair<std::string, bool> GetCurrentFunction();
    std::pair<std::string, bool> GetLoadUrl();
    std::pair<bool, bool> GetIsInsideElementLoop();


    bool GetClipboardGetRequest();


private:
    IMPLEMENT_REFCOUNTING(ScenarioV8Handler);
};

#endif // SCENARIOV8HANDLER_H
