#include "browserdirectcontrol.h"
#include "handlersmanager.h"
#include "base64.h"
#include <chrono>
#include "converter.h"
#include "startwith.h"
#include "multithreading.h"

using namespace std::chrono;



//
//  Helpers
//

std::string BrowserDirectControl::JsonEscape(const std::string& Text)
{
    return picojson::value(Text).serialize();
}

std::string BrowserDirectControl::JsonEscapeInsideString(const std::string & Text)
{
    std::string res = JsonEscape(Text);
    if(!res.empty())
    {
        res.erase(0,1);
    }
    if(!res.empty())
    {
        res.erase(res.length() - 1,1);
    }
    return res;
}

int64 BrowserDirectControl::Now()
{
    return duration_cast< milliseconds >( system_clock::now().time_since_epoch() ).count();
}

bool BrowserDirectControl::IsKeyDown(WPARAM wparam)
{
    return (GetKeyState(wparam) & 0x8000) != 0;
}


//
//  Mouse clicks
//


BrowserDirectControl::InspectTask BrowserDirectControl::GetInspectTask()
{
    //TID_UI

    InspectTask Res;
    Res.IsNull = true;

    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
    {
        IsInspecting = false;
        MouseClicks.clear();
        return Res;
    }

    if(IsInspecting || MouseClicks.empty())
    {
        return Res;
    }

    Res.IsNull = false;

    Res.X = MouseClicks.at(0).X;
    Res.Y = MouseClicks.at(0).Y;

    //WORKER_LOG("!!!!!! Start inspect mouse" + std::to_string(Res.X) + ", " + std::to_string(Res.Y));

    IsInspecting = true;

    return Res;
}

void BrowserDirectControl::TimeoutLastInspect()
{
    //TID_UI

    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
    {
        IsInspecting = false;
        MouseClicks.clear();
        return;
    }

    if(!IsInspecting)
        return;

    if(MouseClicks.empty())
        return;

    //WORKER_LOG("!!!!!! Timeout inspect mouse");


    MouseClicks.erase(MouseClicks.begin(),MouseClicks.begin() + 1);
}

