#include "devtoolsactionresizebrowser.h"

void DevToolsActionResizeBrowser::Run()
{
    State = Running;
    SendWebSocket("Browser.getWindowForTarget",std::map<std::string,Variant>());
}

void DevToolsActionResizeBrowser::OnWebSocketMessage(const std::string& Message)
{
    if(WindowId < 0)
    {
        WindowId = GetFloatFromJson(Message, "windowId");
        Params["windowId"] = Variant(WindowId);

        SendWebSocket("Browser.setWindowBounds",Params);
        return;
    }

    Result->Success();
    State = Finished;
}
