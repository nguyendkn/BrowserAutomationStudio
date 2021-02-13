#include "DevToolsGlobalState.h"

void DevToolsGlobalState::Reset()
{
    TabId.clear();
    SwitchToTabId.clear();
    SwitchToTabFrameId.clear();
    SwitchToTabResetSavedActions = false;
    StartupScriptIds.clear();
    FrameIdToContextId.clear();
    Tabs.clear();
    ScreenCastTabId.clear();
    OpenFileDialogResult.clear();
    OpenFileDialogIsManual = false;
    PromptResult.clear();
}