void BrowserDirectControl::ApplyInspectResult(MouseClickItem Item, InspectResult Inspect)
{
    //TID_UI
    bool IsDownOrUp = Item.IsDownOrUp;
    bool IsDrop = Item.IsDrop;
    bool IsDoubleClick = Item.IsDoubleClick;


    //Add action to scenario
    std::string code;
    std::string json;

    if(Inspect.css.empty())
    {
        if(IsDownOrUp)
            PreviousMouseInspect.css.clear();
        return;
    }

    if(Inspect.css3 == Inspect.css2 || Inspect.css3 == Inspect.css)
    {
        Inspect.css3.clear();
    }

    if(Inspect.css2 == Inspect.css3 || Inspect.css2 == Inspect.css)
    {
        Inspect.css2.clear();
        Inspect.css2 = Inspect.css3;
    }


    //Mouse down, maybe drag and drop
    if(IsDownOrUp)
    {
        //Drag start
        PreviousMouseInspect = Inspect;
        PreviousMouseCode = std::string("_SELECTOR = ") + JsonEscape(Inspect.css) + std::string(";\n") +
                std::string("wait_element_visible(_SELECTOR)!\n") +
                std::string("_call(_random_point, {})!\n") +
                std::string("_if(_result().length > 0, function(){\n") +
                std::string("move( {} )!\n") +
                std::string("get_element_selector(_SELECTOR, false).clarify(X,Y)!\n") +
                std::string("_call(_clarify, {} )!\n") +
                std::string("mouse_down(X,Y)!\n") +
                std::string("})!");

        PreviousMouseMeta = std::string("{\"s\":\"dragelement\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Speed\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"expression\"},{\"id\":\"Gravity\",\"type\":\"constr\",\"data\":\"6\",\"class\":\"expression\"},{\"id\":\"Deviation\",\"type\":\"constr\",\"data\":\"2.5\",\"class\":\"expression\"}],\"p\":{\"is_image\":false,\"css\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"version\":\"1.0\",\"css1\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"css2\":") +
                JsonEscape(Inspect.css2) +
                std::string(",\"css3\":") +
                JsonEscape(Inspect.css3) +
                std::string(",\"current\":\"css\",\"match\":") +
                JsonEscape(Inspect.match) +
                std::string(",\"xpath\":") +
                JsonEscape(Inspect.xpath) +
                std::string(",\"at\":\"") +
                std::to_string(Inspect.x) +
                std::string(", ") +
                std::to_string(Inspect.y) +
                std::string("\",\"we\":true,\"fa\":true}}");

        return;
    }

    if(IsDrop)
    {
        //Drop

        code = std::string("_SELECTOR = ") + JsonEscape(Inspect.css) + std::string(";\n") +
                std::string("wait_element_visible(_SELECTOR)!\n") +
                std::string("_call(_random_point, {})!\n") +
                std::string("_if(_result().length > 0, function(){\n") +
                std::string("move( {} )!\n") +
                std::string("get_element_selector(_SELECTOR, false).clarify(X,Y)!\n") +
                std::string("_call(_clarify, {} )!\n") +
                std::string("mouse_up(X,Y)!\n") +
                std::string("})!");

        json = std::string("{\"s\":\"dropelement\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Speed\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"expression\"},{\"id\":\"Gravity\",\"type\":\"constr\",\"data\":\"6\",\"class\":\"expression\"},{\"id\":\"Deviation\",\"type\":\"constr\",\"data\":\"2.5\",\"class\":\"expression\"}],\"p\":{\"is_image\":false,\"css\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"version\":\"1.0\",\"css1\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"css2\":") +
                JsonEscape(Inspect.css2) +
                std::string(",\"css3\":") +
                JsonEscape(Inspect.css3) +
                std::string(",\"current\":\"css\",\"match\":") +
                JsonEscape(Inspect.match) +
                std::string(",\"xpath\":") +
                JsonEscape(Inspect.xpath) +
                std::string(",\"at\":\"") +
                std::to_string(Inspect.x) +
                std::string(", ") +
                std::to_string(Inspect.y) +
                std::string("\",\"we\":true,\"fa\":true}}");

        AddItem(json, code, std::string(), DragEndType, Inspect);
    }else
    {
        if(!IsDoubleClick)
        {
            //Single click
            code = std::string("_SELECTOR = ") + JsonEscape(Inspect.css) + std::string(";\n") +
                               std::string("wait_element_visible(_SELECTOR)!\n") +
                               std::string("_call(_random_point, {})!\n") +
                               std::string("_if(_result().length > 0, function(){\n") +
                               std::string("move( {} )!\n") +
                               std::string("get_element_selector(_SELECTOR, false).clarify(X,Y)!\n") +
                               std::string("_call(_clarify, {} )!\n") +
                               std::string("mouse(X,Y)!\n") +
                               std::string("})!");
            json =
                std::string("{\"s\":\"moveandclickelement\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Check\",\"type\":\"check\",\"data\":false},{\"id\":\"Select\",\"type\":\"select\",\"data\":\"left\"},{\"id\":\"Speed\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"expression\"},{\"id\":\"Gravity\",\"type\":\"constr\",\"data\":\"6\",\"class\":\"expression\"},{\"id\":\"Deviation\",\"type\":\"constr\",\"data\":\"2.5\",\"class\":\"expression\"}],\"p\":{\"is_image\":false,\"css\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"version\":\"1.0\",\"css1\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"css2\":") +
                JsonEscape(Inspect.css2) +
                std::string(",\"css3\":") +
                JsonEscape(Inspect.css3) +
                std::string(",\"current\":\"css\",\"match\":") +
                JsonEscape(Inspect.match) +
                std::string(",\"xpath\":") +
                JsonEscape(Inspect.xpath) +
                std::string(",\"at\":\"") +
                std::to_string(Inspect.x) +
                std::string(", ") +
                std::to_string(Inspect.y) +
                std::string("\",\"we\":true,\"fa\":true}}");



            AddItem(json, code, std::string(), ClickType, Inspect);
        }else
        {
            //Double click

            code = std::string("_SELECTOR = ") + JsonEscape(Inspect.css) + std::string(";\n") +
                               std::string("wait_element_visible(_SELECTOR)!\n") +
                               std::string("_call(_random_point, {})!\n") +
                               std::string("_if(_result().length > 0, function(){\n") +
                               std::string("move( {} )!\n") +
                               std::string("get_element_selector(_SELECTOR, false).clarify(X,Y)!\n") +
                               std::string("_call(_clarify, {} )!\n") +
                               std::string("_type(\"<MOUSEDOUBLE>\",100)!\n") +
                               std::string("})!");


            json =
                std::string("{\"s\":\"moveandclickelement\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Check\",\"type\":\"check\",\"data\":false},{\"id\":\"Select\",\"type\":\"select\",\"data\":\"double\"},{\"id\":\"Speed\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"expression\"},{\"id\":\"Gravity\",\"type\":\"constr\",\"data\":\"6\",\"class\":\"expression\"},{\"id\":\"Deviation\",\"type\":\"constr\",\"data\":\"2.5\",\"class\":\"expression\"}],\"p\":{\"is_image\":false,\"css\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"version\":\"1.0\",\"css1\":") +
                JsonEscape(Inspect.css) +
                std::string(",\"css2\":") +
                JsonEscape(Inspect.css2) +
                std::string(",\"css3\":") +
                JsonEscape(Inspect.css3) +
                std::string(",\"current\":\"css\",\"match\":") +
                JsonEscape(Inspect.match) +
                std::string(",\"xpath\":") +
                JsonEscape(Inspect.xpath) +
                std::string(",\"at\":\"") +
                std::to_string(Inspect.x) +
                std::string(", ") +
                std::to_string(Inspect.y) +
                std::string("\",\"we\":true,\"fa\":true}}");

            AddItem(json, code, std::string(), DoubleClickType, Inspect);

        }
    }

}

void BrowserDirectControl::SetInspectResult(InspectResult Inspect)
{
    //TID_UI

    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
    {
        IsInspecting = false;
        MouseClicks.clear();
        return;
    }

    if(!IsInspecting)
        return;

    if(MouseClicks.empty())
        return;




    IsInspecting = false;
    MouseClickItem Item = MouseClicks.at(0);

    MouseClicks.erase(MouseClicks.begin(),MouseClicks.begin() + 1);

    //WORKER_LOG("!!!!!! Inspect mouse result " + std::to_string(Item.X) + ", " + std::to_string(Item.Y) + ". " + Inspect.css);

    DoMouseEvent(Item);
    ApplyInspectResult(Item, Inspect);
}


//
//  Working with sequence
//

void BrowserDirectControl::SendCode(const std::string& Meta,const std::string& Code, bool DontSendNextWaitFullPageLoaded, bool IsWaitFullPageLoaded)
{
    if(this->DontSendNextWaitFullPageLoaded && IsWaitFullPageLoaded)
        return;

    this->DontSendNextWaitFullPageLoaded = DontSendNextWaitFullPageLoaded;

    std::string base64_json = base64_encode((unsigned char const *)Meta.data(),Meta.size());

    std::string task = std::string(";var NewId = Math.floor(Math.random() * (1000000000 - 100)) + 100;BrowserAutomationStudio_AddTask(\"\",\"\\/*Dat:") + base64_json + std::string("*\\/\\n\\/*Browser*\\/\\n") + JsonEscapeInsideString(Code) + std::string("\",NewId,true,true);BrowserAutomationStudio_FocusActionFast(NewId);");

    for(auto f:EventExecuteScenarioCode)
        f(task);

}

void BrowserDirectControl::SendDetector(const std::string& Name,const std::string& Description)
{
    if(!_BrowserData->IsRecord)
        return;

    std::string Code = std::string("BrowserAutomationStudio_SendDetectorBrowserData(JSON.stringify({type: \"browser\", id: \"manual\", name: tr(") +
            JsonEscape(Name) +
        std::string("), is_image: false, description: ") +
            JsonEscape(Description) +
        std::string(", comment: \"\", timestamp: ") +
            std::to_string(Now()) +
        std::string("}))");

    for(auto f:EventExecuteScenarioCode)
        f(Code);
}

void BrowserDirectControl::SendSequenceItem(const SequenceItem& Item)
{
    std::string Meta;
    std::string Code;
    bool DontSendNextWaitFullPageLoaded;
    bool IsWaitFullPageLoaded;

    Meta = Item.Meta;
    Code = Item.Code;
    IsWaitFullPageLoaded = Item.Type == WaitFullPageLoadType;
    DontSendNextWaitFullPageLoaded = Item.Type == LoadType || Item.Type == WaitFullPageLoadType || Item.Type == GoBackType;

    SendCode(Meta, Code, DontSendNextWaitFullPageLoaded, IsWaitFullPageLoaded);
}

void BrowserDirectControl::SendSequenceItems(std::vector<SequenceItem>& Items)
{
    SequenceItem Main;
    bool IsMain = false;
    SequenceItem Wait;
    bool IsWait = false;

    //Get main item
    for(SequenceItem& Item: Items)
    {
        if(Item.Type != WaitFullPageLoadType)
        {
            IsMain = true;
            Main = Item;
            break;
        }
    }

    //Get wait item
    for(SequenceItem& Item: Items)
    {
        if(Item.Type == WaitFullPageLoadType)
        {
            IsWait = true;
            Wait = Item;
            break;
        }
    }

    if(IsMain)
    {
        //Get text
        bool IsFirst = true;
        for(SequenceItem& Item: Items)
        {
            if(Item.Type != WaitFullPageLoadType)
            {
                if(!IsFirst)
                    Main.Text += Item.Text;
                IsFirst = false;
            }
        }

        //Update main type
        if(!Main.Text.empty())
        {
            if(Main.Type == ClickType)
            {
                Main.Code = std::string("_SELECTOR = ") + JsonEscape(Main.Inspect.css) + std::string(";\n") +
                                    std::string("wait_element_visible(_SELECTOR)!\n") +
                                    std::string("_call(_random_point, {})!\n") +
                                    std::string("_if(_result().length > 0, function(){\n") +
                                    std::string("move( {} )!\n") +
                                    std::string("get_element_selector(_SELECTOR, false).clarify(X,Y)!\n") +
                                    std::string("_call(_clarify, {} )!\n") +
                                    std::string("mouse(X,Y)!\n") +
                                    std::string("_type(") + JsonEscape(Main.Text) + std::string(",100)!\n") +
                                    std::string("})!");




                Main.Meta =
                        std::string("{\"s\":\"typeelement\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"TypeData\",\"type\":\"constr\",\"data\":") +
                        JsonEscape(Main.Text) +
                        std::string(",\"class\":\"string\"},{\"id\":\"TypeInterval\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"int\"},{\"id\":\"Check\",\"type\":\"check\",\"data\":false},{\"id\":\"Speed\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"expression\"},{\"id\":\"Gravity\",\"type\":\"constr\",\"data\":\"6\",\"class\":\"expression\"},{\"id\":\"Deviation\",\"type\":\"constr\",\"data\":\"2.5\",\"class\":\"expression\"}],\"p\":{\"is_image\":false,\"css\":") +
                        JsonEscape(Main.Inspect.css) +
                        std::string(",\"version\":\"1.0\",\"css1\":") +
                        JsonEscape(Main.Inspect.css) +
                        std::string(",\"css2\":") +
                        JsonEscape(Main.Inspect.css2) +
                        std::string(",\"css3\":") +
                        JsonEscape(Main.Inspect.css3) +
                        std::string(",\"current\":\"css\",\"match\":") +
                        JsonEscape(Main.Inspect.match) +
                        std::string(",\"xpath\":") +
                        JsonEscape(Main.Inspect.xpath) +
                        std::string(",\"at\":\"") +
                        std::to_string(Main.Inspect.x) +
                        std::string(", ") +
                        std::to_string(Main.Inspect.y) +
                        std::string("\",\"we\":true,\"fa\":true}}");

                SendDetector("Type Text",Main.Text + std::string(" -> ") + Main.Inspect.css);


            }else if(Main.Type == KeyType)
            {
                Main.Code = std::string("_type(") + JsonEscape(Main.Text) + std::string(",100)!");
                Main.Meta = std::string("{\"s\":\"type\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"TypeData\",\"type\":\"constr\",\"data\":") +
                        JsonEscape(Main.Text) +
                        std::string(",\"class\":\"string\"},{\"id\":\"TypeInterval\",\"type\":\"constr\",\"data\":\"100\",\"class\":\"int\"}]}");

                SendDetector("Type",Main.Text);
            }
        }
        SendSequenceItem(Main);
    }

    if(IsWait)
    {
        SendSequenceItem(Wait);
    }
}

void BrowserDirectControl::ProcessSequence()
{
    if(Sequence.empty())
        return;
    std::vector<SequenceItem> SubSequence;
    int CurrentIndex = 0;
    int64 CurrentTime = Now();

    while(true)
    {
        //Everything is removed, break
        if(Sequence.empty())
            break;

        //We are in a sequence and reached end of the list
        if(CurrentIndex >= Sequence.size())
        {

            int64 LastItemTime = Sequence.at(Sequence.size() - 1).Time;


            if(CurrentTime - LastItemTime > MaxDelay)
            {
                //Last item is old, can send all
                SendSequenceItems(SubSequence);
                Sequence.clear();
            }else
            {
                //Need to wait if there is more events
            }

            //All data is processed, can exit loop
            break;
        }

        SequenceItem& CurrentItem = Sequence.at(CurrentIndex);

        if(CurrentIndex > 0)
        {

            //We are in a sub sequence
            if((CurrentItem.Type == KeyType || CurrentItem.Type == WaitFullPageLoadType) && CurrentItem.Time - Sequence.at(CurrentIndex - 1).Time <= MaxDelay)
            {
                //Continue sub sequence
                SubSequence.push_back(CurrentItem);
                CurrentIndex++;
            }else
            {

                //Break sub sequence - send all items and remove elements
                if(CurrentItem.Type != DoubleClickType)
                {
                    SendSequenceItems(SubSequence);
                }
                Sequence.erase(Sequence.begin(),Sequence.begin() + CurrentIndex);
                CurrentIndex = 0;
            }
        }else
        {
            //This element is first
            if(CurrentItem.Type == KeyType || CurrentItem.Type == ClickType)
            {
                //Start new sub sequence
                SubSequence.push_back(CurrentItem);
                CurrentIndex++;
            }else
            {
                //Send single item, don't start sub sequence
                SendSequenceItem(CurrentItem);
                Sequence.erase(Sequence.begin(),Sequence.begin() + 1);
                CurrentIndex = 0;
            }
        }

    }
}

void BrowserDirectControl::AddItem(const std::string& Meta,const std::string& Code, const std::string& Text, SequenceItemType Type, InspectResult Inspect)
{
    ProcessSequence();
    SequenceItem NewItem;
    NewItem.Time = Now();
    NewItem.Code = Code;
    NewItem.Meta = Meta;
    NewItem.Type = Type;
    NewItem.Text = Text;
    NewItem.Inspect = Inspect;
    Sequence.push_back(NewItem);
    ProcessSequence();
}

//
//  Main methods
//

BrowserDirectControl::BrowserDirectControl()
{

}

void BrowserDirectControl::Init(std::weak_ptr<HandlersManager> _HandlersManager, BrowserData *_BrowserData)
{
    this->_HandlersManager = _HandlersManager;
    this->_BrowserData = _BrowserData;
    IsDrag = false;
    LastClickTime = -1;
    DontSendNextWaitFullPageLoaded = true;
    IsPageLoaded = false;
    IsInspecting = false;
}

void BrowserDirectControl::Timer()
{
    // TID_UI
    ProcessSequence();

    PageLoadedInternal();

    ProcessSequence();
}

//
//  Browser events
//

void BrowserDirectControl::StartDrag(CefRefPtr<CefBrowser> Browser, CefRefPtr<CefDragData> drag_data,CefBrowserHost::DragOperationsMask allowed_ops, int x, int y)
{
    //TID_UI

    CefMouseEvent e;
    e.modifiers = EVENTFLAG_LEFT_MOUSE_BUTTON;

    e.x = x;
    e.y = y;
    allowedops = allowed_ops;
    Browser->GetHost()->DragTargetDragEnter(drag_data,e,allowed_ops);
    Browser->GetHost()->DragTargetDragOver(e,allowedops);

    IsDrag = true;

    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;

    AddItem(PreviousMouseMeta, PreviousMouseCode, std::string(), DragStartType, PreviousMouseInspect);

    LastAddTab = false;
}


void BrowserDirectControl::Load(const std::string& Url)
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    std::string UrlCopy = Url;

    IsDrag = false;

    //Load url
    if(Pointer->GetBrowser())
    {
        CefRefPtr< CefFrame > Frame = Pointer->GetBrowser()->GetMainFrame();
        if(LastAddTab)
        {
            std::string UrlCopyLower = Url;
            std::transform(UrlCopyLower.begin(), UrlCopyLower.end(), UrlCopyLower.begin(), ::tolower);
            if(!starts_with(UrlCopyLower,"http://") && !starts_with(UrlCopyLower,"https://"))
            {
                UrlCopy = std::string("http://") + UrlCopy;
            }

            _BrowserData->IsCreatingNewPopup = true;
            _BrowserData->IsCreatingNewPopupIsLoaded = false;
            _BrowserData->IsCreatingNewPopupIsContextCreated = false;
            _BrowserData->IsCreatingNewPopupIsSilent = false;
            _BrowserData->IsCreatingNewPopupIsLoadAfterOpen = true;
            _BrowserData->IsCreatingNewPopupIndexBeforeChange = -1;
            _BrowserData->IsCreatingNewPopupUrl = UrlCopy;

            std::string Script = std::string("window.open('tab://new/')");
            Frame->ExecuteJavaScript(Script,"",1);
        }else
            Frame->LoadURL(Url);
    }

    SendDetector("Load",Url);

    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;

    if(LastAddTab)
    {
        //Add action to scenario

        std::string code = std::string("_if_else(\"false\" == \"true\",function(){\n"
           "_popupcreate(true,") + JsonEscape(UrlCopy) + std::string(")!\n"
           "},function(){\n"
           "_popupcreate(false,\"\")!\n"
           "load(") + JsonEscape(UrlCopy) + std::string(")!\n"
           "})!");

        std::string json = std::string("{\"s\":\"addtab\",\"v\":1,\"f\":[],\"uw\":\"1\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Url\",\"type\":\"constr\",\"data\":") + JsonEscape(UrlCopy) + std::string(",\"class\":\"string\"},{\"id\":\"IsSilent\",\"type\":\"constr\",\"data\":\"false\",\"class\":\"string\"}]}");
        AddItem(json, code, std::string(), LoadType);
    }else
    {
        //Add action to scenario
        std::string code = std::string("load(") + JsonEscape(Url) + std::string(")!");
        std::string json = std::string("{\"s\":\"load\",\"v\":1,\"f\":[],\"uw\":\"1\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"LoadUrl\",\"type\":\"constr\",\"data\":") + JsonEscape(Url) + std::string(",\"class\":\"string\"}]}");

        AddItem(json, code, std::string(), LoadType);
    }

    LastAddTab = false;
}

void BrowserDirectControl::StartAddTab()
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    LastAddTab = true;
}

void BrowserDirectControl::StopAddTab()
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    LastAddTab = false;
}

void BrowserDirectControl::SelectTab(int i)
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;


    Pointer->SwitchByIndex(i);

    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;


    //Add action to scenario
    std::string code = std::string("popupselect(") + std::to_string(i) + std::string(")!");
    std::string json = std::string("{\"s\":\"selecttab\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Index\",\"type\":\"constr\",\"data\":\"") + std::to_string(i) + std::string("\",\"class\":\"int\"}]}");

    AddItem(json, code, std::string(), PopupSelect);

    LastAddTab = false;
}

void BrowserDirectControl::CloseTab(int i)
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;


    Pointer->CloseByIndex(i);

    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;


    //Add action to scenario
    std::string code = std::string("popupclose(") + std::to_string(i) + std::string(")!");
    std::string json = std::string("{\"s\":\"closetab\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[{\"id\":\"Index\",\"type\":\"constr\",\"data\":\"") + std::to_string(i) + std::string("\",\"class\":\"int\"}]}");

    AddItem(json, code, std::string(), PopupClose);

    LastAddTab = false;
}

void BrowserDirectControl::PageLoadedInternal()
{
    // TID_UI

    if(!IsPageLoaded)
        return;

    IsPageLoaded = false;

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    IsDrag = false;

    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;


    //Add action to scenario
    std::string code = std::string("wait_async_load()!");
    std::string json = std::string("{\"s\":\"waitfullload\",\"v\":1,\"f\":[],\"uw\":\"0\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[]}");

    AddItem(json, code, std::string(), WaitFullPageLoadType);

}

void BrowserDirectControl::PageLoaded()
{
    // TID_IO

    IsPageLoaded = true;
}

void BrowserDirectControl::GoBack()
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;


    IsDrag = false;

    //Go back
    if(Pointer->GetBrowser())
    {
        Pointer->GetBrowser()->GoBack();
    }


    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;

    //Add action to scenario
    std::string code = std::string("navigate_back()!\nwait_async_load()!");
    std::string json = std::string("{\"s\":\"navigateback\",\"v\":1,\"f\":[],\"uw\":\"1\",\"ut\":\"0\",\"uto\":\"0\",\"um\":\"0\",\"d\":[]}");

    AddItem(json, code, std::string(), GoBackType);

    LastAddTab = false;
}

void BrowserDirectControl::ScrollUp()
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;

    //No mouse wheele in touch mode
    if(_BrowserData->IsTouchScreen)
        return;


    CefMouseEvent e;
    e.x = LastMoveX;
    e.y = LastMoveY;
    int deltay = 100;
    Pointer->GetBrowser()->GetHost()->SendMouseWheelEvent(e,0,deltay);
}

void BrowserDirectControl::ScrollDown()
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;

    //No mouse wheele in touch mode
    if(_BrowserData->IsTouchScreen)
        return;


    CefMouseEvent e;
    e.x = LastMoveX;
    e.y = LastMoveY;
    int deltay = -100;
    Pointer->GetBrowser()->GetHost()->SendMouseWheelEvent(e,0,deltay);
}



void BrowserDirectControl::MouseMove(int X, int Y, bool IsMousePressed, bool IsCtrlPressed, bool IsShiftPressed)
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;



    if(_BrowserData->IsTouchScreen)
    {
        if(_BrowserData->IsTouchPressedDirectControl)
        {
            CefTouchEvent Event;
            Event.id = _BrowserData->TouchEventId;
            Event.x = X;
            Event.y = Y;
            Event.radius_x = 11.5;
            Event.radius_y = 11.5;
            Event.rotation_angle = 0.0;
            Event.pressure = 1.0;
            Event.pointer_type = CEF_POINTER_TYPE_TOUCH;
            Event.modifiers = EVENTFLAG_NONE;
            Event.type = CEF_TET_MOVED;

            Pointer->GetBrowser()->GetHost()->SendTouchEvent(Event);
        }

        return;
    }


    if(Pointer->GetBrowser())
    {
        CefMouseEvent e;

        e.modifiers = EVENTFLAG_NONE;

        if(IsMousePressed)
            e.modifiers |= EVENTFLAG_LEFT_MOUSE_BUTTON;

        if(IsCtrlPressed)
            e.modifiers |= EVENTFLAG_CONTROL_DOWN;

        if(IsShiftPressed)
            e.modifiers |= EVENTFLAG_SHIFT_DOWN;

        e.x = X;
        e.y = Y;

        LastMoveX = X;
        LastMoveY = Y;

        Pointer->GetBrowser()->GetHost()->SendMouseMoveEvent(e,false);
        if(IsDrag)
        {
            Pointer->GetBrowser()->GetHost()->DragTargetDragOver(e,allowedops);
        }
    }

}



void BrowserDirectControl::Key(UINT msg, WPARAM wParam, LPARAM lParam)
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;

    IsDrag = false;

    CefKeyEvent event;
    event.windows_key_code = wParam;
    event.native_key_code = lParam;
    event.is_system_key = msg == WM_SYSCHAR || msg == WM_SYSKEYDOWN || msg == WM_SYSKEYUP;

    if (msg == WM_KEYDOWN || msg == WM_SYSKEYDOWN)
        event.type = KEYEVENT_RAWKEYDOWN;
    else if(msg == WM_KEYUP || msg == WM_SYSKEYUP)
        event.type = KEYEVENT_KEYUP;
    else
        event.type = KEYEVENT_CHAR;


    int modifiers = 0;
    if (IsKeyDown(VK_SHIFT))
      modifiers |= EVENTFLAG_SHIFT_DOWN;
    if (IsKeyDown(VK_CONTROL))
      modifiers |= EVENTFLAG_CONTROL_DOWN;
    if (IsKeyDown(VK_MENU))
      modifiers |= EVENTFLAG_ALT_DOWN;

    // Low bit set from GetKeyState indicates "toggled".
    if (::GetKeyState(VK_NUMLOCK) & 1)
      modifiers |= EVENTFLAG_NUM_LOCK_ON;
    if (::GetKeyState(VK_CAPITAL) & 1)
      modifiers |= EVENTFLAG_CAPS_LOCK_ON;

    switch (wParam) {
      case VK_RETURN:
        if ((lParam >> 16) & KF_EXTENDED)
          modifiers |= EVENTFLAG_IS_KEY_PAD;
        break;
      case VK_INSERT:
      case VK_DELETE:
      case VK_HOME:
      case VK_END:
      case VK_PRIOR:
      case VK_NEXT:
      case VK_UP:
      case VK_DOWN:
      case VK_LEFT:
      case VK_RIGHT:
        if (!((lParam >> 16) & KF_EXTENDED))
          modifiers |= EVENTFLAG_IS_KEY_PAD;
        break;
      case VK_NUMLOCK:
      case VK_NUMPAD0:
      case VK_NUMPAD1:
      case VK_NUMPAD2:
      case VK_NUMPAD3:
      case VK_NUMPAD4:
      case VK_NUMPAD5:
      case VK_NUMPAD6:
      case VK_NUMPAD7:
      case VK_NUMPAD8:
      case VK_NUMPAD9:
      case VK_DIVIDE:
      case VK_MULTIPLY:
      case VK_SUBTRACT:
      case VK_ADD:
      case VK_DECIMAL:
      case VK_CLEAR:
        modifiers |= EVENTFLAG_IS_KEY_PAD;
        break;
      case VK_SHIFT:
        if (IsKeyDown(VK_LSHIFT))
          modifiers |= EVENTFLAG_IS_LEFT;
        else if (IsKeyDown(VK_RSHIFT))
          modifiers |= EVENTFLAG_IS_RIGHT;
        break;
      case VK_CONTROL:
        if (IsKeyDown(VK_LCONTROL))
          modifiers |= EVENTFLAG_IS_LEFT;
        else if (IsKeyDown(VK_RCONTROL))
          modifiers |= EVENTFLAG_IS_RIGHT;
        break;
      case VK_MENU:
        if (IsKeyDown(VK_LMENU))
          modifiers |= EVENTFLAG_IS_LEFT;
        else if (IsKeyDown(VK_RMENU))
          modifiers |= EVENTFLAG_IS_RIGHT;
        break;
      case VK_LWIN:
        modifiers |= EVENTFLAG_IS_LEFT;
        break;
      case VK_RWIN:
        modifiers |= EVENTFLAG_IS_RIGHT;
        break;
    }

    event.modifiers = modifiers;

    Pointer->GetBrowser()->GetHost()->SendKeyEvent(event);


    //Check if recording mode is on
    if(_BrowserData->ManualControl != BrowserData::DirectRecord)
        return;


    if(msg == WM_CHAR)
    {
        std::wstring Str;

        if(wParam == VK_BACK)
        {
            Str = L"<BACK>";
        }else if(wParam == VK_ESCAPE)
        {
            Str = L"<ESCAPE>";
        }else if(wParam == VK_TAB)
        {
            Str = L"<TAB>";
        }else if(IsKeyDown(VK_CONTROL))
        {
            if(wParam == 1)
            {
                Str = L"a";
            }
            if(wParam == 24)
            {
                Str = L"x";
            }
            if(wParam == 3)
            {
                Str = L"c";
            }
            if(wParam == 22)
            {
                Str = L"v";
            }
            if(wParam == 25)
            {
                Str = L"y";
            }
            if(wParam == 26)
            {
                Str = L"z";
            }
        }else
        {
            Str.push_back((wchar_t)wParam);
        }
        std::string Str2 = ws2s(Str);

        if(!Str2.empty())
        {
            if(IsKeyDown(VK_CONTROL))
                Str2 = std::string("<CONTROL>") + Str2;


            AddItem(std::string(), std::string(), Str2, KeyType);
        }
    }
    if(msg == WM_KEYDOWN)
    {
        std::string Text;


        if(wParam == VK_RETURN)
        {
            Text = "<RETURN>";
        }

        if(wParam == VK_PRIOR)
        {
            Text = "<PRIOR>";
        }
        if(wParam == VK_NEXT)
        {
            Text = "<NEXT>";
        }
        if(wParam == VK_END)
        {
            Text = "<END>";
        }
        if(wParam == VK_HOME)
        {
            Text = "<HOME>";
        }
        if(wParam == VK_LEFT)
        {
            Text = "<LEFT>";
        }
        if(wParam == VK_UP)
        {
            Text = "<UP>";
        }
        if(wParam == VK_RIGHT)
        {
            Text = "<RIGHT>";
        }
        if(wParam == VK_DOWN)
        {
            Text = "<DOWN>";
        }
        if(wParam == VK_INSERT)
        {
            Text = "<INSERT>";
        }
        if(wParam == VK_DELETE)
        {
            Text = "<DELETE>";
        }

        if(!Text.empty())
            AddItem(std::string(), std::string(), Text, KeyType);

    }

}

void BrowserDirectControl::DoMouseEvent(MouseClickItem Item)
{

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    if(Pointer->GetBrowser())
    {
        CefMouseEvent e;

        e.modifiers = EVENTFLAG_NONE;

        if(Item.IsLeftMousePressed)
            e.modifiers |= EVENTFLAG_LEFT_MOUSE_BUTTON;

        if(Item.IsRightMousePressed)
            e.modifiers |= EVENTFLAG_RIGHT_MOUSE_BUTTON;

        if(Item.IsCtrlPressed)
            e.modifiers |= EVENTFLAG_CONTROL_DOWN;

        if(Item.IsShiftPressed)
            e.modifiers |= EVENTFLAG_SHIFT_DOWN;

        e.x = Item.X;
        e.y = Item.Y;

        //WORKER_LOG("!!!!!! Do mouse event IsDownOrUp=" + std::to_string(Item.IsDownOrUp) + ", IsDoubleClick=" + std::to_string(Item.IsDoubleClick));
        CefBrowserHost::MouseButtonType ButtonType = Item.IsLeftMouseButton ? MBT_LEFT : MBT_RIGHT;
        Pointer->GetBrowser()->GetHost()->SendMouseClickEvent(e,ButtonType,!Item.IsDownOrUp,Item.IsDoubleClick ? 2 : 1);

        if(Item.IsDrop)
        {
            Pointer->GetBrowser()->GetHost()->DragTargetDragOver(e,allowedops);
            Pointer->GetBrowser()->GetHost()->DragSourceEndedAt(e.x,e.y,allowedops);

            Pointer->GetBrowser()->GetHost()->DragTargetDrop(e);
            Pointer->GetBrowser()->GetHost()->DragSourceSystemDragEnded();
        }

    }


}

void BrowserDirectControl::MouseClick(int X, int Y, bool IsDownOrUp, bool IsLeftMousePressed, bool IsRightMousePressed, bool IsCtrlPressed, bool IsShiftPressed, bool IsLeftMouseButton)
{
    //TID_UI

    //Check if control is indirect
    if(_BrowserData->ManualControl == BrowserData::Indirect)
        return;

    //Lock handler manager to access browser
    std::shared_ptr<HandlersManager> Pointer = _HandlersManager.lock();
    if(!Pointer)
        return;

    //Check if browser created
    if(!Pointer->GetBrowser())
        return;


    if(_BrowserData->IsTouchScreen)
    {

        CefTouchEvent Event;
        Event.id = _BrowserData->TouchEventId;
        Event.x = X;
        Event.y = Y;
        Event.radius_x = 11.5;
        Event.radius_y = 11.5;
        Event.rotation_angle = 0.0;
        Event.pressure = 1.0;
        Event.pointer_type = CEF_POINTER_TYPE_TOUCH;
        Event.modifiers = EVENTFLAG_NONE;

        bool SendEvent = false;
        if(_BrowserData->IsTouchPressedDirectControl && !IsDownOrUp)
        {
            Event.type = CEF_TET_RELEASED;
            SendEvent = true;
            _BrowserData->TouchEventId++;
            _BrowserData->IsTouchPressedDirectControl = false;

            //Check if click was used
            int64 now = Now();

            if(LastClickTime >= 0 &&
                    (
                            abs(LastClickX - X) <= (GetSystemMetrics(SM_CXDOUBLECLK) / 2)
                        &&
                            abs(LastClickY - Y) <= (GetSystemMetrics(SM_CYDOUBLECLK) / 2)
                        &&
                            (now - LastClickTime) < GetDoubleClickTime()
                    )
                )
            {
                //Save click to scenario tab
                MouseClickItem NewItem;
                NewItem.X = X;
                NewItem.Y = Y;
                NewItem.IsDrop = false;
                NewItem.IsDownOrUp = false;
                NewItem.IsDoubleClick = false;
                NewItem.IsDrag = false;

                NewItem.IsLeftMousePressed = false;
                NewItem.IsRightMousePressed = false;
                NewItem.IsCtrlPressed = false;
                NewItem.IsShiftPressed = false;
                NewItem.IsLeftMouseButton = false;

                NewItem.AllowedOptions = allowedops;

                ApplyInspectResult(NewItem, PreviousMouseInspect);
            }

        }else if(!_BrowserData->IsTouchPressedDirectControl && IsDownOrUp)
        {
            Event.type = CEF_TET_PRESSED;
            SendEvent = true;
            _BrowserData->IsTouchPressedDirectControl = true;

            //Save info about position and time in order to check if click was performed later.
            int64 now = Now();
            LastClickTime = now;
            LastClickX = X;
            LastClickY = Y;

            //Send item to inspect
            MouseClickItem NewItem;
            NewItem.X = X;
            NewItem.Y = Y;
            NewItem.IsDrop = false;
            NewItem.IsDownOrUp = true;
            NewItem.IsDoubleClick = false;
            NewItem.IsDrag = false;

            NewItem.IsLeftMousePressed = false;
            NewItem.IsRightMousePressed = false;
            NewItem.IsCtrlPressed = false;
            NewItem.IsShiftPressed = false;
            NewItem.IsLeftMouseButton = false;

            NewItem.AllowedOptions = allowedops;

            MouseClicks.push_back(NewItem);
        }

        if(SendEvent)
            Pointer->GetBrowser()->GetHost()->SendTouchEvent(Event);
        return;
    }



    _BrowserData->LastClickIsFromIndirectControl = false;


    //Detect click number
    int ClickNumber = 1;

    int64 now = Now();

    if(LastClickTime >= 0 &&
            (
                    abs(LastClickX - X) <= (GetSystemMetrics(SM_CXDOUBLECLK) / 2)
                &&
                    abs(LastClickY - Y) <= (GetSystemMetrics(SM_CYDOUBLECLK) / 2)
                &&
                    (now - LastClickTime) < GetDoubleClickTime()
            )
        )
    {
        //Double click
        ClickNumber = 2;

        if(!IsDownOrUp)
            LastClickTime = -1;
    }else if(!IsDownOrUp)
    {
        LastClickTime = now;
        LastClickX = X;
        LastClickY = Y;
    }

    //Create new item
    MouseClickItem NewItem;
    NewItem.X = X;
    NewItem.Y = Y;
    NewItem.IsDrop = !IsDownOrUp && IsDrag;
    NewItem.IsDownOrUp = IsDownOrUp;
    NewItem.IsDoubleClick = ClickNumber != 1;
    NewItem.IsDrag = IsDrag;

    NewItem.IsLeftMousePressed = IsLeftMousePressed;
    NewItem.IsRightMousePressed = IsRightMousePressed;
    NewItem.IsCtrlPressed = IsCtrlPressed;
    NewItem.IsShiftPressed = IsShiftPressed;
    NewItem.IsLeftMouseButton = IsLeftMouseButton;

    NewItem.AllowedOptions = allowedops;

    //Update drag state
    if(NewItem.IsDrop)
    {
        IsDrag = false;
    }

    if(NewItem.IsDrop)
    {

    }else if(!NewItem.IsDownOrUp && !NewItem.IsDoubleClick)
    {
        std::string Selector;
        {
            LOCK_BROWSER_DATA
            Selector = _BrowserData->_Inspect.css;
        }
        SendDetector("Move And Click On Element",Selector);
    }

    if(_BrowserData->ManualControl == BrowserData::DirectNoRecord)
    {
        //No recording mode, send event
        //WORKER_LOG("!!!!!! Send mouse click directly " + std::to_string(X) + ", " + std::to_string(Y));
        DoMouseEvent(NewItem);
    }else
    {
        if(NewItem.IsDownOrUp || NewItem.IsDrop)
        {
            //WORKER_LOG("!!!!!! Send mouse click inspect to queue " + std::to_string(X) + ", " + std::to_string(Y));
            MouseClicks.push_back(NewItem);
        }else
        {
            //WORKER_LOG("!!!!!! Apply last inspect result " + std::to_string(X) + ", " + std::to_string(Y) + ", " + PreviousMouseInspect.css);
            DoMouseEvent(NewItem);
            ApplyInspectResult(NewItem, PreviousMouseInspect);
        }
    }


    LastAddTab = false;

}
