#include "mainapp.h"
#include <string>
#include <thread>
#include "log.h"
#include "picojson.h"
#include "converter.h"
#include "match.h"
#include "base64.h"
#include "javascriptextensions.h"
#include "browsereventsemulator.h"
#include "include/base/cef_bind.h"
#include "include/wrapper/cef_closure_task.h"
#include "include/cef_browser.h"
#include "include/cef_command_line.h"
#include "include/cef_parser.h"
#include "include/wrapper/cef_helpers.h"
#include "xml_encoder.h"
#include "lodepng.h"
#include "multithreading.h"
#include "modulesdata.h"
#include "readallfile.h"
#include "toolboxpreprocessor.h"
#include "clipboard.h"
#include "urlnormalize.h"
#include "chromecommandlineparser.h"
#include "replaceall.h"
#include "split.h"
#include "extract_labels.h"
#include "writefile.h"
#include "preparestartupscript.h"
#include <fstream>
#include "readallfile.h"
#include "writefile.h"
#include "translate.h"
#include "newtabschemehandlerfactory.h"
#include <chrono>

using namespace std::chrono;
using namespace std::placeholders;
MainApp * App;

MainApp::MainApp()
{
    _HandlersManager = std::make_shared<HandlersManager>();
    DoNothing = new DoNothingCallback();
    _EmptyRequestContextHandler = new EmptyRequestContextHandler();

    IsLastCommandNull = true;
    TypeTextTaskIsActive = false;
    DelayClickType = 0;
    TypeTextIsFirstLetter = true;
    IsWaitingForLoad = false;
    ResourcesChanged = true;
    InspectFrameSearching = false;
    InspectPosition = 0;
    TypeTextLastTime = 0;
    LastMouseTrack = 0;
    ScrollStopTracking = 0;
    DoTrackScroll = false;
    ScrollStopTrackingStart = 0;
    ScrollTrackingX = 0;
    ScrollTrackingY = 0;
    LastHighlight = 0;
    ImageWidth = 0;
    ImageHeight = 0;
    ParentWidth = 0;
    ParentHeight = 0;
    IpReuestId = -1;
    IpRequestIsHttps = false;
    App = this;
    IsMouseMoveSimulation = false;
    NeedRenderNextFrame = false;
    SkipBeforeRenderNextFrame = 0;
    RunElementCommandCallbackOnNextTimer = -1;
    TypeTextDelayCurrent = 0;
    ClearElementCommand();
    IsInterfaceInitialSent = false;
    HighlightFrameId = -1;
    HighlightOffsetX = 0;
    HighlightOffsetY = 0;
    _CefReqest2Action = 0;
    IsMainBrowserCreating = true;
    ImageData.resize(16818223);

    ReadDoTour();

}

void MainApp::DirectControlAddAction(const std::string& Script)
{
    if(BrowserScenario)
    {
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Script,BrowserScenario->GetMainFrame()->GetURL(), 0);
    }
}

BrowserDirectControl * MainApp::DirectControl()
{
    return _BrowserDirectControl.get();
}

void MainApp::UpdateManualControl(bool NoFocus)
{
    Layout->HideCentralBrowser();
    if(Layout->IsManualControlAction && Data->ManualControl != BrowserData::DirectNoRecord)
    {
        SendTextResponce("<ManualBrowserControl/>");
        SendTextResponce("<ManualControlIndicatorStop/>");
    }
    Layout->ChangeManualBrowserControlType(Data->ManualControl, NoFocus);
    RECT r = Layout->GetBrowserOuterRectangle(Data->WidthBrowser,Data->HeightBrowser,Data->WidthAll,Data->HeightAll);
    InvalidateRect(Data->_MainWindowHandle,&r,true);
}

std::string MainApp::Javascript(const std::string& Script, const std::string& BrowserType)
{
    if(BrowserType != "main")
        return Script;
    JavaScriptExtensions Extensions;
    return Extensions.ProcessJs(Script,Data->_UniqueProcessId);
}

void MainApp::ReadDoTour()
{
    std::string filename = "../../not_first_run.txt";

    if(ReadAllString(filename) == "true")
    {
        DoTour = false;
    }else
    {
        DoTour = true;
        WriteStringToFile(filename,"true");
    }
}

int MainApp::GetHighlightOffsetX()
{
    return HighlightOffsetX;
}

int MainApp::GetHighlightOffsetY()
{
    return HighlightOffsetY;
}

int MainApp::GetHighlightFrameId()
{
    return HighlightFrameId;
}

void MainApp::SetData(BrowserData *Data)
{
    this->Data = Data;

    _BrowserDirectControl = std::make_shared<BrowserDirectControl>();
    _BrowserDirectControl->Init(_HandlersManager,Data);
    _BrowserDirectControl->EventExecuteScenarioCode.push_back(std::bind(&MainApp::DirectControlAddAction,this,_1));

    _HandlersManager->SetUniqueProcessId(Data->_UniqueProcessId);

}

void MainApp::SetPostManager(PostManager *_PostManager)
{
    this->_PostManager = _PostManager;
}

void MainApp::SetCefReqest2Action(CefReqest2Action *_CefReqest2Action)
{
    this->_CefReqest2Action = _CefReqest2Action;
}

CefReqest2Action * MainApp::GetCefReqest2Action()
{
    return _CefReqest2Action;
}

void MainApp::SetSettings(settings *Settings)
{
    this->Settings = Settings;
}

void MainApp::SetLayout(MainLayout *Layout)
{
    this->Layout = Layout;
}

BrowserData * MainApp::GetData()
{
    return Data;
}

std::vector<std::string> MainApp::GetAllPopupsUrls()
{
    return _HandlersManager->GetAllUrls();
}

int MainApp::GetActivePopupIndex()
{
    return _HandlersManager->GetActiveIndex();
}

std::vector<std::string> GetAllUrls();


CefRefPtr<CefBrowserProcessHandler> MainApp::GetBrowserProcessHandler()
{
    return this;
}


void MainApp::OnContextInitialized()
{
    _HandlersManager->Init1(new MainHandler(),
                            std::bind(&MainApp::SendTextResponce,this,_1),
                            std::bind(&MainApp::UrlLoaded,this,_1,_2,_3),
                            std::bind(&MainApp::LoadSuccessCallback,this),
                            std::bind(&MainApp::CursorChanged,this,_1),
                            std::bind(&MainApp::OldestRequestTimeChanged,this,_1),
                            std::bind(&MainApp::DownloadStart,this),
                            std::bind(&MainApp::UploadStart,this),
                            std::bind(&MainApp::ComboboxOpened,this),
                            std::bind(&MainApp::StartRequest,this,_1),
                            std::bind(&MainApp::ProcessMessage,this,_1,_2,_3,_4),
                            std::bind(&MainApp::LinkCtrlClick,this,_1,_2),
                            std::bind(&MainApp::CurrentTabChanged,this)
                            );

    _HandlersManager->GetHandler()->SetSettings(Settings);
    _HandlersManager->GetHandler()->SetData(Data);
    _HandlersManager->GetHandler()->SetPostManager(_PostManager);
    _HandlersManager->GetHandler()->SetDirectControl(DirectControl());

    dhandler = new DevToolsHandler();
    dhandler->SetData(Data);
    dhandler->SetLayout(Layout);
    dhandler->SetHandlersManager(_HandlersManager.get());
    cookievisitor = new CookieVisitor();



    CefRegisterSchemeHandlerFactory("tab", "new", new NewTabSchemeHandlerFactory());
}

void MainApp::OnRenderProcessThreadCreated(CefRefPtr<CefListValue> extra_info)
{
    //THREAD TID_IO

    extra_info->SetSize(4);
    extra_info->SetBool(0,Data->IsRecord);
    int BrowserToolboxId = -1;
    if(BrowserToolbox)
        BrowserToolboxId = BrowserToolbox->GetIdentifier();
    extra_info->SetInt(1,BrowserToolboxId);

    int BrowserScenarioId = -1;
    if(BrowserScenario)
        BrowserScenarioId = BrowserScenario->GetIdentifier();
    extra_info->SetInt(2,BrowserScenarioId);

    int BrowserCentralId = -1;
    if(BrowserCentral)
        BrowserCentralId = BrowserCentral->GetIdentifier();
    extra_info->SetInt(3,BrowserCentralId);

    extra_info->SetInt(4,Settings->Zoom());
    extra_info->SetString(5,Lang);

    int TabId = -1;
    if(_HandlersManager->GetBrowser())
        TabId = _HandlersManager->FindTabIdByBrowserId(_HandlersManager->GetBrowser()->GetIdentifier());

    std::string Script = PrepareStartupScript(Data,NextLoadPage,TabId);
    extra_info->SetString(6,Script);

    extra_info->SetString(7,Data->_UniqueProcessId);


}


void MainApp::OldestRequestTimeChanged(int64 OldestTime)
{
    Data->OldestRequestTime = OldestTime;
}

void MainApp::DownloadStart()
{
    if(Data->IsRecord && BrowserToolbox)
    {
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_Notify('download')","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }
}

void MainApp::ComboboxOpened()
{
    if(Data->IsRecord && BrowserToolbox)
    {
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_Notify('combobox')","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }
}

void MainApp::UploadStart()
{
    if(Data->IsRecord && BrowserToolbox)
    {
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_Notify('upload')","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }
}

void MainApp::StartRequest(CefRefPtr<CefRequest> Request)
{
    //THREAD TID_IO
    if(Data->IsRecordHttp && _CefReqest2Action)
    {
        std::string Script = _CefReqest2Action->Convert(Request);
        if(BrowserScenario && !Script.empty())
        {
            BrowserScenario->GetMainFrame()->ExecuteJavaScript(Script,BrowserScenario->GetMainFrame()->GetURL(), 0);
        }

    }
}

void MainApp::CursorChanged(int Type)
{
    //THREAD TID_UI
    Layout->SetBrowserCursor(Type);
}

void MainApp::NewMainBrowserContextCreated(int BrowserId, bool IsMain)
{
    WORKER_LOG(std::string("OnProcessMessageReceived<<NewMainBrowserContextCreated<<") + std::to_string(BrowserId) + std::string("<<") + std::to_string(IsMain));
    _HandlersManager->NewContextCreated(BrowserId);
    if(IsMain)
    {
        Data->ScrollX = 0;
        Data->ScrollY = 0;
    }
    if(!v8handler)
        v8handler = new V8Handler();
}


void MainApp::LinkCtrlClick(const std::string& current_url, const std::string& target_url)
{
    if(_HandlersManager->GetBrowser())
    {
        AddHeaderCallbackInternal("Referer",current_url,"");

        Data->IsCreatingNewPopup = true;
        Data->IsCreatingNewPopupIsLoaded = false;
        Data->IsCreatingNewPopupIsContextCreated = false;
        Data->IsCreatingNewPopupIsSilent = false;
        Data->IsCreatingNewPopupIsLoadAfterOpen = true;
        Data->IsCreatingNewPopupIndexBeforeChange = -1;
        Data->IsCreatingNewPopupUrl = target_url;

        std::string Script = std::string("window.open('tab://new/')");
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Script,"", 0);
    }
}

void MainApp::Reload()
{
    if(_HandlersManager->GetBrowser())
    {
        _HandlersManager->GetBrowser()->Reload();
    }
}

void MainApp::ShowDevTools()
{
    if(_HandlersManager->GetBrowser())
    {
        CefWindowInfo window_info;
        window_info.SetAsPopup(0, "Developer tools");
        CefBrowserSettings browser_settings;
        _HandlersManager->GetBrowser()->GetHost()->ShowDevTools(window_info, NULL, browser_settings, CefPoint(0,0));
    }
}



void MainApp::CurrentTabChanged()
{

    if(Data->IsCreatingNewPopup)
    {
        //WORKER_LOG("!!!!!!PopupCreate CurrentTabChanged");
        Data->IsCreatingNewPopupIsContextCreated = true;
        if(Data->IsCreatingNewPopupIsLoaded)
        {
            Data->IsCreatingNewPopup = false;
            //WORKER_LOG("!!!!!!PopupCreate Final");
            //Popup has been created, finalize
            if(Data->IsCreatingNewPopupIsLoadAfterOpen)
            {
                if(_HandlersManager->GetBrowser() && _HandlersManager->GetBrowser()->GetMainFrame())
                    _HandlersManager->GetBrowser()->GetMainFrame()->LoadURL(Data->IsCreatingNewPopupUrl);
            }else
            {
                if(Data->IsCreatingNewPopupIsSilent)
                {
                    //Preserve id of new tab
                    int id = _HandlersManager->GetBrowser()->GetIdentifier();

                    //Switch to old tab
                    _HandlersManager->SwitchByIndex(Data->IsCreatingNewPopupIndexBeforeChange);
                    SetWindowText(GetData()->UrlHandler, s2ws(GetUrl()).c_str());

                    //Set url to open when tab gets active
                    _HandlersManager->SetUrlToOpenOnNextActivation(id,Data->IsCreatingNewPopupUrl);

                }
                SendTextResponce("<PopupCreate></PopupCreate>");
            }
        }
    }

    if(!Data->IsRecord && Data->ManualControl != BrowserData::Indirect)
    {
        _HandlersManager->CloseDevToolsAll();
    }
}

void MainApp::ProcessMessage(CefRefPtr<CefBrowser> browser, CefProcessId source_process, CefRefPtr<CefProcessMessage> message, bool* is_processed)
{
    if(message->GetName().ToString() == std::string("NewMainBrowserContextCreated"))
    {
        int BrowserId = message->GetArgumentList()->GetInt(0);
        bool IsMain = message->GetArgumentList()->GetBool(1);
        NewMainBrowserContextCreated(BrowserId, IsMain);
        *is_processed = true;
    }
    if(message->GetName().ToString() == std::string("NewCentralBrowserContextCreated"))
    {
        WORKER_LOG(std::string("OnProcessMessageReceived<<NewCentralBrowserContextCreated<<"));
        if(!central8handler)
            central8handler = new CentralV8Handler();
        *is_processed = true;
    }
    if(message->GetName().ToString() == std::string("NewDetectorBrowserContextCreated"))
    {
        WORKER_LOG(std::string("OnProcessMessageReceived<<NewDetectorBrowserContextCreated<<"));
        if(!detector8handler)
            detector8handler = new DetectorV8Handler();
        *is_processed = true;
    }
    if(message->GetName().ToString() == std::string("NewScenarioBrowserContextCreated"))
    {
        if(Settings->AutostartDebug() && Data->IsRecord)
        {
            std::wstring Url = std::wstring(L"http://127.0.0.1:") + std::to_wstring(Data->RemoteDebuggingPort);
            ShellExecute(0, 0, Url.c_str(), 0, 0 , SW_SHOW );
        }
        WORKER_LOG(std::string("OnProcessMessageReceived<<NewScenarioBrowserContextCreated<<"));
        if(!scenariov8handler)
            scenariov8handler = new ScenarioV8Handler();
        *is_processed = true;
    }
    if(message->GetName().ToString() == std::string("NewToolboxBrowserContextCreated"))
    {
        WORKER_LOG(std::string("OnProcessMessageReceived<<NewToolboxBrowserContextCreated<<"));
        if(!toolboxv8handler)
            toolboxv8handler = new ToolboxV8Handler();
        *is_processed = true;
    }

    if(message->GetName().ToString() == std::string("V8HandlerMessage"))
    {
        CefRefPtr<CefListValue> List = message->GetArgumentList()->Copy();
        std::string HandleName = List->GetString(0).ToString();
        std::string Name = List->GetString(1).ToString();
        List->Remove(1);
        List->Remove(0);
        //WORKER_LOG(std::string("<- OnProcessMessageReceived<<V8HandlerMessage<<") + HandleName + std::string("<<") + Name);

        if(HandleName == "Central")
        {
            central8handler->Execute(Name,List);
        }
        if(HandleName == "Main")
        {
            v8handler->Execute(Name,List);
        }
        if(HandleName == "Scenario")
        {
            scenariov8handler->Execute(Name,List);
        }
        if(HandleName == "Toolbox")
        {
            toolboxv8handler->Execute(Name,List);
        }
        if(HandleName == "Detector")
        {
            detector8handler->Execute(Name,List);
        }

        *is_processed = true;
    }


}


void MainApp::Paint(int width, int height)
{
    if(!ViewRequestId.empty())
    {
        std::string base64;
        int x = Data->CursorX,y = Data->CursorY;
        std::vector<unsigned char> out;
        std::vector<unsigned char> in;

        for(int j = 0;j<height;j++)
        {
            for(int i = 0;i<width;i++)
            {
                in.push_back((unsigned char)ImageData[i*4+j*width*4 + 2]);
                in.push_back((unsigned char)ImageData[i*4+j*width*4 + 1]);
                in.push_back((unsigned char)ImageData[i*4+j*width*4 + 0]);
                in.push_back((unsigned char)ImageData[i*4+j*width*4 + 3]);
            }
        }

        lodepng::encode(out,(unsigned const char *)(in.data()),width,height);
        base64 = base64_encode(out.data(),out.size());


        std::string xml = std::string("<View id=\"");

        xml += ViewRequestId;
        xml += std::string("\" data=\"");
        xml += base64;
        xml += std::string("\" x=\"");
        xml += std::to_string(x);
        xml += std::string("\" y=\"");
        xml += std::to_string(y);
        xml += std::string("\" width=\"");
        xml += std::to_string(width);
        xml += std::string("\" height=\"");
        xml += std::to_string(height);
        xml += std::string("\" />");

        SendTextResponce(xml);

        ViewRequestId.clear();

    }

    if(NeedRenderNextFrame && SkipBeforeRenderNextFrame <= 1)
    {
        std::string base64;

        if(RenderWidth > 0 && RenderHeight > 0)
        {
            NeedRenderNextFrame = false;
            SkipBeforeRenderNextFrame = 0;
            std::vector<unsigned char> out;
            std::vector<unsigned char> in;
            int w = 0;
            int h = 0;
            for(int j = 0;j<height;j++)
            {
                if(j>RenderY && j<RenderY + RenderHeight)
                {
                    h++;
                }
                for(int i = 0;i<width;i++)
                {

                    if(i>RenderX && i<RenderX + RenderWidth && j>RenderY && j<RenderY + RenderHeight)
                    {
                        if(h==1)
                            w++;
                        in.push_back((unsigned char)ImageData[i*4+j*width*4 + 2]);
                        in.push_back((unsigned char)ImageData[i*4+j*width*4 + 1]);
                        in.push_back((unsigned char)ImageData[i*4+j*width*4 + 0]);
                        in.push_back((unsigned char)ImageData[i*4+j*width*4 + 3]);
                    }
                }

            }


            lodepng::encode(out,(unsigned const char *)(in.data()),w,h);
            base64 = base64_encode(out.data(),out.size());
        }

        if(IsElementRender)
        {
            WORKER_LOG(std::string("Render result element <<") + base64);
            FinishedLastCommand(base64);
        }
        else
        {
            WORKER_LOG(std::string("Render result screen <<") + base64);

            xml_encode(base64);
            SendTextResponce(std::string("<Render>") + base64 + std::string("</Render>"));
        }
    }

    if(/*Layout->GetIsRenderEmpty() && */Data->IsRecord)
    {
        bool is_break = false;
        int len = width * height * 4;
        for(int i = 0;i<len;i++)
        {
            char c = ImageData[i];
            if(c != -1)
            {
                Layout->SetIsRenderEmpty(false);
                is_break = true;
                break;
            }
        }
        if(!is_break)
        {
            Layout->SetIsRenderEmpty(true);
        }
    }
    ImageWidth = width;
    ImageHeight = height;

    if(_HandlersManager->GetIsVisible() || _HandlersManager->GetHandler()->GetIsPopup())
    {
        RECT r = Layout->GetBrowserRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
        InvalidateRect(Data->_MainWindowHandle,&r,false);
        //InvalidateRect(Data->_MainWindowHandle,NULL,false);
    }
}

void MainApp::ClearImageDataCallback()
{
    _ImageFinder.ClearImage();
    SendTextResponce("<ClearImageData></ClearImageData>");
}
void MainApp::SetImageDataCallback(const std::string& base64)
{
    _ImageFinder.SetImage(base64);
    SendTextResponce("<SetImageData></SetImageData>");
}
void MainApp::FindImageCallback()
{
    std::string res = _ImageFinder.FindImage(ImageData.data(),ImageWidth,ImageHeight,Data->ScrollX,Data->ScrollY);
    xml_encode(res);

    SendTextResponce(std::string("<FindImage>") + res + std::string("</FindImage>"));
}

char* MainApp::GetImageData()
{
    return ImageData.data();
}

std::string MainApp::GetSubImageDataBase64(int x1, int y1, int x2, int y2)
{
    int RenderX;
    int RenderY;
    int RenderWidth;
    int RenderHeight;
    int width = ImageWidth;
    int height = ImageHeight;
    char * data = ImageData.data();

    if(x1 < x2)
    {
        RenderX = x1;
        RenderWidth = x2 - x1;
    }else
    {
        RenderX = x2;
        RenderWidth = x1 - x2;
    }

    if(y1 < y2)
    {
        RenderY = y1;
        RenderHeight = y2 - y1;
    }else
    {
        RenderY = y2;
        RenderHeight = y1 - y2;
    }

    std::vector<unsigned char> out;
    std::vector<unsigned char> in;

    int w = 0;
    int h = 0;

    for(int j = 0;j<height;j++)
    {
        if(j>RenderY && j<RenderY + RenderHeight)
        {
            h++;
        }
        for(int i = 0;i<width;i++)
        {

            if(i>RenderX && i<RenderX + RenderWidth && j>RenderY && j<RenderY + RenderHeight)
            {
                if(h==1)
                    w++;
                in.push_back((unsigned char)data[i*4+j*width*4 + 2]);
                in.push_back((unsigned char)data[i*4+j*width*4 + 1]);
                in.push_back((unsigned char)data[i*4+j*width*4 + 0]);
                in.push_back((unsigned char)data[i*4+j*width*4 + 3]);
            }
        }

    }

    lodepng::encode(out,(unsigned const char *)(in.data()),w,h);
    std::string base64 = base64_encode(out.data(),out.size());

    return base64;
}

std::pair<int,int> MainApp::GetImageSize()
{
    std::pair<int,int> res;
    res.first = ImageWidth;
    res.second = ImageHeight;
    return res;
}


void MainApp::UrlLoaded(const std::string& url, int status, int RequestResourceType)
{
    //THREAD TID_IO
    WORKER_LOG(std::string("UrlLoaded<<") + url + std::string("<<") + std::to_string(status));
    if(status == 0)
        return;

    if(RequestResourceType == RT_MAIN_FRAME || RequestResourceType == RT_SUB_FRAME)
    {
        DirectControl()->PageLoaded();
    }

    LOCK_BROWSER_DATA

    auto new_end = std::remove_if(Data->_LoadedUrls.begin(), Data->_LoadedUrls.end(),
                                  [&url](const std::pair<std::string, int>& pair)
                                  { return url == pair.first; });

    Data->_LoadedUrls.erase(new_end, Data->_LoadedUrls.end());
    std::pair<std::string, int> pair;
    pair.first = url;
    pair.second = status;
    Data->_LoadedUrls.push_back(pair);
}

void MainApp::DisableBrowserCallback()
{
    SendTextResponce("<DisableBrowser></DisableBrowser>");
}

void MainApp::SetFocusOnNextLoad()
{
    IsWaitingForLoad = true;
}

bool MainApp::HasBrowser()
{
    return _HandlersManager->GetBrowser();
}

void MainApp::CreateBrowser(const std::string& Url)
{
    NextLoadPage = Url;
    AfterReadyToCreateBrowser(true);
}

void MainApp::LoadCallback(const std::string& page)
{
    Async Result = Data->Connector->Load(page, false);
    Data->Results->ProcessResult(Result);
    Result->Then([this](AsyncResult* Result)
    {
        if(Result->GetIsSuccess())
        {
            this->SendTextResponce("<Load>0</Load>");
        }else
        {
            this->SendTextResponce("<Load>1</Load>");
        }
    });

    SendTextResponce("<LoadedInstant></LoadedInstant>");
}

void MainApp::Load2Callback(const std::string& url,const std::string& referrer, bool instant)
{
    Async Result = Data->Connector->Load(url, instant, referrer);
    Data->Results->ProcessResult(Result);
    Result->Then([this](AsyncResult* Result)
    {
        if(Result->GetIsSuccess())
        {
            this->SendTextResponce("<Load2></Load2>");
        }else
        {
            std::string error = Result->GetErrorMessage();
            xml_encode(error);
            this->SendTextResponce(std::string("<Load2>") + error + std::string("</Load2>"));
        }
    });
}

void MainApp::ViewCallback(const std::string& RequestId)
{
    ViewRequestId = RequestId;
    if(_HandlersManager->GetBrowser())
        _HandlersManager->GetBrowser()->GetHost()->Invalidate(PET_VIEW);
}


void MainApp::GetTabsCallback(const std::string& RequestId)
{
    std::string string_res =_HandlersManager->GetTabsJson();
    xml_encode(string_res);
    SendTextResponce(std::string("<GetTabs id=\"") + RequestId + std::string("\" >") + string_res + std::string("</GetTabs>"));
}

void MainApp::LoadNoDataCallback()
{
    if(BrowserCentral)
    {
        BrowserCentral->GetMainFrame()->ExecuteJavaScript("document.body.style.display='none'","file:///html/central/empty.html",0);
        std::string page = std::string("file:///html/central/no_data_") + Lang + std::string(".html");
        BrowserCentral->GetMainFrame()->LoadURL(page);
        RECT r = Layout->GetBrowserOuterRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
        InvalidateRect(Data->_MainWindowHandle,&r,false);
    }
}

void MainApp::LoadManualSelect()
{
    if(BrowserCentral)
    {
        BrowserCentral->GetMainFrame()->ExecuteJavaScript("document.body.style.display='none'","file:///html/central/empty.html",0);
        std::string page = std::string("file:///html/central/manual_select_") + Lang + std::string(".html?d=") + std::to_string((int)Data->ManualControl);
        BrowserCentral->GetMainFrame()->LoadURL(page);
    }
}

void MainApp::IsChangedCallback()
{
    if(BrowserScenario)
    {
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_IsChanged()","scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
    }
}

void MainApp::ResetNoCookiesCallback()
{
    WORKER_LOG("ResetCallbackNoCookies");
    NeedToClearCookiesOnNextReset = false;
    ResetInternal();
}
void MainApp::ResetCallback()
{
    WORKER_LOG("ResetCallback");
    NeedToClearCookiesOnNextReset = true;
    ResetInternal();
}

void MainApp::NavigateBackCallback()
{
    WORKER_LOG("NavigateBackCallback");
    if(_HandlersManager->GetBrowser())
    {
        _HandlersManager->GetBrowser()->GoBack();
    }
    SendTextResponce("<NavigateBack></NavigateBack>");

}


void MainApp::ResetInternal()
{
    Data->IsReset = true;
    _HandlersManager->Reset();
    CefRequestContext::GetGlobalContext()->CloseAllConnections(DoNothing);


    if(_HandlersManager->GetBrowser())
    {
        Data->IsAboutBlankLoaded = false;
        CefRefPtr< CefFrame > Frame = _HandlersManager->GetBrowser()->GetMainFrame();
        Frame->LoadURL("about:blank");
    }
    else
    {
        Data->IsAboutBlankLoaded = true;
    }
}


void MainApp::PopupCreateCallback(bool is_silent, const std::string& url)
{
    if(!is_silent)
    {
        //Load about:blank and return result, ignore url.
        if(_HandlersManager->GetBrowser())
        {
            //WORKER_LOG("!!!!!!PopupCreate start is_silent = false");
            Data->IsCreatingNewPopup = true;
            Data->IsCreatingNewPopupIsLoaded = false;
            Data->IsCreatingNewPopupIsContextCreated = false;
            Data->IsCreatingNewPopupIsSilent = false;
            Data->IsCreatingNewPopupIsLoadAfterOpen = false;
            Data->IsCreatingNewPopupIndexBeforeChange = -1;
            Data->IsCreatingNewPopupUrl.clear();
            CefRefPtr< CefFrame > Frame = _HandlersManager->GetBrowser()->GetMainFrame();
            Frame->ExecuteJavaScript("window.open('tab://new/')",Frame->GetURL(),0);
        }
        else
        {
            SendTextResponce("<PopupCreate></PopupCreate>");
        }
    }else
    {
        //Load about:blank, add new tab, but not switch to it.
        if(_HandlersManager->GetBrowser())
        {
            //WORKER_LOG("!!!!!!PopupCreate start is_silent = true, url = " + url);
            Data->IsCreatingNewPopup = true;
            Data->IsCreatingNewPopupIsLoaded = false;
            Data->IsCreatingNewPopupIsContextCreated = false;
            Data->IsCreatingNewPopupIsSilent = true;
            Data->IsCreatingNewPopupIsLoadAfterOpen = false;
            Data->IsCreatingNewPopupIndexBeforeChange = _HandlersManager->GetActiveIndex();
            Data->IsCreatingNewPopupUrl = url;
            CefRefPtr< CefFrame > Frame = _HandlersManager->GetBrowser()->GetMainFrame();
            Frame->ExecuteJavaScript("window.open('tab://new/')",Frame->GetURL(),0);
        }
        else
        {
            SendTextResponce("<PopupCreate></PopupCreate>");
        }
    }
}


void MainApp::ResetCallbackFinalize()
{
    //Delete cookies
    if(NeedToClearCookiesOnNextReset)
    {
        CefRefPtr<CefCookieManager> CookieManager = CefCookieManager::GetGlobalManager(NULL);
        CookieManager->DeleteCookies("","",0);
    }

    //Clear fonts
    //FontReplace::GetInstance().SetFonts("");
    //FontReplace::GetInstance().UnHook();

    Settings->Init();

    {
        LOCK_BROWSER_DATA

        //Clear Cache
        Data->_CachedData.clear();
        Data->_RequestMask.clear();
        Data->_LoadedUrls.clear();
        Data->_CacheMask.clear();

        //Open file name
        Data->_OpenFileName.clear();

        //Startup script
        Data->_StartupScript.clear();

        //Headers
        Data->_Headers.Clear();
        Data->_HeadersDefaults.clear();

        //Accept language pattern
        Data->_AcceptLanguagePattern = "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7";

        //Resolution
        Data->WidthBrowser = 1024;
        Data->HeightBrowser = 600;

        Data->AllowPopups = true;
        Data->AllowDownloads = true;
    }

    SendStartupScriptUpdated();

    if(_HandlersManager->GetBrowser())
    {
        _HandlersManager->GetBrowser()->GetHost()->WasResized();
        _HandlersManager->GetBrowser()->GetHost()->Invalidate(PET_VIEW);
    }

    Layout->Update(Data->WidthBrowser,Data->HeightBrowser,Data->WidthAll,Data->HeightAll);
    Data->IsReset = false;

    Layout->SetIsRenderEmpty(true);
    SendTextResponce("<Reset/>");
}

void MainApp::SetOpenFileNameCallback(const std::string& value)
{
    {
        LOCK_BROWSER_DATA
        Data->_OpenFileName = value;
    }
    SendTextResponce("<SetOpenFileName>1</SetOpenFileName>");
}

void MainApp::DragFileCallback(const std::string& value)
{
    Data->IsDrag = true;
    CefRefPtr<CefDragData> drag_data = CefDragData::Create();
    drag_data->AddFile(value,"");
    BrowserEventsEmulator::StartDrag(_HandlersManager->GetBrowser(),drag_data,DRAG_OPERATION_EVERY,Data->CursorX,Data->CursorY,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
    SendTextResponce("<DragFile></DragFile>");
}

void MainApp::SendStartupScriptUpdated()
{
    if(_HandlersManager->GetBrowser())
    {
        int TabId = _HandlersManager->FindTabIdByBrowserId(_HandlersManager->GetBrowser()->GetIdentifier());
        std::string NewScript = PrepareStartupScript(Data, _HandlersManager->GetBrowser()->GetMainFrame()->GetURL(), TabId);
        CefRefPtr<CefProcessMessage> msg = CefProcessMessage::Create("StartupScriptUpdated");
        msg->GetArgumentList()->SetSize(1);
        msg->GetArgumentList()->SetString(0,NewScript);
        _HandlersManager->SendToAll(msg);
    }

}

void MainApp::SetStartupScriptCallback(const std::string& value,const std::string& target,const std::string& script_id)
{
    {
        LOCK_BROWSER_DATA
        auto it = Data->_StartupScript.find(script_id);
        if(it == Data->_StartupScript.end())
        {
            ConfigurableItem<std::string> item;
            item.Set(value, target);
            Data->_StartupScript[script_id] = item;
        }else
        {
            it->second.Set(value, target);
        }

    }
    SendStartupScriptUpdated();
    SendTextResponce("<SetStartupScript></SetStartupScript>");
}

void MainApp::RunTaskCallback(const std::string& function_name,const std::string& params,const std::string& result_id)
{
    std::string script = std::string(";_WebInterfaceTasks.RunTask(") + result_id + std::string(",") + picojson::value(function_name).serialize() + std::string(",") + picojson::value(params).serialize() + std::string(");");
    if(BrowserScenario)
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(script,BrowserScenario->GetMainFrame()->GetURL(), 0);
    else
        BrowserScenarioDelayScript += script;

    /*xml_encode(script);
    SendTextResponce(
                std::string("<RunTaskResult ResultId=\"") +
                result_id +
                std::string("\">") + script + std::string("</RunTaskResult>")
             );*/

}

void MainApp::CheckResultCallback(const std::string& CheckId,bool IsSuccess,const std::string& ErrorString)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(std::string("_EmbeddedModel.CheckResult(") + picojson::value(CheckId).serialize() + std::string(",") + picojson::value(IsSuccess).serialize() + std::string(",") + picojson::value(ErrorString).serialize() + std::string(")"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

}

void MainApp::SetWorkerSettingsCallback(bool EncodeUtf8, bool RefreshConnections, int SkipFrames, const std::string& server, int Port, bool IsHttp, const std::string& username, const std::string& password, const std::string& target, const std::string& browser, const std::string& record_id)
{
    Settings->SetSkipFrames(SkipFrames);
    SetProxyCallback(server,Port,IsHttp,username,password,target);
}

void MainApp::ManualBrowserControlCallback(const std::string& message)
{
    Data->ManualControl = BrowserData::DirectNoRecord;

    std::string FullMessage = message;

    if(!FullMessage.empty())
        FullMessage += std::string(". ");

    FullMessage += ws2s(Translate::Tr(L"Browser is under user contol. <A>Return control to the application.</a>"));
    Layout->StartManualControl(FullMessage);

    UpdateManualControl();

    std::string MessageEncoded = message;
    xml_encode(MessageEncoded);
    SendTextResponce(std::string("<ManualControlIndicatorStart>") + MessageEncoded + std::string("</ManualControlIndicatorStart>"));
}

void MainApp::SetFontListCallback(const std::string& fonts)
{
    //FontReplace::GetInstance().Hook();
    //FontReplace::GetInstance().SetFonts(fonts);

    CefRefPtr<CefProcessMessage> msg = CefProcessMessage::Create("SetFontList");
    msg->GetArgumentList()->SetSize(1);
    msg->GetArgumentList()->SetString(0,fonts);

    _HandlersManager->SendToAll(msg);
    SendTextResponce("<SetFontList></SetFontList>");
}


void MainApp::SetPromptResultCallback(const std::string& value)
{
    Data->_PromptResult = value;
    SendTextResponce("<SetPromptResult>1</SetPromptResult>");
}

void MainApp::SetHttpAuthResultCallback(const std::string& login,const std::string& password)
{
    {
        LOCK_HTTP_AUTH
        Data->_HttpAuthLogin = login;
        Data->_HttpAuthPassword = password;
    }
    SendTextResponce("<SetHttpAuthResult>1</SetHttpAuthResult>");
}

void MainApp::GetCookiesForUrlCallback(const std::string& value)
{
    WORKER_LOG("GetCookiesForUrlCallback");
    std::string cookies;
    //if(_HandlersManager->GetBrowser())
    {
        CefRefPtr<CefCookieManager> CookieManager = CefCookieManager::GetGlobalManager(NULL);
        CefCookie cookie = CookieVisitor::GetEmptyCookie();
        bool CookieSet = CookieManager->SetCookie("http://basnotcorrecturl.com",cookie,0);
        WORKER_LOG(std::string("Empty cookie set<<") + std::to_string(CookieSet));
        cookievisitor->ClearBuffer();
        cookievisitor->SetUrlToVisit(value);
        cookievisitor->EventCookiesLoaded.clear();
        cookievisitor->EventCookiesLoaded.push_back(std::bind(&MainApp::GetCookiesForUrlCompleteCallback,this));
        if(!CookieManager->VisitAllCookies(cookievisitor))
        {
            SendTextResponce(std::string("<GetCookiesForUrl>") + cookies + std::string("</GetCookiesForUrl>"));
            return;
        }
        return;
    }
    SendTextResponce(std::string("<GetCookiesForUrl>") + cookies + std::string("</GetCookiesForUrl>"));
}

void MainApp::GetCookiesForUrlCompleteCallback()
{
    WORKER_LOG("GetCookiesForUrlCompleteCallback");
    std::string cookies = cookievisitor->GetBuffer();
    xml_encode(cookies);
    SendTextResponce(std::string("<GetCookiesForUrl>") + cookies + std::string("</GetCookiesForUrl>"));
}

void MainApp::SaveCookiesCallback()
{
    WORKER_LOG("SaveCookiesCallback");
    std::string cookies;
    if(_HandlersManager->GetBrowser())
    {
        CefRefPtr<CefCookieManager> CookieManager = CefCookieManager::GetGlobalManager(NULL);
        CefCookie cookie = CookieVisitor::GetEmptyCookie();
        bool CookieSet = CookieManager->SetCookie("http://basnotcorrecturl.com",cookie,0);
        WORKER_LOG(std::string("Empty cookie set<<") + std::to_string(CookieSet));
        cookievisitor->ClearBuffer();
        cookievisitor->SetUrlToVisit("");
        cookievisitor->EventCookiesLoaded.clear();
        cookievisitor->EventCookiesLoaded.push_back(std::bind(&MainApp::SaveCookiesCompleteCallback,this));
        if(!CookieManager->VisitAllCookies(cookievisitor))
        {
            SendTextResponce(std::string("<SaveCookies>") + cookies + std::string("</SaveCookies>"));
        }
        return;
    }
    SendTextResponce(std::string("<SaveCookies>") + cookies + std::string("</SaveCookies>"));
}

void MainApp::SaveCookiesCompleteCallback()
{
    WORKER_LOG("SaveCookiesCompleteCallback");
    std::string cookies = cookievisitor->GetBuffer();
    xml_encode(cookies);
    SendTextResponce(std::string("<SaveCookies>") + cookies + std::string("</SaveCookies>"));
}

void MainApp::RestoreLocalStorageCallback(const std::string& value)
{
    SendTextResponce(std::string("<RestoreLocalStorage></RestoreLocalStorage>"));
}

void MainApp::RestoreCookiesCallback(const std::string& value)
{
    CefRefPtr<CefCookieManager> CookieManager = CefCookieManager::GetGlobalManager(NULL);
    CookieManager->DeleteCookies("","",0);
    picojson::value v;
    std::string err = picojson::parse(v, value);
    if(err.empty())
    {
        for(picojson::value c: v.get<picojson::value::array>())
        {
            picojson::value::object o = c.get<picojson::value::object>();
            std::string url = o["domain"].get<std::string>();
            CefCookie cookie;
            CookieVisitor::DeserializeCookie(o, cookie);
            cookie.secure = 0;
            if(starts_with(url,"."))
            {
                url.erase(0,1);
            }
            std::string res = std::to_string(CookieManager->SetCookie(std::string("http://") + url,cookie,NULL));
            WORKER_LOG(res);
        }
    }

    SendTextResponce(std::string("<RestoreCookies></RestoreCookies>"));
}

void MainApp::ResizeCallback(int width, int height)
{
    if(_HandlersManager->GetBrowser())
    {
        _HandlersManager->GetBrowser()->GetHost()->WasResized();
        _HandlersManager->GetBrowser()->GetHost()->Invalidate(PET_VIEW);
    }
    SendStartupScriptUpdated();

    SendTextResponce("<Resize></Resize>");
}

void MainApp::ForceUpdateWindowPositionWithParent()
{
   ParentWidth = 0;
   ParentHeight = 0;
   UpdateWindowPositionWithParent();
}

void MainApp::UpdateWindowPositionWithParent()
{

    if(Data->_ParentWindowHandle && Layout->IsMinimized)
    {
        RECT rc;
        GetClientRect(Data->_ParentWindowHandle, &rc);
        int ParentWidthPrev = ParentWidth;
        int ParentHeightPrev = ParentHeight;
        ParentWidth = rc.right - rc.left;
        ParentHeight = rc.bottom - rc.top;
        if(ParentWidthPrev != ParentWidth || ParentHeightPrev != ParentHeight)
        {
            MoveWindow(Data->_MainWindowHandle,0,0,ParentWidth,ParentHeight,true);
        }
    }
}

void MainApp::HighlightActionCallback(const std::string& ActionId)
{
    WORKER_LOG(std::string("HighlightActionCallback<<") + ActionId);

    if(BrowserScenario)
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(
                    Javascript(std::string("BrowserAutomationStudio_UnfoldParents(") + ActionId + std::string(");") +
                    std::string("BrowserAutomationStudio_FocusAction(") + ActionId + std::string(");"),"scenario")
                    ,BrowserScenario->GetMainFrame()->GetURL(), 0);

}

void MainApp::SetWindowCallback(const std::string& Window)
{
    WORKER_LOG(std::string("SetWindowCallback<<") + Window);
    Data->_ParentWindowHandle = (HWND)std::stoi(Window);
    Layout->MinimizeOrMaximize(Data->_MainWindowHandle,Data->_ParentWindowHandle);
    if(Settings->Maximized())
        Layout->MinimizeOrMaximize(Data->_MainWindowHandle,Data->_ParentWindowHandle);
    ForceUpdateWindowPositionWithParent();

    SendTextResponce("<WindowAttached></WindowAttached>");
}



void MainApp::LoadSuccessCallback()
{
    if(IsWaitingForLoad)
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        IsWaitingForLoad = false;
    }
}

void MainApp::MouseClickCallback(int x, int y)
{
    WORKER_LOG("MouseClickCallback");
    if(_HandlersManager->GetBrowser())
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        LastCommand.CommandName = "_mouseclick";
        LastCommand.CommandParam1 = std::to_string(x);
        LastCommand.CommandParam2 = std::to_string(y);
        IsLastCommandNull = false;
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_ScrollToCoordinates)(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"main"),"", 0);
    }else
    {
        SendTextResponce("<MouseClick></MouseClick>");
    }
}

void MainApp::MouseClickUpCallback(int x, int y)
{
    WORKER_LOG("MouseClickUpCallback");
    if(_HandlersManager->GetBrowser())
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        LastCommand.CommandName = "_mouseclickup";
        if(Data->IsTouchScreen)
        {
            x = Data->ScrollX + Data->CursorX;
            y = Data->ScrollY + Data->CursorY;
            BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),x,y,GetScrollPosition(),1,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
            SendTextResponce("<MouseClickUp></MouseClickUp>");
            return;
        }
        LastCommand.CommandParam1 = std::to_string(x);
        LastCommand.CommandParam2 = std::to_string(y);
        IsLastCommandNull = false;
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_ScrollToCoordinates)(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"main"),"", 0);
    }else
    {
        SendTextResponce("<MouseClickUp></MouseClickUp>");
    }
}


void MainApp::MouseClickDownCallback(int x, int y)
{
    WORKER_LOG("MouseClickDownCallback");
    if(_HandlersManager->GetBrowser())
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        LastCommand.CommandName = "_mouseclickdown";
        if(Data->IsTouchScreen)
        {
            x = Data->ScrollX + Data->CursorX;
            y = Data->ScrollY + Data->CursorY;
            BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),x,y,GetScrollPosition(),2,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
            SendTextResponce("<MouseClickDown></MouseClickDown>");
            return;
        }
        LastCommand.CommandParam1 = std::to_string(x);
        LastCommand.CommandParam2 = std::to_string(y);
        IsLastCommandNull = false;
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_ScrollToCoordinates)(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"main"),"", 0);
    }else
    {
        SendTextResponce("<MouseClickDown></MouseClickDown>");
    }
}


void MainApp::PopupCloseCallback(int index)
{
    if(!_HandlersManager->CloseByIndex(index))
        SendTextResponce("<PopupClose></PopupClose>");
    SetWindowText(GetData()->UrlHandler, s2ws(GetUrl()).c_str());
}

void MainApp::PopupSelectCallback(int index)
{
    _HandlersManager->SwitchByIndex(index);
    SendTextResponce("<PopupSelect></PopupSelect>");
    SetWindowText(GetData()->UrlHandler, s2ws(GetUrl()).c_str());
}

void MainApp::PopupInfoCallback()
{
    std::string string_res =_HandlersManager->GetTabsJson();
    xml_encode(string_res);
    SendTextResponce(std::string("<PopupInfo>") + string_res + std::string("</PopupInfo>"));
}

void MainApp::MouseMoveCallback(int x, int y, double speed, double gravity, double deviation, bool iscoordinates, bool domouseup, double release_radius, bool relative_coordinates, bool track_scroll)
{
    WORKER_LOG(std::string("MouseMoveCallback<<") + std::to_string(x) + std::string("<<") + std::to_string(y) + std::string("<<") + std::to_string(speed) + std::string("<<") + std::to_string(gravity) + std::string("<<") + std::to_string(deviation) + std::string("<<") + std::to_string(iscoordinates));
    if(_HandlersManager->GetBrowser())
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        LastCommand.CommandName = "_mousemove";
        LastCommand.CommandParam1 = std::to_string(x);
        LastCommand.CommandParam2 = std::to_string(y);
        DoMouseUpOnFinishMove = domouseup;
        MouseReleaseRadius = release_radius;
        ScrollTrackingX = 0;
        ScrollTrackingY = 0;
        ScrollStopTrackingStart = 0;
        ScrollStopTracking = 0;
        DoTrackScroll = track_scroll;
        MouseStartX = Data->CursorX;
        MouseStartY = Data->CursorY;
        if(speed>=-0.01)
        {
            MouseSpeed = speed;
        }else
        {
            MouseSpeed = 100.0;
        }
        if(gravity>=-0.01)
        {
            MouseGravity = gravity;
        }else
        {
            MouseGravity = 6.0;
        }
        if(deviation>=-0.01)
        {
            MouseDeviation = deviation;
        }else
        {
            MouseDeviation = 2.5;
        }
        MouseEndX = x;
        MouseEndY = y;
        if(relative_coordinates)
        {
            IsMouseMoveSimulation = true;
            if(Settings->EmulateMouse())
            {
                int t1,t2;
                BrowserEventsEmulator::MouseMove(_HandlersManager->GetBrowser(), IsMouseMoveSimulation, MouseStartX, MouseStartY, MouseEndX, MouseEndY, t1, t2, 0, 0, 0, 0, 0, 0, true, true,Data->IsMousePress,Data->IsDrag, Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
            }
        }else
        {
            IsLastCommandNull = false;
            std::string AllowOutOfBounds = iscoordinates ? "true" : "false";
            _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_ScrollToCoordinates)(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(",") + AllowOutOfBounds + std::string(")"),"main"),"", 0);
        }


    }else
    {
        Data->CursorX = x;
        Data->CursorY = y;
        SendTextResponce("<MouseMove></MouseMove>");
    }
}

void MainApp::ScrollCallback(int x, int y)
{
    WORKER_LOG(std::string("ScrollCallback<<x<<") + std::to_string(x) + std::string("<<y<<") + std::to_string(y));
    if(_HandlersManager->GetBrowser())
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        LastCommand.CommandName = "_scroll";
        LastCommand.CommandParam1 = std::to_string(x);
        LastCommand.CommandParam2 = std::to_string(y);
        IsLastCommandNull = false;
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_ScrollToCoordinates)(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"main"),"", 0);
    }else
    {
        SendTextResponce("<Scroll></Scroll>");
    }
}

void MainApp::DebugVariablesResultCallback(const std::string & data)
{
    if(BrowserScenario)
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_UpdateVariablesResult(") + picojson::value(data).serialize() + std::string(")"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);

    SendTextResponce("<DebugVariablesResult></DebugVariablesResult>");
}

void MainApp::RenderCallback(int x, int y, int width, int height)
{
    WORKER_LOG(std::string("RenderCallback<<x<<") + std::to_string(x) + std::string("<<y<<") + std::to_string(y) + std::string("<<width<<") + std::to_string(width) + std::string("<<height<<") + std::to_string(height));
    if(_HandlersManager->GetBrowser())
    {
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        LastCommand.CommandName = "_render";
        RenderX = x;
        RenderY = y;
        RenderWidth = width;
        RenderHeight = height;

        IsLastCommandNull = false;
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_ScrollToCoordinates)(") + std::to_string(x + width/2) + std::string(",") + std::to_string(y + height/2) + std::string(")"),"main"),"", 0);
    }else
    {
        SendTextResponce("<Render></Render>");
    }
}


void MainApp::CreateTooboxBrowser()
{
    if(BrowserToolbox)
        return;

    if(!Data->IsRecord)
        return;
    thandler = new ToolboxHandler();
    thandler->EventProcessMessage.push_back(std::bind(&MainApp::ProcessMessage,this,_1,_2,_3,_4));

    CefWindowInfo window_info;

    RECT r =  Layout->GetToolboxRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
    window_info.SetAsChild(Data->_MainWindowHandle,r);

    CefBrowserSettings browser_settings;
    CefRequestContextSettings settings;
    CefRefPtr<CefRequestContext> Context = CefRequestContext::CreateContext(settings,_EmptyRequestContextHandler);
    //CefRefPtr<CefRequestContext> Context = CefRequestContext::GetGlobalContext();

    IsMainBrowserCreating = false;
    BrowserToolbox = CefBrowserHost::CreateBrowserSync(window_info, thandler, "file:///html/toolbox/index.html", browser_settings, CefDictionaryValue::Create(), Context);
    IsMainBrowserCreating = true;

    std::string ToolboxScript = ReadAllString("html/toolbox/index.html");
    ToolboxPreprocess(Data->_ModulesData, Data->_UnusedModulesData, ToolboxScript);
    //BrowserToolbox->GetMainFrame()->LoadString(ToolboxScript, "file:///html/toolbox/index.html");
    WriteStringToFile("html/toolbox/index_prepared.html", ToolboxScript);
    BrowserToolbox->GetMainFrame()->LoadURL("file:///html/toolbox/index_prepared.html");

    Layout->ToolBoxHandle = BrowserToolbox->GetHost()->GetWindowHandle();
}

void MainApp::CreateScenarioBrowser()
{
    if(BrowserScenario)
        return;
    if(!Data->IsRecord)
        return;
    shandler = new ScenarioHandler();
    shandler->Zoom = Settings->Zoom();
    shandler->EventProcessMessage.push_back(std::bind(&MainApp::ProcessMessage,this,_1,_2,_3,_4));

    CefWindowInfo window_info;

    RECT r =  Layout->GetDevToolsRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);

    window_info.SetAsChild(Data->_MainWindowHandle,r);

    CefBrowserSettings browser_settings;
    CefRequestContextSettings settings;
    CefRefPtr<CefRequestContext> Context = CefRequestContext::CreateContext(settings,_EmptyRequestContextHandler);
    //CefRefPtr<CefRequestContext> Context = CefRequestContext::GetGlobalContext();

    IsMainBrowserCreating = false;
    BrowserScenario = CefBrowserHost::CreateBrowserSync(window_info, shandler, "file:///html/scenario/index.html", browser_settings, CefDictionaryValue::Create(), Context);
    IsMainBrowserCreating = true;
    std::string ScenarioScript = ReadAllString("html/scenario/index.html");
    ScenarioPreprocess(Data->_ModulesData, ScenarioScript);
    WriteStringToFile("html/scenario/index_prepared.html", ScenarioScript);
    BrowserScenario->GetMainFrame()->LoadURL("file:///html/scenario/index_prepared.html");

    Layout->ScenarioHandle = BrowserScenario->GetHost()->GetWindowHandle();

}

void MainApp::CreateDetectorBrowser()
{
    if(BrowserDetector)
        return;
    if(!Data->IsRecord)
        return;
    detecthandler = new DetectorHandler();
    detecthandler->EventProcessMessage.push_back(std::bind(&MainApp::ProcessMessage,this,_1,_2,_3,_4));


    CefWindowInfo window_info;

    RECT r =  Layout->GetDevToolsRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);

    window_info.SetAsChild(Data->_MainWindowHandle,r);

    CefBrowserSettings browser_settings;
    CefRequestContextSettings settings;
    CefRefPtr<CefRequestContext> Context = CefRequestContext::CreateContext(settings,_EmptyRequestContextHandler);
    //CefRefPtr<CefRequestContext> Context = CefRequestContext::GetGlobalContext();

    IsMainBrowserCreating = false;
    BrowserDetector = CefBrowserHost::CreateBrowserSync(window_info, detecthandler, "file:///html/detector/index.html", browser_settings, CefDictionaryValue::Create(), Context);
    IsMainBrowserCreating = true;
    if(Settings->Detector())
    {
        std::string ScenarioScript = ReadAllString("html/detector/index.html");
        std::string FingerprintKey = ReadAllString("fingerprint-detector.txt");
        ReplaceAllInPlace(ScenarioScript,"_RestoreFingerprintKey",picojson::value(FingerprintKey).serialize());
        ReplaceAllInPlace(ScenarioScript,"_CurrentLocale",picojson::value(Lang).serialize());
        ReplaceAllInPlace(ScenarioScript,"_RemoteDebuggingPort",std::to_string(Data->RemoteDebuggingPort));
        WriteStringToFile("html/detector/index_prepared.html", ScenarioScript);
        BrowserDetector->GetMainFrame()->LoadURL("file:///html/detector/index_prepared.html");
    }else
    {
        BrowserDetector->GetMainFrame()->LoadURL("file:///html/detector/index_disabled.html");
    }
    Layout->DetectorHandle = BrowserDetector->GetHost()->GetWindowHandle();
}

void MainApp::CreateCentralBrowser()
{
    if(BrowserCentral)
        return;
    if(!Data->IsRecord)
        return;
    chandler = new CentralHandler();
    chandler->EventProcessMessage.push_back(std::bind(&MainApp::ProcessMessage,this,_1,_2,_3,_4));


    CefWindowInfo window_info;

    RECT r =  Layout->GetCentralRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll,true);

    window_info.SetAsChild(Data->_MainWindowHandle,r);

    CefBrowserSettings browser_settings;
    CefRequestContextSettings settings;
    CefRefPtr<CefRequestContext> Context = CefRequestContext::CreateContext(settings,_EmptyRequestContextHandler);
    //CefRefPtr<CefRequestContext> Context = CefRequestContext::GetGlobalContext();

    std::string page = std::string("file:///html/central/index_") + Lang + std::string(".html");

    IsMainBrowserCreating = false;
    BrowserCentral = CefBrowserHost::CreateBrowserSync(window_info, chandler, page, browser_settings, CefDictionaryValue::Create(), Context);
    IsMainBrowserCreating = true;

    Layout->CentralHandle = BrowserCentral->GetHost()->GetWindowHandle();
    Layout->ShowCentralBrowser(false, true);

}

/*void PrintDictionary(CefRefPtr<CefDictionaryValue> Dictionary, int tab)
{
    CefDictionaryValue::KeyList Keys;
    Dictionary->GetKeys(Keys);
    std::string tab_string;
    for(int i = 0;i<tab;i++)
        tab_string += " ";
    for(auto s:Keys)
    {
        WORKER_LOG(tab_string + s.ToString()+ std::string("<<") + std::to_string(Dictionary->GetValue(s)->GetType()));
        switch(Dictionary->GetValue(s)->GetType())
        {
            case VTYPE_BOOL:
                WORKER_LOG(tab_string + std::string("   ") + std::to_string(Dictionary->GetValue(s)->GetBool()));break;
            case VTYPE_INT:
                WORKER_LOG(tab_string + std::string("   ") + std::to_string(Dictionary->GetValue(s)->GetInt()));break;
            case VTYPE_DOUBLE:
                WORKER_LOG(tab_string + std::string("   ") + std::to_string(Dictionary->GetValue(s)->GetDouble()));break;
            case VTYPE_DICTIONARY:
                PrintDictionary(Dictionary->GetValue(s)->GetDictionary(),tab + 3);break;
            case VTYPE_STRING:
                WORKER_LOG(tab_string + std::string("   ") + Dictionary->GetValue(s)->GetString().ToString());break;
        }
    }
}*/


void MainApp::AfterReadyToCreateBrowser(bool Reload)
{
    WORKER_LOG(std::string("LoadCallback create new ") + NextLoadPage);

    CefWindowInfo window_info;

    window_info.SetAsWindowless(0);

    CefBrowserSettings browser_settings;
    browser_settings.windowless_frame_rate = 30;
    browser_settings.background_color = CefColorSetARGB(255, 255, 255, 255);

    /*if(Settings->Webgl() == "disable")
        browser_settings.webgl = STATE_DISABLED;
    else*/
    browser_settings.webgl = STATE_ENABLED;

    browser_settings.plugins = STATE_ENABLED;

    std::wstring wencoding = L"UTF-8";
    cef_string_utf16_set(wencoding.data(),wencoding.size(),&browser_settings.default_encoding,true);

    CefRefPtr<CefRequestContext> Context = CefRequestContext::CreateContext(CefRequestContext::GetGlobalContext(),this);

    {
        CefRefPtr<CefValue> Value = CefValue::Create();
        Value->SetInt(1);
        CefString Error;
        Context->SetPreference("profile.default_content_setting_values.plugins",Value,Error);
        WORKER_LOG(std::string("Error enable flash<<") + Error.ToString());
    }

    {
        CefRefPtr<CefValue> Value = CefValue::Create();
        CefRefPtr<CefDictionaryValue> Dictionary = CefDictionaryValue::Create();

        WORKER_LOG("System Proxy");
        Dictionary->SetString("mode","direct");

        CefString Error;
        Value->SetDictionary(Dictionary);
        Context->SetPreference("proxy",Value,Error);
        WORKER_LOG(std::string("Error setting proxy<<") + Error.ToString());

    }

    //PrintDictionary(Context->GetAllPreferences(true),3);

    if(Reload || !_HandlersManager->GetBrowser())
    {
        WORKER_LOG("!!!CREATENEWBROWSER!!!");

        _HandlersManager->Init2(CefBrowserHost::CreateBrowserSync(window_info, _HandlersManager->GetHandler(), "about:blank", browser_settings, CefDictionaryValue::Create(), Context));
        Layout->BrowserHandle = _HandlersManager->GetBrowser()->GetHost()->GetWindowHandle();
        _HandlersManager->GetBrowser()->GetMainFrame()->LoadURL(NextLoadPage);

        CreateTooboxBrowser();
        CreateScenarioBrowser();
        CreateCentralBrowser();
        if(Settings->DebugScenario() || Settings->DebugToolbox())
        {
            ToggleDevTools();
        }
    }else
    {
        WORKER_LOG("!!!OPTIMIZEDRELOAD!!!");
        _HandlersManager->GetBrowser()->GetMainFrame()->LoadURL(NextLoadPage);
    }
}

void MainApp::TimezoneCallback(int offset)
{
    //For backward compability only
    SendTextResponce("<Timezone></Timezone>");
}

void MainApp::BrowserIpCallback()
{
    if(IpClient)
        IpClient->Stop();
    IpClient = new BrowserIp();
    IpReuestId = rand()%100000;
    IpClient->Done.push_back(std::bind(&MainApp::SendBrowserIp,this,_1,_2));
    IpRequestIsHttps = false;
    IpClient->Start(IpReuestId, IpRequestIsHttps);
}

void MainApp::BrowserIpHttpsCallback()
{
    if(IpClient)
        IpClient->Stop();
    IpClient = new BrowserIp();
    IpReuestId = rand()%100000;
    IpClient->Done.push_back(std::bind(&MainApp::SendBrowserIp,this,_1,_2));
    IpRequestIsHttps = true;
    IpClient->Start(IpReuestId, IpRequestIsHttps);
}

void MainApp::SendBrowserIp(const std::string& Ip, int IpReuestId)
{
    if(this->IpReuestId == IpReuestId)
    {
        if(IpRequestIsHttps)
        {
            SendTextResponce(std::string("<BrowserIpHttps>") + Ip + std::string("</BrowserIpHttps>"));
        }else
        {
            SendTextResponce(std::string("<BrowserIp>") + Ip + std::string("</BrowserIp>"));
        }
    }
}

void MainApp::VisibleCallback(bool visible)
{
    WORKER_LOG(std::string("VisibleCallback ") + std::to_string(visible));
    if(visible)
    {
        _HandlersManager->GetHandler()->Show();
        _HandlersManager->Show();
        Layout->Focus();
    }
    else
    {
        _HandlersManager->GetHandler()->Hide();
        _HandlersManager->Hide();
    }
}

void MainApp::FlushCallback()
{
    WORKER_LOG(std::string("FlushCallback "));
    CefCookieManager::GetGlobalManager(NULL)->FlushStore(NULL);
}

void MainApp::Hide()
{
    _HandlersManager->GetHandler()->Hide();
    _HandlersManager->Hide();
}

void MainApp::ToggleDevTools()
{
    if(!Data->IsRecord)
        return;

    if(Settings->DebugScenario())
    {
        WORKER_LOG("ToggleDevTools Scenario");
        if(!BrowserScenario.get())
            return;

        CefWindowInfo window_info;
        window_info.SetAsPopup(0, "");
        CefBrowserSettings browser_settings;
        BrowserScenario->GetHost()->ShowDevTools(window_info, dhandler, browser_settings, CefPoint(0,0));

    }else if(Settings->DebugToolbox())
    {
        WORKER_LOG("ToggleDevTools Toolbox");

        if(!BrowserToolbox.get())
            return;

        CefWindowInfo window_info;
        window_info.SetAsPopup(0, "");
        CefBrowserSettings browser_settings;
        BrowserToolbox->GetHost()->ShowDevTools(window_info, dhandler, browser_settings, CefPoint(0,0));
    }else
    {
        WORKER_LOG("ToggleDevTools");
        if(!_HandlersManager->GetBrowser())
            return;

        dhandler->OpenDevTools();
    }
}

void MainApp::InspectAt(int x, int y)
{
    WORKER_LOG(std::string("Inspect At<<") + std::to_string(x) + std::string("<<") + std::to_string(y));
    if(!_HandlersManager->GetBrowser())
        return;

    dhandler->OpenDevTools(CefPoint(x,y));
}

void MainApp::RepeatInspectMouseAt()
{
    MouseMoveAt(InspectX,InspectY);
}

void MainApp::IncreaseInspectPosition()
{
    InspectPosition++;
    RepeatInspectMouseAt();
}


void MainApp::DecreaseInspectPosition()
{
    InspectPosition--;
    if(InspectPosition < 0)
        InspectPosition = 0;
    RepeatInspectMouseAt();
}


void MainApp::MouseMoveAt(int x, int y)
{
    clock_t CurrentTime = clock();
    float time_spent = float( CurrentTime - LastMouseTrack ) /  CLOCKS_PER_SEC;

    if(InspectFrameSearching && time_spent < 3)
        return;

    if(time_spent < 0.1)
        return;

    BrowserDirectControl::InspectTask Task = DirectControl()->GetInspectTask();

    if(Task.IsNull)
        InspectMouseAt(x, y, CurrentTime);
    else
        InspectMouseAt(Task.X, Task.Y, CurrentTime);
}

void MainApp::InspectMouseAt(int x, int y, clock_t CurrentTime)
{
    InspectFrameSearching = true;
    InspectFrameChain.clear();
    if(InspectX != x || InspectY != y)
    {
        InspectPosition = 0;
    }
    InspectX = x;
    InspectY = y;
    LastMouseTrack = CurrentTime;


    if(_HandlersManager->GetBrowser())
    {
        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_InspectElement)(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(",") + std::to_string(InspectPosition) + std::string(")"),"main"),"", 0);
    }
}

void MainApp::MouseLeave()
{
    {
        LOCK_BROWSER_DATA
        Data->_Inspect.active = false;
    }
    RECT r = Layout->GetBrowserRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
    InvalidateRect(Data->_MainWindowHandle,&r,false);
}

void MainApp::SetProxyCallback(const std::string& server, int Port, bool IsHttp, const std::string& username, const std::string& password, const std::string& target)
{
    WORKER_LOG(std::string("SetProxyCallback ") + server + std::string(" ") + std::to_string(Port) + std::string(" ") + target);
    Async Result = Data->Connector->SetProxy(server, Port, IsHttp, username, password);
    Data->Results->ProcessResult(Result);
    Result->Then([this](AsyncResult* Result)
    {
        this->SendTextResponce("<SendWorkerSettings></SendWorkerSettings>");
    });
}

void MainApp::OnComplete()
{
    WORKER_LOG("MainApp::OnComplete");
    if(!ProxyLibraryLoaded)
    {
        IPCSimple::Write(std::string("out") + Data->_UniqueProcessId,"attach-proxy");
    }else
    {
        SendTextResponce("<SendWorkerSettings></SendWorkerSettings>");
    }
}

CefRefPtr<CefResourceRequestHandler> MainApp::GetResourceRequestHandler(CefRefPtr<CefBrowser> browser, CefRefPtr<CefFrame> frame, CefRefPtr<CefRequest> request, bool is_navigation, bool is_download, const CefString& request_initiator, bool& disable_default_handling)
{
    //Never use default request handler for dev tools
    if(starts_with(request->GetURL().ToString(),"devtools:") || (browser && browser->GetMainFrame() && starts_with(browser->GetMainFrame()->GetURL().ToString(),"devtools:")))
        return NULL;

    int BrowserId = -1;
    if(!browser && _HandlersManager->GetBrowser())
    {
        BrowserId = _HandlersManager->GetBrowser()->GetIdentifier();
    }

    if(BrowserId != -1)
    {
        CefResourceRequestHandler * Res = _HandlersManager->GetHandlerForBrowserId(BrowserId);
        return Res;
    }
}


void MainApp::AddHeaderCallback(const std::string& key,const std::string& value, const std::string& target)
{
    AddHeaderCallbackInternal(key, value, target);
    SendTextResponce("<AddHeader></AddHeader>");
}

void MainApp::AddHeaderCallbackInternal(const std::string& key,const std::string& value, const std::string& target)
{
    {
        LOCK_BROWSER_DATA
        std::shared_ptr<std::map<std::string,std::string> > Headers = Data->_Headers.Get(target);
        if(!Headers.get())
        {
            Headers = std::make_shared<std::map<std::string,std::string> >();
        }
        if(value.empty())
        {
            if((key == "Referer" || key == "referer"))
            {
                if(Headers->count(key) == 0 || Headers->at(key) == "")
                {
                    Headers->erase(key);
                    Headers->insert(std::pair<std::string,std::string>(key, "_BAS_NO_REFERRER"));
                    Data->_NextReferrer = "_BAS_NO_REFERRER";
                }else
                {
                    Headers->erase(key);
                    Data->_NextReferrer.clear();
                }


            }else
            {
                Headers->erase(key);
                Headers->insert(std::pair<std::string,std::string>(key, ""));
            }
        }
        else
        {
            Headers->erase(key);
            Headers->insert(std::pair<std::string,std::string>(key, value));
            if((key == "Referer" || key == "referer"))
            {
                Data->_NextReferrer = value;
            }
        }
        Data->_Headers.Set(Headers,target);
    }
    SendStartupScriptUpdated();
}

void MainApp::SetHeaderListCallback(const std::string& json)
{
    bool success = true;
    std::vector<std::string> HeadersDefaults;
    try
    {
        picojson::value v;
        picojson::parse(v, json);
        picojson::value::array a = v.get<picojson::value::array>();

        for(picojson::value p: a)
        {
            std::string ps = p.get<std::string>();
            if(ps != "Host")
            {
                HeadersDefaults.push_back(ps);
            }
        }

    }catch(...)
    {
        success = false;
    }

    if(success)
    {
        LOCK_BROWSER_DATA
        Data->_HeadersDefaults = HeadersDefaults;
    }
    SendTextResponce("<SetHeaderList></SetHeaderList>");
}

void MainApp::SetAcceptLanguagePatternCallback(const std::string& pattern)
{
    {
        LOCK_BROWSER_DATA
        Data->_AcceptLanguagePattern = pattern;
    }
    SendStartupScriptUpdated();
    SendTextResponce("<SetAcceptLanguagePattern></SetAcceptLanguagePattern>");
}

void MainApp::SetUserAgentCallback(const std::string& value)
{
    /*{
        LOCK_BROWSER_DATA
        if(value.empty())
            Data->_Headers.erase("User-Agent");
        else
            Data->_Headers["User-Agent"] = value;
    }*/
    //SendTextResponce("<SetUserAgent>1</SetUserAgent>");
}

void MainApp::PrepareFunctionCallback(const std::string& value)
{
    if(BrowserScenario)
    {
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_PrepareFunction(") + picojson::value(value).serialize() + std::string(")"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
    }

}

void MainApp::RecaptchaV3ListCallback(const std::string& value)
{
    {
        LOCK_BROWSER_DATA
        Data->_RecaptchaV3List = value;
    }
    if(_HandlersManager->GetBrowser())
    {
        std::vector<int64> FrameIds;
        _HandlersManager->GetBrowser()->GetFrameIdentifiers(FrameIds);
        std::string Js = Javascript(std::string(";_BAS_HIDE(BrowserAutomationStudio_RecaptchaV3ActionList) = ") + picojson::value(Data->_RecaptchaV3List).serialize() + std::string(";"),"main");
        for(int64 Id: FrameIds)
        {
            CefRefPtr<CefFrame> Frame = _HandlersManager->GetBrowser()->GetFrame(Id);
            Frame->ExecuteJavaScript(Js,Frame->GetURL(), 0);
        }

    }
    SendStartupScriptUpdated();
    SendTextResponce("<RecaptchaV3List></RecaptchaV3List>");
}

void MainApp::RecaptchaV3ResultCallback(const std::string& id, const std::string& result)
{
    if(_HandlersManager->GetBrowser())
    {
        std::vector<int64> FrameIds;
        _HandlersManager->GetBrowser()->GetFrameIdentifiers(FrameIds);
        std::string Js = Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_RecaptchaV3Solved)(") + picojson::value(id).serialize() + std::string(", ") + picojson::value(result).serialize() + std::string(");"),"main");
        for(int64 Id: FrameIds)
        {
            CefRefPtr<CefFrame> Frame = _HandlersManager->GetBrowser()->GetFrame(Id);
            Frame->ExecuteJavaScript(Js,Frame->GetURL(), 0);
        }

    }
}

void MainApp::CleanHeaderCallback()
{
    {
        LOCK_BROWSER_DATA
        Data->_Headers.Clear();
        Data->_HeadersDefaults.clear();
    }
    SendStartupScriptUpdated();
    SendTextResponce("<CleanHeader></CleanHeader>");
}

void MainApp::GetUrlCallback()
{
    std::string url;

    if(_HandlersManager->GetBrowser())
    {
        url = _HandlersManager->GetBrowser()->GetMainFrame()->GetURL();
    }
    xml_encode(url);
    SendTextResponce(std::string("<GetUrl>") + url + std::string("</GetUrl>"));
}

void MainApp::GetBrowserScreenSettingsCallback()
{
    picojson::object result;
    result["CursorX"] = picojson::value((double)Data->CursorX);
    result["CursorY"] = picojson::value((double)Data->CursorY);
    result["ScrollX"] = picojson::value((double)Data->ScrollX);
    result["ScrollY"] = picojson::value((double)Data->ScrollY);
    result["Width"] = picojson::value((double)Data->WidthBrowser);
    result["Height"] = picojson::value((double)Data->HeightBrowser);

    std::string result_string = picojson::value(result).serialize();
    xml_encode(result_string);
    SendTextResponce(std::string("<GetBrowserScreenSettings>") + result_string + std::string("</GetBrowserScreenSettings>"));
}

std::string MainApp::GetUrl()
{
    std::string url;

    if(_HandlersManager->GetBrowser())
    {
        url = _HandlersManager->GetBrowser()->GetMainFrame()->GetURL();
    }

    return url;
}

void MainApp::ProcessContextMenu(int MenuId)
{
    if(_HandlersManager->GetBrowser())
    {
        Data->_BrowserContextMenu.Process(Data->_MainWindowHandle, MenuId, _HandlersManager->GetBrowser());
    }
}

void MainApp::ProcessFind(LPFINDREPLACE lpfr)
{
    if(_HandlersManager->GetBrowser())
    {
        Data->_BrowserContextMenu.OnFind(_HandlersManager->GetBrowser(), lpfr);
    }

}


void MainApp::OnBeforeCommandLineProcessing(const CefString& process_type,CefRefPtr<CefCommandLine> command_line)
{
    //command_line->AppendSwitch("--single-process");
    command_line->AppendSwitch("--high-dpi-support");
    command_line->AppendSwitch("--disable-site-isolation-trials");

    //command_line->AppendSwitch("--disable-gpu");
    //command_line->AppendSwitch("--disable-gpu-compositing");
    //command_line->AppendSwitch("--disable-gpu-vsync");

    for(auto p:ParseChromeCommandLine())
    {

        if(p.second.length()>0)
        {

            WORKER_LOG("ChromeCommandLine<<" + p.first + "=" + p.second);
            command_line->AppendSwitchWithValue(p.first,p.second);

        }else
        {
            //bool IsGPUSetting = (p.first == "--disable-gpu") || (p.first == "--disable-gpu-compositing");
            bool IsGPUSetting = false;
            //bool DisableWebgl = Settings->Webgl() == "disable";
            bool DisableWebgl = false;

            if(
                    (!IsGPUSetting || (IsGPUSetting && DisableWebgl))
                    &&
                    (!Data->IsRecord || p.first != "--disable-threaded-compositing")
              )
            {
                WORKER_LOG("ChromeCommandLine<<" + p.first);
                command_line->AppendSwitch(p.first);
            }

        }
    }



    if(Settings->UseFlash())
        command_line->AppendSwitch("--enable-system-flash");
}

void MainApp::OnBeforeChildProcessLaunch(CefRefPtr<CefCommandLine> command_line)
{
    command_line->AppendSwitchWithValue("parent-process-id",std::to_string(GetCurrentProcessId()));
    if(IsMainBrowserCreating)
    {
        command_line->AppendSwitchWithValue("unique-process-id",Settings->UniqueProcessId());
    }

}

bool MainApp::IsNeedQuit()
{
    if(!_HandlersManager->GetHandler())
        return false;

    return _HandlersManager->GetHandler()->IsNeedQuit();
}

void MainApp::SendTextResponce(const std::string& text)
{
    for(auto f:EventSendTextResponce)
        f(text);
}


void MainApp::AddCacheMaskAllowCallback(const std::string& value)
{
    WORKER_LOG(std::string("AddCacheMaskAllowCallback<<") + value);
    std::pair<bool, std::string> data;
    data.first = true;
    data.second = value;
    {
        LOCK_BROWSER_DATA
        Data->_CacheMask.push_back(data);
    }
    SendTextResponce("<AddCacheMaskAllow/>");
}
void MainApp::AddCacheMaskDenyCallback(const std::string& value)
{
    WORKER_LOG(std::string("AddCacheMaskDenyCallback<<") + value);
    std::pair<bool, std::string> data;
    data.first = false;
    data.second = value;
    {
        LOCK_BROWSER_DATA
        Data->_CacheMask.push_back(data);
    }
    SendTextResponce("<AddCacheMaskDeny/>");
}
void MainApp::AddRequestMaskAllowCallback(const std::string& value)
{
    WORKER_LOG(std::string("AddRequestMaskAllowCallback<<") + value);
    std::pair<bool, std::string> data;
    data.first = true;
    data.second = value;
    {
        LOCK_BROWSER_DATA
        Data->_RequestMask.push_back(data);
    }
    SendTextResponce("<AddRequestMaskAllow/>");
}
void MainApp::AddRequestMaskDenyCallback(const std::string& value)
{
    WORKER_LOG(std::string("AddRequestMaskDenyCallback<<") + value);
    std::pair<bool, std::string> data;
    data.first = false;
    data.second = value;
    {
        LOCK_BROWSER_DATA
        Data->_RequestMask.push_back(data);
    }
    SendTextResponce("<AddRequestMaskDeny/>");
}
void MainApp::ClearCacheMaskCallback()
{
    WORKER_LOG(std::string("ClearCacheMaskCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_CacheMask.clear();
    }
    SendTextResponce("<ClearCacheMask/>");
}

void MainApp::AllowPopups()
{
    Data->AllowPopups = true;
    SendTextResponce("<AllowPopups/>");
}

void MainApp::RestrictPopups()
{
    Data->AllowPopups = false;
    SendTextResponce("<RestrictPopups/>");
}

void MainApp::AllowDownloads()
{
    Data->AllowDownloads = true;
    SendTextResponce("<AllowDownloads/>");
}

void MainApp::RestrictDownloads()
{
    Data->AllowDownloads = false;
    SendTextResponce("<RestrictDownloads/>");
}

void MainApp::ClearRequestMaskCallback()
{
    WORKER_LOG(std::string("ClearRequestMaskCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_RequestMask.clear();
    }
    SendTextResponce("<ClearRequestMask/>");
}
void MainApp::ClearLoadedUrlCallback()
{
    WORKER_LOG(std::string("ClearLoadedUrlCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_LoadedUrls.clear();
    }
    SendTextResponce("<ClearLoadedUrl/>");
}
void MainApp::ClearCachedDataCallback()
{
    WORKER_LOG(std::string("ClearCachedDataCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_CachedData.clear();
    }
    SendTextResponce("<ClearCachedData/>");
}
void MainApp::ClearAllCallback()
{
    WORKER_LOG(std::string("ClearAllCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_CacheMask.clear();
        Data->_RequestMask.clear();
        Data->_LoadedUrls.clear();
        Data->_CachedData.clear();
    }
    SendTextResponce("<ClearAll/>");
}
void MainApp::ClearMasksCallback()
{
    WORKER_LOG(std::string("ClearMasksCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_CacheMask.clear();
        Data->_RequestMask.clear();
    }
    SendTextResponce("<ClearMasks/>");
}
void MainApp::ClearDataCallback()
{
    WORKER_LOG(std::string("ClearDataCallback<<"));
    {
        LOCK_BROWSER_DATA
        Data->_LoadedUrls.clear();
        Data->_CachedData.clear();
    }
    SendTextResponce("<ClearData/>");
}
void MainApp::WaitCodeCallback()
{
    if(!_HandlersManager->GetBrowser())
    {
        NextLoadPage = "about:blank";
        AfterReadyToCreateBrowser(true);
    }
    CreateTooboxBrowser();
    CreateScenarioBrowser();
    Layout->UpdateState(MainLayout::Ready);
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_HideWaiting()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    if(BrowserScenario)
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_NotRunningTask()","scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
    Layout->UpdateTabs();
}

void MainApp::StartSectionCallback(int Id)
{
    if(!_HandlersManager->GetBrowser())
    {
        NextLoadPage = "about:blank";
        AfterReadyToCreateBrowser(true);
    }
    CreateTooboxBrowser();
    CreateScenarioBrowser();
    Layout->UpdateState(MainLayout::Ready);
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_HideWaiting()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    if(BrowserScenario)
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_NotRunningTask(") + std::to_string(Id) + std::string(")"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
    Layout->UpdateTabs();
}

void MainApp::ScriptFinishedCallback()
{
    WORKER_LOG("ScriptFinishedCallback");
    Layout->UpdateState(MainLayout::Finished);
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_HideWaiting()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    if(BrowserScenario)
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_RunningTask()","scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
    Hide();
}

void MainApp::FindCacheByMaskBase64Callback(const std::string& value)
{
    WORKER_LOG(std::string("FindCacheByMaskBase64Callback<<") + value);
    std::string res = "";
    {
        LOCK_BROWSER_DATA
        //Search backward
        for(vector<std::pair<std::string, std::shared_ptr<BrowserData::CachedItem> > >::reverse_iterator i = Data->_CachedData.rbegin(); i != Data->_CachedData.rend(); ++i )
        {
            if(match(value,i->first) || match(urlnormalize(value),urlnormalize(i->first)))
            {
                res = base64_encode((unsigned char const *)i->second->body.data(),i->second->body.size());
                break;
            }
        }
        if(value == "download://*")
        {
            //errase all info about previous download
            auto i = Data->_LoadedUrls.begin();
            while (i != Data->_LoadedUrls.end())
            {
                if(starts_with(i->first,"download://"))
                {
                    i = Data->_LoadedUrls.erase(i);
                }else
                {
                    ++i;
                }
            }
        }
    }
    xml_encode(res);
    SendTextResponce(std::string("<FindCacheByMaskBase64>") + res + ("</FindCacheByMaskBase64>"));
}
void MainApp::FindStatusByMaskCallback(const std::string& value)
{
    WORKER_LOG(std::string("FindStatusByMaskCallback<<") + value);
    std::string res = "0";
    {
        LOCK_BROWSER_DATA
        for(std::pair<std::string, int> url:Data->_LoadedUrls)
        {
            if(match(value,url.first) || match(urlnormalize(value),urlnormalize(url.first)))
            {
                res = std::to_string(url.second);
                break;
            }
        }
    }
    SendTextResponce(std::string("<FindStatusByMask>") + res + ("</FindStatusByMask>"));
}

void MainApp::FindUrlByMaskCallback(const std::string& value)
{
    WORKER_LOG(std::string("FindUrlByMaskCallback<<") + value);
    std::string res;
    {
        LOCK_BROWSER_DATA
        for(std::pair<std::string, int> url:Data->_LoadedUrls)
        {
            if(match(value,url.first) || match(urlnormalize(value),urlnormalize(url.first)))
            {
                res = url.first;
                break;
            }
        }
    }
    xml_encode(res);
    SendTextResponce(std::string("<FindUrlByMask>") + res + ("</FindUrlByMask>"));
}

void MainApp::GetLoadStatsCallback()
{
    int is_loading = 0;
    if(_HandlersManager->GetBrowser())
        is_loading = _HandlersManager->GetBrowser()->IsLoading();

    int64 Oldest;
    if(Settings->ProxyTunneling())
    {
        LOCK_BROWSER_DATA
        Oldest = Data->_RequestList.Oldest();
    }
    else
        Oldest = Data->OldestRequestTime;

    if(_HandlersManager->GetBrowser() && _HandlersManager->GetBrowser()->GetMainFrame() && _HandlersManager->GetBrowser()->GetMainFrame()->GetURL() == "about:blank")
    {
        is_loading = false;
        Oldest = 0;
    }
    SendTextResponce(std::string("<GetLoadStats>") + std::to_string(is_loading) + "," + std::to_string(Oldest) + std::string("</GetLoadStats>"));
    return;
}


void MainApp::FindCacheByMaskStringCallback(const std::string& value)
{

    WORKER_LOG(std::string("FindCacheByMaskStringCallback<<") + value);
    std::string res = "";
    {
        LOCK_BROWSER_DATA
        //Search backward
        for(vector<std::pair<std::string, std::shared_ptr<BrowserData::CachedItem> > >::reverse_iterator i = Data->_CachedData.rbegin(); i != Data->_CachedData.rend(); ++i )
        {
            if(match(value,i->first) || match(urlnormalize(value),urlnormalize(i->first)))
            {
                res = std::string(i->second->body.begin(),i->second->body.end());
                break;
            }
        }
        if(value == "download://*")
        {
            //errase all info about previous download
            auto i = Data->_LoadedUrls.begin();
            while (i != Data->_LoadedUrls.end())
            {
                if(starts_with(i->first,"download://"))
                {
                    i = Data->_LoadedUrls.erase(i);
                }else
                {
                    ++i;
                }
            }
        }
    }
    xml_encode(res);
    SendTextResponce(std::string("<FindCacheByMaskString>") + res + std::string("</FindCacheByMaskString>"));
}


void MainApp::FindAllCacheCallback(const std::string& value)
{
    WORKER_LOG(std::string("FindAllCacheByMaskCallback<<") + value);


    picojson::array res;
    {
        LOCK_BROWSER_DATA
        //Search backward
        for(vector<std::pair<std::string, std::shared_ptr<BrowserData::CachedItem> > >::iterator i = Data->_CachedData.begin(); i != Data->_CachedData.end(); ++i )
        {
            if(match(value,i->first) || match(urlnormalize(value),urlnormalize(i->first)))
            {
                picojson::object item;
                item["status"] = picojson::value((double)i->second->status);
                picojson::array item_request_headers;
                for(std::pair<std::string, std::string>& RequestHeader: i->second->request_headers)
                {
                    picojson::array item_request_header;
                    item_request_header.push_back(picojson::value(RequestHeader.first));
                    item_request_header.push_back(picojson::value(RequestHeader.second));
                    item_request_headers.push_back(picojson::value(item_request_header));
                }
                item["request_headers"] = picojson::value(item_request_headers);

                picojson::array item_response_headers;
                for(std::pair<std::string, std::string>& ResponseHeader: i->second->response_headers)
                {
                    picojson::array item_response_header;
                    item_response_header.push_back(picojson::value(ResponseHeader.first));
                    item_response_header.push_back(picojson::value(ResponseHeader.second));
                    item_response_headers.push_back(picojson::value(item_response_header));
                }
                item["response_headers"] = picojson::value(item_response_headers);

                item["body"] = picojson::value(base64_encode((unsigned char const *)i->second->body.data(),i->second->body.size()));

                item["url"] = picojson::value(i->second->url);

                item["post_data"] = picojson::value(base64_encode((unsigned char const *)i->second->post_data.data(),i->second->post_data.size()));

                item["is_error"] = picojson::value((double)i->second->is_error);

                item["is_finished"] = picojson::value((double)i->second->is_finished);

                item["error"] = picojson::value(i->second->error);

                res.push_back(picojson::value(item));

            }
        }
    }
    std::string result_string = picojson::value(res).serialize();
    xml_encode(result_string);
    SendTextResponce(std::string("<FindAllCache>") + result_string + std::string("</FindAllCache>"));
}


void MainApp::IsUrlLoadedByMaskCallback(const std::string& value)
{
    WORKER_LOG(std::string("IsUrlLoadedByMaskCallback<<") + value);
    std::string res = "0";
    {
        LOCK_BROWSER_DATA
        for(std::pair<std::string, int> url:Data->_LoadedUrls)
        {
            if(match(value,url.first) || match(urlnormalize(value),urlnormalize(url.first)))
            {
                res = "1";
                break;
            }
        }
    }
    SendTextResponce(std::string("<IsUrlLoadedByMask>") + res + ("</IsUrlLoadedByMask>"));

}

void MainApp::SetCodeCallback(const std::string & code,const std::string & embedded,const std::string & schema,bool is_testing)
{
    Data->IsTesing = is_testing;
    Schema = schema;
    Code = code;
    EmbeddedData = embedded;
    if(code.empty())
        Code = " ";
    Variables = extract_variables(code);
    GlobalVariables = extract_global_variables(code);
    Labels = extract_labels(code);
    Functions = extract_functions(code);
    std::string AdditionalResourcesPrev = AdditionalResources;
    AdditionalResources = extract_resources(code);
    if(AdditionalResourcesPrev!=AdditionalResources)
        ResourcesChanged = true;
}

void MainApp::SetResourceCallback(const std::string & resources)
{
    Resources = resources;
    ResourcesChanged = true;
}

void MainApp::CrushCallback()
{
    *((unsigned int*)0) = 0xDEAD;
}

void MainApp::SetInitialStateCallback(const std::string & lang)
{
    Lang = lang;
}

void MainApp::SetNextActionCallback(const std::string& NextActionId)
{
    if(scenariov8handler && scenariov8handler->GetIsInitialized())
    {
        if(BrowserScenario)
            BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_NotRunningTask(") + NextActionId + std::string(")"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
    }else
    {
        SetNextActionId = NextActionId;
    }
}

void MainApp::ClearElementCommand()
{
    WORKER_LOG("ClearElementCommand");
    IsLastCommandNull = true;
    ExecuteFrameChain.clear();
    ExecuteFrameSearching = false;
    ExecuteFrameScrolling = false;
    ExecuteFrameScrollingSwitch = false;
    ExecuteSearchCoordinatesX = 0;
    ExecuteSearchCoordinatesY = 0;
    RunElementCommandCallbackOnNextTimer = -1;
    TypeTextTaskIsActive = false;
    IsMouseMoveSimulation = false;
}
void MainApp::ElementCommandCallback(const ElementCommand &Command)
{
    ClearElementCommand();
    LastCommandCopy = Command;
    ElementCommandInternalCallback(Command);
}

void MainApp::ElementCommandInternalCallback(const ElementCommand &Command)
{
    WORKER_LOG(std::string("ElementCommandCallback<<"));
    RunElementCommandCallbackOnNextTimer = -1;
    LastCommand = Command;
    IsLastCommandNull = false;

    //Check if need to search for frame
    bool NeedToSearchInFrames = false;
    picojson::array FrameSearchPath;
    for(ExecuteFrameSearchingLength = 0;ExecuteFrameSearchingLength<LastCommand.Path.size();ExecuteFrameSearchingLength++)
    {
        std::string NextCommand = LastCommand.Path.at(ExecuteFrameSearchingLength).first;

        if(NextCommand == "frame_css")
        {
            FrameSearchPath.clear();
            FrameSearchPath.push_back(picojson::value("css"));
            FrameSearchPath.push_back(picojson::value(LastCommand.Path.at(ExecuteFrameSearchingLength).second));
            NeedToSearchInFrames = true;
            break;
        }else if(NextCommand == "frame_match")
        {
            FrameSearchPath.clear();
            FrameSearchPath.push_back(picojson::value("match"));
            FrameSearchPath.push_back(picojson::value(LastCommand.Path.at(ExecuteFrameSearchingLength).second));
            NeedToSearchInFrames = true;
            break;
        }else if(NextCommand == "frame_element")
        {
            NeedToSearchInFrames = true;
            break;
        }else
        {
            FrameSearchPath.push_back(picojson::value(NextCommand));
            FrameSearchPath.push_back(picojson::value(LastCommand.Path.at(ExecuteFrameSearchingLength).second));
        }
    }



    if(NeedToSearchInFrames)
    {
        WORKER_LOG("NeedToSearchInFrames");
        //On first searching
        if(!ExecuteFrameSearching)
        {
            ExecuteFrameChain.clear();
            ExecuteSearchCoordinatesX = 0;
            ExecuteSearchCoordinatesY = 0;
            ExecuteFrameScrolling = Command.CommandName == "system_click"
                    || Command.CommandName == "check"
                    || Command.CommandName == "system_click_down"
                    || Command.CommandName == "system_click_up"
                    || Command.CommandName == "move"
                    || Command.CommandName == "type"
                    || Command.CommandName == "clear"
                    || Command.CommandName == "set"
                    || Command.CommandName == "set_integer"
                    || Command.CommandName == "set_random"
                    || Command.CommandName == "random_point"
                    || Command.CommandName == "clarify"
                    || Command.CommandName == "render_base64"
                    || Command.CommandName == "focus"
                    || Command.CommandName == "render_base64";
            ExecuteFrameScrollingSwitch = false;
            //ExecuteInnerFrameScrolling = ExecuteFrameScrolling;
        }
        ExecuteFrameSearching = true;

        std::string script;

        std::string path = picojson::value(picojson::value(FrameSearchPath).serialize()).serialize();
        if(ExecuteFrameScrolling)
        {
            ExecuteFrameScrollingSwitch = !ExecuteFrameScrollingSwitch;
        }else
        {
            ExecuteFrameScrollingSwitch = false;
        }

        if(ExecuteFrameScrollingSwitch)
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + path + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }else
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + path + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_frame_find_result)(0,0,'','','','',0,0,false);return;};"
                "var rect = el.getBoundingClientRect();"
                "var frame_index=_BAS_HIDE(BrowserAutomationStudio_GetFrameIndex)(el);"
                "var r = _BAS_HIDE(BrowserAutomationStudio_GetInternalBoundingRect)(el);"
                "_BAS_HIDE(browser_automation_studio_frame_find_result)(parseInt(rect.left),parseInt(rect.top),el.getAttribute('name')||'',el.getAttribute('src')||'',el.outerHTML||'',frame_index,r.left,r.top,true);}"),"main");
        }
        script = std::string("(function(){") + script + std::string("})()");
        //WORKER_LOG(script);
        CefRefPtr<CefFrame> Frame;
        if(ExecuteFrameChain.empty())
            Frame = _HandlersManager->GetBrowser()->GetMainFrame();
        else
            Frame = _HandlersManager->GetBrowser()->GetFrame(ExecuteFrameChain.at(ExecuteFrameChain.size()-1).FrameData.frame_id);

        Frame->ExecuteJavaScript(script.c_str(),"", 0);

        return;
    }

    ExecuteFrameSearching = false;
    ExecuteFrameScrolling = false;
    ExecuteFrameScrollingSwitch = false;


    WORKER_LOG("ExecuteFrame stage finished");
    WORKER_LOG(std::to_string(ExecuteSearchCoordinatesX));
    WORKER_LOG(std::to_string(ExecuteSearchCoordinatesY));



    if(_HandlersManager->GetBrowser())
    {
        std::string script;
        if(Command.CommandName == "xml")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var res = '';if(el){res = el.outerHTML}_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");
        }else if(Command.CommandName == "text")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var res = '';try{if(el){if(el.tagName.toLowerCase()=='input'||el.tagName.toLowerCase()=='textarea')res=el.value;else res=el.textContent}}catch(e){}_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");
        }else if(Command.CommandName == "script")
        {
            std::string script_escaped = picojson::value(Javascript(LastCommand.CommandParam1,"main")).serialize();
            std::string script_alternative = Javascript(std::string("(function(){var positionx=") + std::to_string(ExecuteSearchCoordinatesX) + std::string(";var positiony=") + std::to_string(ExecuteSearchCoordinatesY) + std::string(";var scrollx=") + std::to_string(Data->ScrollX) + std::string(";var scrolly=") + std::to_string(Data->ScrollY) + std::string(";var self = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!self){_BAS_HIDE(browser_automation_studio_result)('');return;};var obj=null;try{obj = ") + LastCommand.CommandParam1 + std::string(";}catch(e){}var res='';if(typeof(obj)!='undefined'&&obj !== null){res=obj.toString()}_BAS_HIDE(browser_automation_studio_result)(res);})()"),"main");
            script_alternative = picojson::value(script_alternative).serialize();
            script = Javascript(std::string("{var positionx=") + std::to_string(ExecuteSearchCoordinatesX) + std::string(";var positiony=") + std::to_string(ExecuteSearchCoordinatesY) + std::string(";var scrollx=") + std::to_string(Data->ScrollX) + std::string(";var scrolly=") + std::to_string(Data->ScrollY) + std::string(";var self = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!self){_BAS_HIDE(browser_automation_studio_result)('');return;};var obj=null;try{obj = eval(") + script_escaped + std::string(");}catch(e){if(e.message.indexOf('Content Security Policy')>=0){_BAS_HIDE(browser_automation_studio_eval)(") + script_alternative + std::string(");return}}var res='';if(typeof(obj)!='undefined'&&obj !== null){res=obj.toString()}_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");

        }else if(Command.CommandName == "click")
        {
            BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};if(el)el.click();_BAS_HIDE(browser_automation_studio_result)('');}"),"main");
        }else if(Command.CommandName == "system_click" || Command.CommandName == "check" || Command.CommandName == "system_click_down" || Command.CommandName == "system_click_up")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }else if(Command.CommandName == "move")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }else if(Command.CommandName == "fill")
        {
            BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
            std::string text_escaped = picojson::value(LastCommand.CommandParam1).serialize();
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};if(el){el.value = ") + text_escaped + std::string("};_BAS_HIDE(browser_automation_studio_result)('');}"),"main");
        }else if(Command.CommandName == "type")
        {
            BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
            TypeText = ReplaceAll(LastCommand.CommandParam1,"\r\n","<RETURN>");
            TypeText = ReplaceAll(TypeText,"\n","<RETURN>");

            TypeTextDelay = std::stoi(LastCommand.CommandParam2);

            if(TypeText == "<CONTROL>a<DELETE>")
            {
                TypeText = "<CONTROL>a<BACK>";
                TypeTextDelay = 30;
            }

            if(LastCommand.Path.size()>0)
            {
                script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
            }
            else
            {
                TypeTextTaskIsActive = true;
                TypeTextIsFirstLetter = false;
                TypeTextLastTime = 0;
                TypeTextState.Clear();
            }
        }else if(Command.CommandName == "clear")
        {
            BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
            TypeText = "<CONTROL>a<DELETE>";
            TypeTextDelay = 100;
            if(LastCommand.Path.size()>0)
            {
                script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
            }
            else
            {
                TypeTextTaskIsActive = true;
                TypeTextIsFirstLetter = false;
                TypeTextLastTime = 0;
                TypeTextState.Clear();
            }
        }else if(Command.CommandName == "exist")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");var res;if(el)res='1';else res='0';_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");
        }else if(Command.CommandName == "submit")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};if(el)el.submit();_BAS_HIDE(browser_automation_studio_result)('');}"),"main");
        }else if(Command.CommandName == "style")
        {
            std::string style_escaped = picojson::value(LastCommand.CommandParam1).serialize();
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var res='';if(el)res=window.getComputedStyle(el)[") + style_escaped + std::string("];_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");
        }
        else if(Command.CommandName == "set")
        {
            LastCommand.StageId = 0;
            std::string set_escaped = picojson::value(LastCommand.CommandParam1).serialize();
            std::string proc = std::string("{var option_list = el.querySelectorAll(\"option\");"
                    "keys = \"<HOME>\";"
                    "for(var i = 0;i<option_list.length;i++)"
                    "{"
                      "var option = option_list.item(i);"
                      "if(option.innerHTML === ") + set_escaped + std::string(")break;"
                      "keys += \"<DOWN>\";"
                    "}"
                    "keys += \"<RETURN>\";}"
                     );
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var keys='';if(el){") + proc + std::string("}_BAS_HIDE(browser_automation_studio_result)(keys);}"),"main");

        }else if(Command.CommandName == "set_integer")
        {
            LastCommand.StageId = 0;
            std::string proc = std::string("{var option_list = el.querySelectorAll(\"option\");"
                    "keys = \"<HOME>\";"
                    "for(var i = 0;i<") + LastCommand.CommandParam1 + std::string(";i++)"
                    "{"
                      "keys += \"<DOWN>\";"
                    "}"
                    "keys += \"<RETURN>\";}"
                     );
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var keys='';if(el){") + proc + std::string("}_BAS_HIDE(browser_automation_studio_result)(keys);}"),"main");

        }else if(Command.CommandName == "set_random")
        {
            LastCommand.StageId = 0;
            std::string proc = std::string("{var option_list = el.querySelectorAll(\"option\");"
                    "keys = \"<HOME>\";"
                    "var index = Math.floor((Math.random() * option_list.length));"
                    "for(var i = 0;i<option_list.length;i++)"
                    "{"
                      "var option = option_list.item(i);"
                      "if(i === index)break;"
                      "keys += \"<DOWN>\";"
                    "}"
                    "keys += \"<RETURN>\";}"
                     );
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var keys='';if(el){") + proc + std::string("}_BAS_HIDE(browser_automation_studio_result)(keys);}"),"main");
        }else if(Command.CommandName == "random_point")
        {
            LastCommand.StageId = 0;
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }else if(Command.CommandName == "clarify")
        {
            LastCommand.StageId = 0;
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }else if(Command.CommandName == "attr")
        {
            std::string attr_escaped = picojson::value(LastCommand.CommandParam1).serialize();
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var res='';var attr=") + attr_escaped + std::string(";if(el){if(el.hasAttribute(attr))res=el.getAttribute(attr);}_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");
        }else if(Command.CommandName == "set_attr")
        {
            std::string attr_escaped = picojson::value(LastCommand.CommandParam1).serialize();
            std::string val_escaped = picojson::value(LastCommand.CommandParam2).serialize();
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var attr=") + attr_escaped + std::string(";var val=") + val_escaped + std::string(";if(el){if(val.length === 0)el.removeAttribute(attr);else el.setAttribute(attr,val);}_BAS_HIDE(browser_automation_studio_result)('');}"),"main");
        }else if(Command.CommandName == "length")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};var res = '';if(el){res = el.length;}_BAS_HIDE(browser_automation_studio_result)(res);}"),"main");
        }else if(Command.CommandName == "highlight")
        {
            ClearHighlight();
            if(ExecuteFrameChain.empty())
            {
                HighlightFrameId = -1;
                HighlightOffsetX = 0;
                HighlightOffsetY = 0;
            }
            else
            {
                HighlightFrameId = ExecuteFrameChain.at(ExecuteFrameChain.size()-1).FrameData.frame_id;
                HighlightOffsetX = ExecuteSearchCoordinatesX + Data->ScrollX;
                HighlightOffsetY = ExecuteSearchCoordinatesY + Data->ScrollY;
            }

            LastHighlightSelector = Command.CommandParam1;

            std::string MultiloginCheckData;
            if(Data->_MultiSelectData.IsDirty)
            {
                LOCK_BROWSER_DATA
                MultiloginCheckData = std::string("_BAS_HIDE(BrowserAutomationStudio_SetMultiSelectData)(") + Data->_MultiSelectData.Serialize() + std::string("); ");
                Data->_MultiSelectData.IsDirty = false;
            }

            script = Javascript(std::string("{") + MultiloginCheckData + std::string("var p = ") + LastCommand.SerializePath() + std::string(";var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(p);if(JSON.parse(p).length == 0 || !el){el = []}else if(typeof(el.length) != 'number'){el = [el];};_BAS_HIDE(BrowserAutomationStudio_SetHighlightElements)(el);_BAS_HIDE(browser_automation_studio_result)(el.length);}"),"main");
        }else if(Command.CommandName == "render_base64")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }else if(Command.CommandName == "focus")
        {
            script = Javascript(std::string("{var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el);}"),"main");
        }
        if(!script.empty())
        {
            script = std::string("(function(){") + script + std::string("})()");
            WORKER_LOG(std::string("EXEC<<") + script);
            if(Command.FrameUrl.empty())
            {
                CefRefPtr<CefFrame> Frame;

                if(ExecuteFrameChain.empty())
                    Frame = _HandlersManager->GetBrowser()->GetMainFrame();
                else
                    Frame = _HandlersManager->GetBrowser()->GetFrame(ExecuteFrameChain.at(ExecuteFrameChain.size()-1).FrameData.frame_id);

                Frame->ExecuteJavaScript(script.c_str(),"", 0);
            }
            else
            {
                std::vector<int64> identifiers;
                _HandlersManager->GetBrowser()->GetFrameIdentifiers(identifiers);
                WORKER_LOG(std::string("FRAME_NUMBER ") + std::to_string(identifiers.size()));

                bool done = false;
                for(int64 id:identifiers)
                {
                    WORKER_LOG(std::string("FRAME_URL ") + std::to_string(identifiers.size()));

                    if(match(Command.FrameUrl,_HandlersManager->GetBrowser()->GetFrame(id)->GetURL().ToString()))
                    {
                        WORKER_LOG(std::string("ExecutingInFrame<<") + _HandlersManager->GetBrowser()->GetFrame(id)->GetURL().ToString());
                        _HandlersManager->GetBrowser()->GetFrame(id)->ExecuteJavaScript(script.c_str(),"", 0);
                        done = true;
                        break;
                    }
                }
                if(!done)
                {
                    SendTextResponce(std::string("<Element ID=\"") + Command.CommandId + std::string("\"><") + Command.CommandName + std::string(">") + std::string("</") + Command.CommandName + ("></Element>"));
                    WORKER_LOG(std::string("ElementCommandCallbackDefault>>FailedToFindFrame"));
                }

            }
        }
    }else
    {
        SendTextResponce(std::string("<Element ID=\"") + Command.CommandId + std::string("\"><") + Command.CommandName + std::string(">") + std::string("</") + Command.CommandName + ("></Element>"));
        WORKER_LOG(std::string("ElementCommandCallbackDefault>>"));
    }
}

void MainApp::CefMessageLoop()
{
    if(SkipBeforeRenderNextFrame > 1)
    {
        SkipBeforeRenderNextFrame--;
        if(SkipBeforeRenderNextFrame<=1 && _HandlersManager->GetBrowser())
        {
            _HandlersManager->GetBrowser()->GetHost()->Invalidate(PET_VIEW);
        }

    }
}

void MainApp::Timer()
{

    //Tracking page scrolling
    if(ScrollStopTracking > 0)
    {
        clock_t CurrentTime = clock();

        if(Data->ScrollX == ScrollTrackingX && Data->ScrollY == ScrollTrackingY)
        {
            if(float( CurrentTime - ScrollStopTracking ) / CLOCKS_PER_SEC > 0.1)
            {
                ScrollStopTracking = 0;
                ScrollTrackingX = 0;
                ScrollTrackingY = 0;
                ScrollStopTrackingStart = 0;
                DoTrackScroll = false;
                SendTextResponce("<MouseMove></MouseMove>");
            }
        }else
        {
            ScrollStopTracking = CurrentTime;
            ScrollTrackingX = Data->ScrollX;
            ScrollTrackingY = Data->ScrollY;
        }

        if(ScrollStopTracking > 0 && float( CurrentTime - ScrollStopTrackingStart ) / CLOCKS_PER_SEC > 5.0)
        {
            ScrollStopTracking = 0;
            ScrollTrackingX = 0;
            ScrollTrackingY = 0;
            ScrollStopTrackingStart = 0;
            DoTrackScroll = false;
            SendTextResponce("<MouseMove></MouseMove>");
        }
    }


    if(DelayClickType == 1 || DelayClickType == 2)
    {
        clock_t CurrentTime = clock();
        if(CurrentTime >= DelayNextClick)
        {
            BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),DelayClickX,DelayClickY,GetScrollPosition(),1,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
            if(DelayClickType == 1)
            {
                SendTextResponce("<MouseClick></MouseClick>");
            }else
            {
                FinishedLastCommand("");
            }
            DelayClickType = 0;
        }
    }

    if(Data->IsRecord)
    {
        if(Settings->Detector())
        {
            int NewFingerprintDataNumber = Detector.Timer(BrowserDetector,detector8handler && detector8handler->GetIsInitialized());
            if(NewFingerprintDataNumber > 0)
                Layout->UpdateFingerprintDetectorNumber(Layout->GetFingerprintDetectorNumber() + NewFingerprintDataNumber);
            {
                LOCK_BROWSER_DATA
                if(Detector.GetLastGroupCount() > 1000)
                {
                    Data->Saver.TemporaryDisableDetector = true;
                    Data->Saver.Save();
                }
            }
        }else
        {
            if(Layout->GetFingerprintDetectorNumber() != -1)
                Layout->UpdateFingerprintDetectorNumber(-1);
        }
    }

    if(Data->IsRecord && BrowserToolbox)
    {
        Notifications.Timer(BrowserToolbox);
    }

    HandleIPCData();

    if(RunElementCommandCallbackOnNextTimer >= 0)
    {
        if(RunElementCommandCallbackOnNextTimer == 0)
        {
            WORKER_LOG("Execute last command");
            if(!IsLastCommandNull)
                ElementCommandCallback(LastCommandCopy);
        }else
        {
            RunElementCommandCallbackOnNextTimer --;
        }
    }

    ExecuteTypeText();

    ExecuteMouseMove();

    if(v8handler)
        HandleMainBrowserEvents();

    if(v8handler)
        HandleFrameFindEvents();

    if(toolboxv8handler)
        HandleToolboxBrowserEvents();

    if(scenariov8handler)
        HandleScenarioBrowserEvents();

    if(central8handler)
        HandleCentralBrowserEvents();

    if(detector8handler)
        HandleDetectorBrowserEvents();

    if(dhandler)
        dhandler->Timer();

    _HandlersManager->Timer();

    if(_HandlersManager->GetHandler())
    {
        //CefPostTask(TID_IO, base::Bind(&MainHandler::CleanResourceHandlerList, _HandlersManager->GetHandler()));
        if(_HandlersManager->GetHandler()->GetResourceListLength() == 0 && Data->IsReset && Data->IsAboutBlankLoaded)
        {
            ResetCallbackFinalize();
        }
    }

    if(_HandlersManager->CheckIsClosed())
    {
        SendTextResponce("<PopupClose></PopupClose>");
    }

    UpdateWindowPositionWithParent();

    if(Data->IsRecord)
        UpdateHighlight();

    auto now = duration_cast< milliseconds >( system_clock::now().time_since_epoch() ).count();
    if(now > Data->LastClearRequest + 5000 || Data->LastClearRequest == 0)
    {
        LOCK_BROWSER_DATA
        Data->LastClearRequest = now;
        Data->_RequestList.RemoveOld();
    }

    if(Data->ManualControl != BrowserData::Indirect && _HandlersManager->GetBrowser())
    {
        Layout->SetCanGoBack(_HandlersManager->GetBrowser()->CanGoBack());
    }

    DirectControlInspectMouse();

    if(!ProxyLibraryLoaded)
        CheckNetworkProcessIPC();

}

void MainApp::InitNetworkProcessIPC()
{
    NetworkProcessIPC.Init(std::string("in") + Data->_UniqueProcessId);
}

void MainApp::CheckNetworkProcessIPC()
{
    if(NetworkProcessIPC.Peek())
    {
        std::vector<std::string> DataAll = NetworkProcessIPC.Read();
        if(!DataAll.empty())
        {
            WORKER_LOG("CheckNetworkProcessIPC");
            SendTextResponce("<SendWorkerSettings></SendWorkerSettings>");
            ProxyLibraryLoaded = true;
        }
    }
}

void MainApp::DirectControlInspectMouse()
{
    if(Data->ManualControl != BrowserData::DirectRecord)
        return;

    clock_t CurrentTime = 0;

    if(InspectFrameSearching)
    {
        CurrentTime = clock();
        float time_spent = float( CurrentTime - LastMouseTrack ) /  CLOCKS_PER_SEC;

        if(time_spent >= 3)
        {
            InspectFrameSearching = false;
            DirectControl()->TimeoutLastInspect();
        }
    }

    if(InspectFrameSearching)
       return;

    BrowserDirectControl::InspectTask Task = DirectControl()->GetInspectTask();

    if(Task.IsNull)
        return;

    if(CurrentTime == 0)
        CurrentTime = clock();

    InspectMouseAt(Task.X, Task.Y, CurrentTime);
}

void MainApp::HandleIPCData()
{
    bool IsNewImage = false;
    unsigned int Width = 0;
    unsigned int Height = 0;

    //Get data
    {
        SharedMemoryIPC * IPC = Data->IPC;

        SharedMemoryIPCLockGuard Lock(IPC);

        if(IPC->GetImageId())
        {
            ImageData.assign(IPC->GetImagePointer(),IPC->GetImagePointer() + IPC->GetImageSize());
            Width = IPC->GetImageWidth();
            Height = IPC->GetImageHeight();
            IPC->SetImageId(0);
            IsNewImage = true;
        }

    }

    //Paint screenshot
    if(IsNewImage)
    {
        Paint(Width,Height);
        if(Width != Data->WidthBrowser || Height != Data->HeightBrowser)
        {
            Data->WidthBrowser = Width;
            Data->HeightBrowser = Height;
            Layout->Update(Data->WidthBrowser,Data->HeightBrowser,Data->WidthAll,Data->HeightAll);
        }
    }
}

void MainApp::ClearHighlight()
{
    if(v8handler.get())
        v8handler->ClearHighlightLast();
    {
        LOCK_BROWSER_DATA
        Data->_Highlight.highlights.clear();
    }

    RECT r = Layout->GetBrowserOuterRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
    InvalidateRect(Data->_MainWindowHandle,&r,false);
}

void MainApp::UpdateMultiSelect()
{
    if(Data->MultiselectMode && Data->_MultiSelectData.IsDirty && _HandlersManager->GetBrowser())
    {
        Data->_MultiSelectData.IsDirty = false;

        std::string MultiloginCheckData;
        {
            LOCK_BROWSER_DATA
            MultiloginCheckData = std::string("_BAS_HIDE(BrowserAutomationStudio_SetMultiSelectData)(") + Data->_MultiSelectData.Serialize() + std::string(");_BAS_HIDE(BrowserAutomationStudio_HighlightMultiselect)();");
        }

        if(HighlightFrameId<0)
        {
            _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(MultiloginCheckData,"main"),"", 0);
        }else
        {

            CefRefPtr<CefFrame> Frame = _HandlersManager->GetBrowser()->GetFrame(HighlightFrameId);
            if(Frame.get())
                Frame->ExecuteJavaScript(Javascript(MultiloginCheckData,"main"),"", 0);
        }
    }
}


void MainApp::UpdateHighlight()
{
    clock_t CurrentTime = clock();
    float time_spent = float( CurrentTime - LastHighlight ) /  CLOCKS_PER_SEC;

    if(time_spent < 0.2)
        return;

    LastHighlight = CurrentTime;

    if(_HandlersManager->GetBrowser())
    {
        std::string MultiloginCheckData;
        if(Data->_MultiSelectData.IsDirty)
        {
            LOCK_BROWSER_DATA
            MultiloginCheckData = std::string("_BAS_HIDE(BrowserAutomationStudio_SetMultiSelectData)(") + Data->_MultiSelectData.Serialize() + std::string("); ");
            Data->_MultiSelectData.IsDirty = false;
        }

        if(HighlightFrameId<0)
        {

            _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(MultiloginCheckData + std::string("_BAS_HIDE(BrowserAutomationStudio_Highlight)();"),"main"),"", 0);
        }else
        {

            CefRefPtr<CefFrame> Frame = _HandlersManager->GetBrowser()->GetFrame(HighlightFrameId);
            if(Frame.get())
                Frame->ExecuteJavaScript(Javascript(MultiloginCheckData + std::string("_BAS_HIDE(BrowserAutomationStudio_Highlight)();"),"main"),"", 0);
        }
    }

}

std::pair<std::string, bool> MainApp::GetMenuSelected()
{

    if(central8handler)
        return central8handler->GetMenuSelected();
    else
    {
        std::pair<std::string, bool> res;
        res.second = false;
        return res;
    }
}



void MainApp::HandleCentralBrowserEvents()
{
    std::pair<std::string, bool> res = central8handler->GetLoadUrl();
    if(res.second)
    {
        std::string url = res.first;
        if(url.length() >= 7 && url[0] == 'f'&& url[1] == 'i'&& url[2] == 'l'&& url[3] == 'e'&& url[4] == ':'&& url[5] == '/'&& url[6] == '/')
        {
            url = url.substr(7,url.length() - 7);
            WORKER_LOG(std::string("OpenScriptExample<<") + url);
            xml_encode(url);
            SendTextResponce(std::string("<LoadScript>") + url + std::string("</LoadScript>"));

        }else if(starts_with(url,"open://browser"))
        {
            Layout->ShowManualSelect();
            LoadManualSelect();
        }else if(starts_with(url,"open://help"))
        {
            if(BrowserScenario)
                BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_HighlightHelp()"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
        }else
        {
            ReplaceAllInPlace(res.first, "%BAS_DEBUG_PORT%", std::to_string(Data->RemoteDebuggingPort));
            WORKER_LOG(std::string("LoadUrlFromCentralBrowser<<") + res.first);
            ShellExecute(0, 0, s2ws(res.first).c_str(), 0, 0 , SW_SHOW );
        }
    }

    if(central8handler->GetClose())
    {
        BrowserCentral->GetMainFrame()->ExecuteJavaScript("document.body.style.display='none'","file:///html/central/empty.html",0);
        Layout->HideCentralBrowser();
    }

    res = central8handler->GetSettings();
    if(res.second)
    {
        std::string settings = res.first;
        WORKER_LOG(std::string("Settings updated") + settings);
        Settings->Deserialize(settings);
        Restart();
    }


    std::pair<int, bool> res2 = central8handler->GetManualControl();
    if(res2.second)
    {
        if(res2.first == 0)
        {
            Data->ManualControl = BrowserData::Indirect;
        }
        if(res2.first == 1)
        {
            Data->ManualControl = BrowserData::DirectNoRecord;
        }
        if(res2.first == 2)
        {
            Data->ManualControl = BrowserData::DirectRecord;
        }
        UpdateManualControl();

    }
}


void MainApp::HandleDetectorBrowserEvents()
{
    std::pair<std::string, bool> res = detector8handler->GetLoadUrl();
    if(res.second)
    {
        if(res.first == std::string("settings://settings"))
        {
            LoadSettingsPage();
        }else
            ShellExecute(0, 0, s2ws(res.first).c_str(), 0, 0 , SW_SHOW );
        }

    std::pair<std::string, bool> res2 = detector8handler->GetFingerprintKey();
    if(res2.second)
    {
        WriteStringToFile("fingerprint-detector.txt", res2.first);
    }

    std::pair<std::string, bool> res4 = detector8handler->GetEditSource();
    if(res4.second)
    {
        WriteStringToFile("detector-source.js", res4.first);
        ShellExecute(0, 0, L"detector-source.js", 0, 0 , SW_SHOW );

    }

    if(detector8handler->GetLogout())
    {
        WriteStringToFile("fingerprint-detector.txt", "");
    }

    if(detector8handler->GetClearAll())
    {
        Layout->UpdateFingerprintDetectorNumber(0);
    }

}

void MainApp::HandleScenarioBrowserEvents()
{
    if(Data->IsRecord && BrowserScenario && scenariov8handler->GetIsInitialized() && !BrowserScenarioDelayScript.empty())
    {
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(BrowserScenarioDelayScript,BrowserScenario->GetMainFrame()->GetURL(), 0);
        BrowserScenarioDelayScript.clear();

    }
    if(scenariov8handler->GetIsInitialized() && !Code.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_Parse(") + picojson::value(Code.data()).serialize() + std::string(")"),"scenario");
        BrowserScenario->GetMainFrame()->ExecuteJavaScript(script,BrowserScenario->GetMainFrame()->GetURL(), 0);
        Code.clear();
        if(Data->IsTesing)
        {
            Data->IsTesing = false;
            BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_Play()"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
        }
    }

    if(scenariov8handler->GetIsInitialized() && !SetNextActionId.empty())
    {
        if(BrowserScenario)
            BrowserScenario->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_NotRunningTask(") + SetNextActionId + std::string(")"),"scenario"),BrowserScenario->GetMainFrame()->GetURL(), 0);
        SetNextActionId.clear();
    }

    {
        std::pair<bool, bool> res = scenariov8handler->GetIsInsideElementLoop();
        if(res.second)
        {
            Data->MultiselectIsInsideElementLoop = res.first;
        }
    }

    std::pair<std::vector<ScenarioV8Handler::LastResultStruct>, bool> res = scenariov8handler->GetResult();
    if(res.second)
    {
        for(ScenarioV8Handler::LastResultStruct & Result:res.first)
        {
            std::string new_code = Result.LastResultCodeDiff;
            WORKER_LOG(std::string("HandleScenarioBrowserEvents<<") + new_code);
            Variables = Result.LastResultVariables;
            GlobalVariables = Result.LastResultGlobalVariables;
            Labels = Result.LastResultLabels;
            Functions = Result.LastResultFunctions;
            std::string AdditionalResourcesPrev = AdditionalResources;
            AdditionalResources = Result.LastResultResources;
            if(AdditionalResourcesPrev != AdditionalResources)
                ResourcesChanged = true;
            xml_encode(new_code);
            SendTextResponce(std::string("<ReceivedCode>") + new_code + std::string("</ReceivedCode>"));
        }
        if(!DelayedSend.empty())
        {
            SendTextResponce(DelayedSend);
            DelayedSend.clear();
        }
    }

    if(Data->IsRecord)
    {
        std::pair<ScenarioV8Handler::WebInterfaceTaskResultStruct, bool> res = scenariov8handler->GetWebInterfaceTaskResult();
        if(res.second)
        {
            std::string Result = res.first.LastWebInterfaceResultData;
            xml_encode(Result);
            SendTextResponce(
                        std::string("<RunTaskResult ResultId=\"") +
                        std::to_string(res.first.LastWebInterfaceResultId) +
                        std::string("\">") + Result + std::string("</RunTaskResult>")
                     );
        }
    }

    if(Data->IsRecord)
    {
        std::pair<ScenarioV8Handler::PrepareFunctionResultStruct, bool> res = scenariov8handler->GetPrepareFunctionResult();
        if(res.second)
        {
            std::string Data = res.first.FunctionData;
            std::string Name = res.first.FunctionName;
            xml_encode(Data);
            xml_encode(Name);
            SendTextResponce(
                        std::string("<PrepareFunction FunctionName=\"") +
                        Name +
                        std::string("\">") + Data + std::string("</PrepareFunction>")
                     );
        }
    }


    std::pair<std::string, bool> res2 = scenariov8handler->GetExecuteCode();
    if(res2.second)
    {
        Layout->UpdateState(MainLayout::Hold);
        if(BrowserToolbox)
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_ShowWaiting(") + picojson::value(res2.first).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
        std::string CodeSend = res2.first;
        WORKER_LOG(std::string("GetExecuteCode<<") + CodeSend);
        xml_encode(CodeSend);
        SendTextResponce(std::string("<WaitCode>") + CodeSend + std::string("</WaitCode>"));
    }

    if(Data->IsRecord)
    {
        std::pair<std::string, bool> res = scenariov8handler->GetCurrentFunction();
        if(res.second)
        {
            if(BrowserToolbox)
                BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_SetCurrentFunction(") + picojson::value(res.first).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
        }
    }

    std::pair<std::string, bool> res6 = scenariov8handler->GetClipboardSetRequest();
    if(res6.second)
    {
        write_clipboard(res6.first);
    }

    if(Data->IsRecord)
    {
        std::pair<std::string, bool> res = scenariov8handler->GetUpdateEmbeddedData();
        if(res.second)
        {
            if(BrowserToolbox)
                BrowserToolbox->GetMainFrame()->ExecuteJavaScript(std::string("_EmbeddedModel.Update(") + picojson::value(res.first).serialize() + std::string(")"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
        }
    }

    if(scenariov8handler->GetClipboardGetRequest())
    {
        std::string res = read_clipboard();
        std::string script = Javascript(std::string("BrowserAutomationStudio_GetClipboardResult(") + picojson::value(res).serialize() + std::string(")"),"scenario");
        if(BrowserScenario)
            BrowserScenario->GetMainFrame()->ExecuteJavaScript(script,BrowserScenario->GetMainFrame()->GetURL(), 0);
    }

    std::pair<std::string, bool> res5 = scenariov8handler->GetIsEditStart();
    if(res5.second)
    {
        std::string data = res5.first;
        WORKER_LOG(std::string("EditStart<<") + data);
        std::string script = Javascript(std::string("BrowserAutomationStudio_EditStart(") + picojson::value(data).serialize() + std::string(")"),"toolbox");
        if(BrowserToolbox)
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }


    if(scenariov8handler->GetIsEditSaveStart())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_EditSaveStart()"),"toolbox");
        if(BrowserToolbox)
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }


    bool res4 = scenariov8handler->GetIsEditEnd();
    if(res4)
    {
        WORKER_LOG(std::string("EditEnd<<"));
        std::string script = Javascript("BrowserAutomationStudio_EditEnd()","toolbox");
        if(BrowserToolbox)
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }

    std::pair<std::string, bool> res7 = scenariov8handler->GetDetectorDataCode();
    if(res7.second)
    {
        Detector.BrowserData(BrowserDetector,res7.first,detector8handler && detector8handler->GetIsInitialized());
        {
            LOCK_BROWSER_DATA
            Data->Saver.TemporaryDisableDetector = false;
            Data->Saver.Save();
        }
    }

    if(scenariov8handler->GetIsThreadNumberEditStart() && BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_ThreadNumberEdit()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

    if(scenariov8handler->GetIsSuccessNumberEditStart() && BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_SuccessNumberEdit()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

    if(scenariov8handler->GetIsFailNumberEditStart() && BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_FailNumberEdit()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

    std::pair<std::string, bool> res8 = scenariov8handler->GetIsRunFunctionStart();

    if(res8.second && BrowserToolbox)
    {
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_RunFunction(") + picojson::value(res8.first).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }

    {
        std::pair<std::string, bool> res = scenariov8handler->GetLoadUrl();
        if(res.second)
        {
            WORKER_LOG(std::string("LoadUrlFromUrlBrowser<<") + res.first);
            if(res.first == std::string("settings://settings"))
            {
                LoadSettingsPage();
            }else
            {
                ShellExecute(0, 0, s2ws(res.first).c_str(), 0, 0 , SW_SHOW );
            }
        }
    }

    if(BrowserToolbox)
    {
        std::pair<std::string, bool> res = scenariov8handler->GetIsOpenAction();
        if(res.second)
        {
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_OpenAction(") + picojson::value(res.first).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
        }
    }

    std::pair<std::string, bool> res9 = scenariov8handler->GetIsRunFunctionSeveralThreadsStart();

    if(res9.second && BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_RunFunctionSeveralThreads(") + picojson::value(res9.first).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

    std::pair<std::string, bool> res10 = scenariov8handler->GetIsRunFunctionAsync();

    if(res10.second && BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_RunFunctionAsync(") + picojson::value(res10.first).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

    ScenarioV8Handler::RestartType res3 = scenariov8handler->GetNeedRestart();

    if(res3 == ScenarioV8Handler::Restart)
        Restart();
    else if(res3 == ScenarioV8Handler::Stop)
        Terminate();

}

void MainApp::HandleToolboxBrowserEvents()
{
    if(toolboxv8handler->GetClearHighlight())
    {
        HighlightMultiloginSelector.clear();
        {
            LOCK_BROWSER_DATA
            Data->_Highlight.highlights.clear();
        }
        LastHighlightSelector.clear();

        if(HighlightFrameId<0)
        {

            _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_SetHighlightElements)([]);"),"main"),"", 0);
        }else
        {

            CefRefPtr<CefFrame> Frame = _HandlersManager->GetBrowser()->GetFrame(HighlightFrameId);
            if(Frame.get())
                Frame->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_SetHighlightElements)([]);"),"main"),"", 0);
        }
    }


    std::pair<std::string,bool> InterfaceJson = toolboxv8handler->GetInterfaceState();
    if(InterfaceJson.second)
    {
        try
        {
            std::ofstream outfile("interface.json");
            if(outfile.is_open())
            {
                outfile<<InterfaceJson.first<<std::endl;
                }
        }catch(...)
        {
        }
    }


    std::pair<ToolboxV8Handler::ResultClass,bool> res = toolboxv8handler->GetResult();

    if(res.second)
    {
        if(BrowserScenario)
        {
            std::string id;
            if(!res.first.Id.empty())
            {
                id = res.first.Id;
            }else
            {
                id += std::to_string( std::rand()%9 + 1);
                for(int i = 0;i<8;i++)
                {
                    id += std::to_string( std::rand()%10 );
                }
            }




            std::string scriptscenario;
            if(Layout->State == MainLayout::Ready)
            {
                if(res.first.Name.length() == 0 || res.first.Name.at(0) != '_')
                {
                    Layout->UpdateState(MainLayout::Hold);
                    std::string CodeSend;
                    if(res.first.HowToExecute != ToolboxV8Handler::OnlyAdd)
                    {
                        CodeSend += std::string("_sa(") + id + std::string(");") + res.first.Code;
                    }
                    CodeSend += std::string(" \n section_end()!");
                    if(BrowserToolbox)
                        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_ShowWaiting(") + picojson::value(CodeSend).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
                    xml_encode(CodeSend);
                    std::string DelayedSendCode = std::string("<WaitCode>") + CodeSend + std::string("</WaitCode>");
                    if(res.first.HowToExecute == ToolboxV8Handler::OnlyExecute)
                    {
                        SendTextResponce(DelayedSendCode);
                        DelayedSend.clear();
                    }
                    else
                        DelayedSend = DelayedSendCode;

                    scriptscenario += Javascript("BrowserAutomationStudio_RunningTask();","scenario");

                }
            }

            if(res.first.HowToExecute != ToolboxV8Handler::OnlyExecute)
            {
                std::string script = "BrowserAutomationStudio_AddTask(";
                std::string Name;
                /*if(res.first.HowToExecute == ToolboxV8Handler::OnlyAdd && res.first.DisableIfAdd)
                {
                    Name += "_";
                }*/
                Name += res.first.Name;
                script.append(picojson::value(Name).serialize());
                script.append(",");
                script.append(picojson::value(res.first.Code).serialize());
                script.append(",");
                script.append(id);
                script.append(");");
                script = Javascript(script,"scenario");
                WORKER_LOG(std::string("ScenarioExecuteCode<<") + script);
                scriptscenario += script;
            }

            if(!scriptscenario.empty())
                BrowserScenario->GetMainFrame()->ExecuteJavaScript(scriptscenario,BrowserScenario->GetMainFrame()->GetURL(), 0);
        }
    }

    {
        std::pair<ToolboxV8Handler::ExecuteClass, bool> res2 = toolboxv8handler->GetExecuteCode();
        if(res2.second)
        {
            std::string CodeSend = res2.first.Execute;
            WORKER_LOG(std::string("GetExecuteCode<<") + CodeSend);
            xml_encode(CodeSend);
            SendTextResponce(std::string("<WaitCode>") + CodeSend + std::string("</WaitCode>"));

        }
    }
    if(Data->IsRecord)
    {
        std::pair<std::string, bool> res = toolboxv8handler->GetEmbeddedData();
        if(res.second)
        {
            std::string DataSend = res.first;
            xml_encode(DataSend);
            SendTextResponce(std::string("<EmbeddedData>") + DataSend + std::string("</EmbeddedData>"));
        }
    }


    if(toolboxv8handler->GetIsEditCancel())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_EditCancel()"),"scenario");
        WORKER_LOG("BrowserAutomationStudio_EditCancel<<");
        if(BrowserScenario)
            BrowserScenario->GetMainFrame()->ExecuteJavaScript(script,BrowserScenario->GetMainFrame()->GetURL(), 0);
    }

    if(toolboxv8handler->GetIsInterrupt())
    {
        WORKER_LOG("BrowserAutomationStudio_Interrupt<<");
        if(Layout->IsManualControlAction)
        {
            Data->ManualControl = BrowserData::Indirect;
            UpdateManualControl();
        }
        SendTextResponce("<Interrupt></Interrupt>");
    }

    if(toolboxv8handler->GetIsInitialized() && (ResourcesChanged))
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetResources(") + picojson::value(Resources.data()).serialize() + "," + picojson::value(AdditionalResources.data()).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        ResourcesChanged = false;
    }

    if(toolboxv8handler->GetIsInitialized() && !Variables.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetVariables(") + picojson::value(Variables.data()).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        Variables.clear();
    }

    if(toolboxv8handler->GetIsInitialized() && !GlobalVariables.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetGlobalVariables(") + picojson::value(GlobalVariables.data()).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        GlobalVariables.clear();
    }

    if(!IsInterfaceInitialSent && toolboxv8handler->GetIsInitialized())
    {
        std::string InterfaceInitial = ReadAllString("interface.json");
        std::string script = Javascript(std::string("BrowserAutomationStudio_LoadInterfaceState(") + picojson::value(InterfaceInitial).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        IsInterfaceInitialSent = true;
    }

    if(toolboxv8handler->GetIsInitialized() && !Schema.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetSchema(") + picojson::value(Schema).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        Schema.clear();
    }

    if(toolboxv8handler->GetIsInitialized() && !Labels.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetLabels(") + picojson::value(Labels.data()).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        Labels.clear();
    }

    if(toolboxv8handler->GetIsInitialized() && !Functions.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetFunctions(") + picojson::value(Functions.data()).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        Functions.clear();
    }

    if(toolboxv8handler->GetIsInitialized() && !EmbeddedData.empty())
    {
        std::string script = Javascript(std::string("BrowserAutomationStudio_SetEmbeddedData(") + picojson::value(EmbeddedData.data()).serialize() + std::string(",") + picojson::value(Settings->Languages().data()).serialize() + std::string(")"),"toolbox");
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(script,BrowserToolbox->GetMainFrame()->GetURL(), 0);
        EmbeddedData.clear();
    }

    if(toolboxv8handler->GetIsMaximize())
    {
        if(BrowserToolbox)
        {
            Layout->MaximizeToolbox(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_MaximizeCallback()","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

        }
    }

    if(toolboxv8handler->GetIsMinimize())
    {
        if(BrowserToolbox)
        {
            Layout->MinimizeToolbox(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
        }
    }

    {
        std::pair<std::string, bool> res = toolboxv8handler->GetLoadUrl();
        if(res.second)
        {
            WORKER_LOG(std::string("LoadUrlFromUrlBrowser<<") + res.first);
            if(res.first == std::string("settings://settings"))
            {
                LoadSettingsPage();
            }else
            {
                ShellExecute(0, 0, s2ws(res.first).c_str(), 0, 0 , SW_SHOW );
            }
        }
    }

    {
        std::pair<std::string, bool> res = toolboxv8handler->GetEnableModule();
        if(res.second)
        {
            WORKER_LOG(std::string("EnableModule<<") + res.first);
            EnableModule(res.first);
            Restart();
        }
    }

    {
        std::pair<ToolboxV8Handler::MultiSelectStateClass, bool> res = toolboxv8handler->GetMultiselectStateChanged();
        if(res.second)
        {
            LOCK_BROWSER_DATA
            Data->_MultiSelectData.IsDirty = true;
            Data->_MultiSelectData.Clear();
            Data->MultiselectMode = res.first.IsActive;
            if(Data->MultiselectMode)
            {
                if(res.first.Serialized.empty())
                {
                    //New action
                    MultiSelectDataItem Item;
                    Item.IsInclude = true;
                    Item.selector = LastUsedSelector;
                    Item.label = LastUsedLabel;
                    Data->_MultiSelectData.OriginalSelector = LastUsedSelector;
                    Data->_MultiSelectData.Items.push_back(Item);
                }else
                {
                    //Editing old action
                }
                //WORKER_LOG(std::string("MultiselectStateChanged<<") + Data->_Inspect.css);
            }
        }
    }

    if(toolboxv8handler->GetMultiselectReset())
    {
        {
            LOCK_BROWSER_DATA
            Data->_MultiSelectData.Clear();
        }
        UpdateMultiSelect();

        std::string Script = "_BAS_HIDE(BrowserAutomationStudio_MultiSelectData) = []";
        if(HighlightFrameId<0)
        {
            _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript(Script,"main"),"", 0);
        }else
        {
            CefRefPtr<CefFrame> Frame = _HandlersManager->GetBrowser()->GetFrame(HighlightFrameId);
            if(Frame.get())
                Frame->ExecuteJavaScript(Javascript(Script,"main"),"", 0);
        }
    }


}

void MainApp::UpdateScrolls(std::string& data)
{
    std::string str = data;

    std::size_t pos = str.find(",");
    if(pos != std::string::npos)
    {
        std::string part = str.substr(0,pos);
        str = str.substr(pos + 1,str.length() - pos - 1);
        if(ExecuteFrameChain.empty())
            Data->ScrollX = std::stoi(part);
    }

    pos = str.find(",");
    if(pos != std::string::npos)
    {
        std::string part = str.substr(0,pos);
        str = str.substr(pos + 1,str.length() - pos - 1);
        if(ExecuteFrameChain.empty())
            Data->ScrollY = std::stoi(part);
    }
    data = str;
}


void MainApp::HandleFrameFindEvents()
{
    if(RunElementCommandCallbackOnNextTimer != -1)
        return;

    bool success = true;

    if(v8handler->GetFrameFindResultReady())
    {

        std::pair<InspectResult,bool> res = v8handler->GetFrameFindResult();

        if(res.second && !res.first.active && !IsLastCommandNull && ExecuteFrameSearching && LastCommand.CommandName == std::string("exist"))
        {
            IsLastCommandNull = true;
            v8handler->SetResultProcessed();
            std::string data = "0";
            FinishedLastCommand(data);
            return;
        }

        if(res.second && !res.first.active && !IsLastCommandNull && ExecuteFrameSearching && LastCommand.CommandName == std::string("length"))
        {
            IsLastCommandNull = true;
            v8handler->SetResultProcessed();
            std::string data = "0";
            FinishedLastCommand(data);
            return;
        }

        if(res.second && !res.first.active && !IsLastCommandNull && ExecuteFrameSearching && LastCommand.CommandName == std::string("highlight"))
        {
            ClearHighlight();

            HighlightFrameId = -1;
            HighlightOffsetX = 0;
            HighlightOffsetY = 0;


            _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript("_BAS_HIDE(BrowserAutomationStudio_SetHighlightElements)([])","main"),"",0);

            if(BrowserToolbox)
                BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript("BrowserAutomationStudio_SetPathCount(0)","toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

            IsLastCommandNull = true;
            v8handler->SetResultProcessed();
            std::string data = "";
            FinishedLastCommand(data);
            return;
        }

        if(res.second && !res.first.active && !IsLastCommandNull && ExecuteFrameSearching && LastCommand.CommandName == std::string("script"))
        {
            IsLastCommandNull = true;
            v8handler->SetResultProcessed();
            std::string data = "";
            FinishedLastCommand(data);
            return;
        }

        if(res.second && !res.first.active && !IsLastCommandNull && ExecuteFrameSearching && LastCommand.IsNoWait)
        {
            IsLastCommandNull = true;
            v8handler->SetResultProcessed();
            std::string data = "";
            FinishedLastCommand(data);
            return;
        }

        if(res.second && !IsLastCommandNull && ExecuteFrameSearching)
        {
            success = false;
            if(res.first.active)
            {
                if(_HandlersManager->GetBrowser())
                {
                    //WORKER_LOG(std::to_string(res.first.FrameData.is_frame));
                    //WORKER_LOG(std::string(res.first.FrameData.frame_url));
                    //WORKER_LOG(std::string(res.first.FrameData.frame_name));
                    //WORKER_LOG(std::to_string(res.first.FrameData.frame_index));

                    res.first.FrameData.frame_depth = ExecuteFrameChain.size() + 1;
                    res.first.FrameData.parent_frame_id = -1;
                    if(!ExecuteFrameChain.empty())
                        res.first.FrameData.parent_frame_id = ExecuteFrameChain.at(ExecuteFrameChain.size() - 1).FrameData.frame_id;

                    int64 id = _HandlersManager->FindFrameId(res.first.FrameData);
                    res.first.FrameData.frame_id = id;

                    //WORKER_LOG(std::string("IDDDDDDDDDDDDDDDDDD") + std::to_string(id));

                    if(id == -2)
                    {
                        v8handler->ResetFrameFindResult();
                        return;
                    }

                    if(id >= 0)
                    {
                        ExecuteSearchCoordinatesX+=res.first.FrameData.x_with_padding;
                        ExecuteSearchCoordinatesY+=res.first.FrameData.y_with_padding;
                        //WORKER_LOG(std::string("ExecuteSearchCoordinatesX ") + std::to_string(ExecuteSearchCoordinatesX));


                        ExecuteFrameChain.push_back(res.first);
                        LastCommand.Path.erase(LastCommand.Path.begin(),LastCommand.Path.begin() + ExecuteFrameSearchingLength + 1);
                        ElementCommandInternalCallback(LastCommand);
                        success = true;

                    }
                }
            }
        }
    }
    if(!success && !IsLastCommandNull)
    {
        RunElementCommandCallbackOnNextTimer = 100;
    }
}

void MainApp::HandleMainBrowserEvents()
{
    if(v8handler->GetResultReady())
    {
        std::pair<std::string,bool> res = v8handler->GetResult();
        if(res.second && IsLastCommandNull)
        {
            v8handler->SetResultProcessed();
            WORKER_LOG(std::string("CommandNull<<") + LastCommand.CommandName + std::string("<<") + std::to_string(LastCommand.StageId));
        }

        if(res.second && !IsLastCommandNull)
        {
            IsLastCommandNull = true;

            WORKER_LOG(std::string("Command<<") + LastCommand.CommandName + std::string("<<") + std::to_string(LastCommand.StageId) + std::string("<<") + res.first);

            if(res.first == "BAS_NOT_EXISTS" && !LastCommand.IsNoWait)
            {
                RunElementCommandCallbackOnNextTimer = 100;
                //Repeat random point later if element not found
                if(LastCommand.CommandName == std::string("random_point"))
                {
                    IsLastCommandNull = false;
                    v8handler->SetResultProcessed();
                }
            }else if(res.first == "BAS_NOT_EXISTS" && LastCommand.IsNoWait)
            {
                v8handler->SetResultProcessed();
                std::string data;
                xml_encode(data);
                FinishedLastCommand(data);
                WORKER_LOG(std::string("ElementCommandCallback>>"));
            } else if(ExecuteFrameScrollingSwitch)
            {
                UpdateScrolls(res.first);

                WORKER_LOG("Frame Scrolling Done");
                v8handler->SetResultProcessed();
                ElementCommandInternalCallback(LastCommand);
                //RunElementCommandCallbackOnNextTimer = 100;

            }else  if(LastCommand.CommandName == std::string("_mouseclick") || LastCommand.CommandName == std::string("_mouseclickup") || LastCommand.CommandName == std::string("_mouseclickdown"))
            {


                UpdateScrolls(res.first);
                std::size_t pos = res.first.find(",");
                int x = -1, y = -1;
                if(pos != std::string::npos)
                {
                    std::string x_string = res.first.substr(0,pos);
                    std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                    x = std::stoi(x_string);
                    y = std::stoi(y_string);
                }

                if(false/*!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser)*/)
                {
                    IsLastCommandNull = false;
                }else
                {
                    int type = 0;
                    std::string resp;
                    if(LastCommand.CommandName == std::string("_mouseclickup"))
                    {
                        type = 1;
                        resp = "<MouseClickUp></MouseClickUp>";
                    }else if(LastCommand.CommandName == std::string("_mouseclickdown"))
                    {
                        type = 2;
                        resp = "<MouseClickDown></MouseClickDown>";
                    }else
                    {
                        type = 0;
                        resp = "<MouseClick></MouseClick>";
                    }

                    v8handler->SetResultProcessed();
                    BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
                    Data->LastClickIsFromIndirectControl = true;
                    if(type == 0)
                    {
                        //Click up, then click down later
                        DelayClickType = 1;
                        DelayNextClick = clock() + 80 + (rand()) % 40;
                        DelayClickX = x;
                        DelayClickY = y;
                        BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),x,y,GetScrollPosition(),2,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
                    }else
                    {
                        //Signle click, send instantly
                        BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),x,y,GetScrollPosition(),type,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
                        SendTextResponce(resp);
                    }

                }
            }else if(LastCommand.CommandName == std::string("_mousemove"))
            {
                UpdateScrolls(res.first);

                std::size_t pos = res.first.find(",");
                int x = -1, y = -1;
                if(pos != std::string::npos)
                {
                    std::string x_string = res.first.substr(0,pos);
                    std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                    x = std::stoi(x_string);
                    y = std::stoi(y_string);
                }

                if(x < 0)
                {
                    MouseEndX = x;
                }else
                {
                    MouseEndX = x - Data->ScrollX;
                }

                if(y < 0)
                {
                    MouseEndY = y;
                }else
                {
                    MouseEndY = y - Data->ScrollY;
                }


                if(false/*!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser)*/)
                {
                    IsLastCommandNull = false;
                }else
                {
                    v8handler->SetResultProcessed();
                    BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
                    IsMouseMoveSimulation = true;
                    if(Settings->EmulateMouse())
                    {
                        int t1,t2;
                        BrowserEventsEmulator::MouseMove(_HandlersManager->GetBrowser(), IsMouseMoveSimulation, MouseStartX, MouseStartY, MouseEndX, MouseEndY, t1, t2, 0, 0, 0, 0, 0, 0, true, true,Data->IsMousePress,Data->IsDrag, Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
                    }
                }
            }else if(LastCommand.CommandName == std::string("_scroll"))
            {
                UpdateScrolls(res.first);

                /*std::size_t pos = res.first.find(",");
                int x = -1, y = -1;
                if(pos != std::string::npos)
                {
                    std::string x_string = res.first.substr(0,pos);
                    std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                    x = std::stoi(x_string);
                    y = std::stoi(y_string);
                }

                if(!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser))
                {
                    IsLastCommandNull = false;
                }else
                {
                    v8handler->SetResultProcessed();
                    SendTextResponce("<Scroll></Scroll>");
                }*/

                v8handler->SetResultProcessed();
                SendTextResponce("<Scroll></Scroll>");


            }else if(LastCommand.CommandName == std::string("_render"))
            {
                UpdateScrolls(res.first);

                std::size_t pos = res.first.find(",");
                int x = -1, y = -1;
                if(pos != std::string::npos)
                {
                    std::string x_string = res.first.substr(0,pos);
                    std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                    x = std::stoi(x_string);
                    y = std::stoi(y_string);
                }
                x += ExecuteSearchCoordinatesX + Data->ScrollX;
                y += ExecuteSearchCoordinatesY + Data->ScrollY;

                //if(!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser))
                if(false)
                {
                    IsLastCommandNull = false;
                }else
                {
                    WORKER_LOG(std::string("Start Rendering screen>>"));

                    v8handler->SetResultProcessed();
                    RenderX = RenderX - Data->ScrollX;
                    RenderY = RenderY - Data->ScrollY;
                    IsElementRender = false;
                    NeedRenderNextFrame = true;
                    SkipBeforeRenderNextFrame = 10;
                    if(_HandlersManager->GetBrowser())
                        _HandlersManager->GetBrowser()->GetHost()->Invalidate(PET_VIEW);
                }


            }else if(LastCommand.CommandName == std::string("random_point") && LastCommand.StageId == 0)
            {
                UpdateScrolls(res.first);

                v8handler->SetResultProcessed();
                LastCommand.StageId = 1;
                //WORKER_LOG("ExecuteSearchCoordinatesY");
                //WORKER_LOG(std::to_string(ExecuteSearchCoordinatesY));
                //WORKER_LOG(std::to_string(Data->ScrollY));

                std::string get_point;
                if(Settings->EmulateMouse())
                {
                    get_point = std::string("var x=0;for(var i=0;i<10;i++){x+=Math.random()*((rect.right-2-rect.left+1)/10);};x=Math.floor(x)+rect.left+1;if(x>rect.right-1)x=rect.right-1;if(x<rect.left+1)x=rect.left+1;"
                                            "var y=0;for(var i=0;i<10;i++){y+=Math.random()*((rect.bottom-2-rect.top+1)/10);};y=Math.floor(y)+rect.top+1;if(y>rect.bottom-1)y=rect.bottom-1;if(y<rect.top+1)y=rect.top+1;");
                }else
                {
                    get_point = std::string("var x=Math.floor((rect.right + rect.left)/2);"
                                            "var y=Math.floor((rect.bottom + rect.top)/2);");
                }
                std::string script = std::string("{"
                                     "var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");"
                                     "if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;}"
                                     "var items=el.getClientRects();if(items.length == 0){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};"
                                     "var rect=items[Math.floor(Math.random()*items.length)];")
                                     + get_point +
                                     std::string("x+=") + std::to_string(ExecuteSearchCoordinatesX + Data->ScrollX) + std::string(";"
                                     "y+=") + std::to_string(ExecuteSearchCoordinatesY + Data->ScrollY) + std::string(";"
                                     "var res=x+','+y;"
                                     "_BAS_HIDE(browser_automation_studio_result)(res);}");
                script = std::string("(function(){") + script + std::string("})()");
                script = Javascript(script,"main");



                //WORKER_LOG(std::string("EXEC11<<") + script);
                CefRefPtr<CefFrame> Frame;
                if(ExecuteFrameChain.empty())
                    Frame = _HandlersManager->GetBrowser()->GetMainFrame();
                else
                    Frame = _HandlersManager->GetBrowser()->GetFrame(ExecuteFrameChain.at(ExecuteFrameChain.size()-1).FrameData.frame_id);

                Frame->ExecuteJavaScript(script,"",1);

                IsLastCommandNull = false;


            }else if(LastCommand.CommandName == std::string("clarify") && LastCommand.StageId == 0)
            {
                UpdateScrolls(res.first);

                v8handler->SetResultProcessed();
                LastCommand.StageId = 1;
                std::string x = LastCommand.CommandParam1;
                std::string y = LastCommand.CommandParam2;


                std::string get_point;
                if(Settings->EmulateMouse())
                {
                    get_point = std::string("var x=0;for(var i=0;i<10;i++){x+=Math.random()*((rect.right-2-rect.left+1)/10);};x=Math.floor(x)+rect.left+1;if(x>rect.right-1)x=rect.right-1;if(x<rect.left+1)x=rect.left+1;"
                                            "var y=0;for(var i=0;i<10;i++){y+=Math.random()*((rect.bottom-2-rect.top+1)/10);};y=Math.floor(y)+rect.top+1;if(y>rect.bottom-1)y=rect.bottom-1;if(y<rect.top+1)y=rect.top+1;");
                }else
                {
                    get_point = std::string("var x=Math.floor((rect.right + rect.left)/2);"
                                            "var y=Math.floor((rect.bottom + rect.top)/2);");
                }
                std::string script = std::string("{"
                                     "var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");"
                                     "if(!el){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;}"
                                     "var items=el.getClientRects();if(items.length == 0){_BAS_HIDE(browser_automation_studio_result)('BAS_NOT_EXISTS');return;};"
                                     "var len = items.length;"
                                     "for(var i = 0;i<len;i++)"
                                     "{"
                                        "var item = items[i];"
                                        "var x = ") + x + std::string(" - ") + std::to_string(ExecuteSearchCoordinatesX + Data->ScrollX) + std::string(
                                        ";var y = ") + y + std::string(" - ") + std::to_string(ExecuteSearchCoordinatesY + Data->ScrollY) + std::string(
                                        ";if(y >= item.top && y <= item.bottom && x >= item.left && x <= item.right)"
                                        "{"
                                           "_BAS_HIDE(browser_automation_studio_result)('');"
                                           "return;"
                                        "}"
                                     "}"
                                     "var rect=items[Math.floor(Math.random()*items.length)];")
                                     + get_point +
                                     std::string("x+=") + std::to_string(ExecuteSearchCoordinatesX + Data->ScrollX) + std::string(";"
                                     "y+=") + std::to_string(ExecuteSearchCoordinatesY + Data->ScrollY) + std::string(";"
                                     "var res=x+','+y;"
                                     "_BAS_HIDE(browser_automation_studio_result)(res);}");
                script = std::string("(function(){") + script + std::string("})()");
                script = Javascript(script,"main");



                //WORKER_LOG(std::string("EXEC11<<") + script);
                CefRefPtr<CefFrame> Frame;
                if(ExecuteFrameChain.empty())
                    Frame = _HandlersManager->GetBrowser()->GetMainFrame();
                else
                    Frame = _HandlersManager->GetBrowser()->GetFrame(ExecuteFrameChain.at(ExecuteFrameChain.size()-1).FrameData.frame_id);

                Frame->ExecuteJavaScript(script,"",1);

                IsLastCommandNull = false;


            }else if(LastCommand.CommandName == std::string("system_click") || LastCommand.CommandName == std::string("check") || LastCommand.CommandName == std::string("system_click_up") || LastCommand.CommandName == std::string("system_click_down"))
            {
                UpdateScrolls(res.first);

                std::size_t pos = res.first.find(",");
                int x = -1, y = -1;
                if(pos != std::string::npos)
                {
                    std::string x_string = res.first.substr(0,pos);
                    std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                    x = std::stoi(x_string);
                    y = std::stoi(y_string);
                }
                x += ExecuteSearchCoordinatesX + Data->ScrollX;
                y += ExecuteSearchCoordinatesY + Data->ScrollY;

                if(!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser))
                {
                    IsLastCommandNull = false;
                }else
                {
                    v8handler->SetResultProcessed();
                    WORKER_LOG(std::string("system_click>>") + std::to_string(x) + std::string(">>") + std::to_string(y));

                    int type = 0;
                    if(LastCommand.CommandName == std::string("system_click_up"))
                    {
                        type = 1;
                    }else if(LastCommand.CommandName == std::string("system_click_down"))
                    {
                        type = 2;
                    }

                    BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
                    Data->LastClickIsFromIndirectControl = true;
                    if(type == 0)
                    {
                        //Click up, then click down later
                        DelayClickType = 2;
                        DelayNextClick = clock() + 80 + (rand()) % 40;
                        DelayClickX = x;
                        DelayClickY = y;
                        BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),x,y,GetScrollPosition(),2,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
                    }else
                    {
                        //Signle click, send instantly
                        BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),x,y,GetScrollPosition(),type,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
                        FinishedLastCommand("");
                    }

                }
            }else if(LastCommand.CommandName == std::string("render_base64"))
            {
                UpdateScrolls(res.first);

                int left = -1, top = -1, right = -1, bottom = -1, centerx = -1, centery = -1;
                WORKER_LOG(std::string("render_base64<<") + res.first);

                std::string str = res.first;

                std::size_t pos = str.find(",");
                if(pos != std::string::npos)
                {
                    std::string part = str.substr(0,pos);
                    str = str.substr(pos + 1,str.length() - pos - 1);
                    centerx = std::stoi(part);
                }

                pos = str.find(",");
                if(pos != std::string::npos)
                {
                    std::string part = str.substr(0,pos);
                    str = str.substr(pos + 1,str.length() - pos - 1);
                    centery = std::stoi(part);
                }

                pos = str.find(",");
                if(pos != std::string::npos)
                {
                    std::string part = str.substr(0,pos);
                    str = str.substr(pos + 1,str.length() - pos - 1);
                    left = std::stoi(part);
                }

                pos = str.find(",");
                if(pos != std::string::npos)
                {
                    std::string part = str.substr(0,pos);
                    str = str.substr(pos + 1,str.length() - pos - 1);
                    top = std::stoi(part);
                }

                pos = str.find(",");
                if(pos != std::string::npos)
                {
                    std::string part = str.substr(0,pos);
                    str = str.substr(pos + 1,str.length() - pos - 1);
                    right = std::stoi(part);
                }

                bottom = std::stoi(str);

                left += ExecuteSearchCoordinatesX;
                top += ExecuteSearchCoordinatesY;
                right += ExecuteSearchCoordinatesX;
                bottom += ExecuteSearchCoordinatesY;

                /*if(!BrowserEventsEmulator::IsPointOnScreen(left + Data->ScrollX,top + Data->ScrollY,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser)
                    || !BrowserEventsEmulator::IsPointOnScreen(right + Data->ScrollX,bottom + Data->ScrollY,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser)*/
                if(false)
                {
                    IsLastCommandNull = false;
                }else
                {
                    WORKER_LOG("NeedRenderNextFrame");
                    v8handler->SetResultProcessed();
                    RenderX = left;
                    RenderY = top;
                    RenderWidth = right - left;
                    RenderHeight = bottom - top;
                    IsElementRender = true;
                    NeedRenderNextFrame = true;
                    SkipBeforeRenderNextFrame = 10;
                    if(_HandlersManager->GetBrowser())
                        _HandlersManager->GetBrowser()->GetHost()->Invalidate(PET_VIEW);
                }
            }else if(LastCommand.CommandName == std::string("focus"))
            {
                UpdateScrolls(res.first);

                WORKER_LOG(std::string("focus1111<<") + res.first);
                v8handler->SetResultProcessed();
                std::string data = res.first;
                xml_encode(data);
                FinishedLastCommand(data);

            }else if(LastCommand.CommandName == std::string("highlight"))
            {
                v8handler->SetResultProcessed();
                std::string data = res.first;
                if(BrowserToolbox)
                    BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_SetPathCount(") + data + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);

                xml_encode(data);
                FinishedLastCommand(data);
            }else if(LastCommand.CommandName == std::string("move"))
            {
                UpdateScrolls(res.first);
                //WORKER_LOG(res.first);

                std::size_t pos = res.first.find(",");
                int x = -1, y = -1;
                if(pos != std::string::npos)
                {
                    std::string x_string = res.first.substr(0,pos);
                    std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                    x = std::stoi(x_string);
                    y = std::stoi(y_string);
                }
                x += ExecuteSearchCoordinatesX + Data->ScrollX;
                y += ExecuteSearchCoordinatesY + Data->ScrollY;

                if(false/*!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser)*/)
                {
                    //WORKER_LOG("Failed to move");
                    IsLastCommandNull = false;
                }else
                {
                    v8handler->SetResultProcessed();
                    WORKER_LOG(std::string("move>>") + std::to_string(x) + std::string(">>") + std::to_string(y));
                    BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
                    LastCommand.CommandName = "move";
                    LastCommand.CommandParam1 = std::to_string(x);
                    LastCommand.CommandParam2 = std::to_string(y);
                    MouseStartX = Data->CursorX;
                    MouseStartY = Data->CursorY;
                    MouseEndX = x - Data->ScrollX;
                    MouseEndY = y - Data->ScrollY;
                    IsMouseMoveSimulation = true;

                    DoMouseUpOnFinishMove = false;
                    MouseReleaseRadius = 0.0;
                    ScrollTrackingX = 0;
                    ScrollTrackingY = 0;
                    ScrollStopTrackingStart = 0;
                    ScrollStopTracking = 0;
                    DoTrackScroll = false;

                    MouseSpeed = 15.0;
                    MouseGravity = 6.0;
                    MouseDeviation = 2.5;

                    if(Settings->EmulateMouse())
                    {
                        int t1,t2;
                        BrowserEventsEmulator::MouseMove(_HandlersManager->GetBrowser(), IsMouseMoveSimulation, MouseStartX, MouseStartY, MouseEndX, MouseEndY, t1, t2, 0, 0, 0, 0, 0, 0, true,true,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
                    }
                }

            }
            else if(LastCommand.CommandName == std::string("type") || LastCommand.CommandName == std::string("clear") || (LastCommand.CommandName == std::string("set") && LastCommand.StageId == 1 || LastCommand.CommandName == std::string("set_integer") && LastCommand.StageId == 1 || LastCommand.CommandName == std::string("set_random") && LastCommand.StageId == 1))
            {
                UpdateScrolls(res.first);

                WORKER_LOG(std::string("StartTyping<<"));

                if(res.first.length() == 0)
                {
                    //Element not found
                    v8handler->SetResultProcessed();
                    FinishedLastCommand("");
                }else
                {
                    BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
                    std::size_t pos = res.first.find(",");
                    int x = -1, y = -1;
                    if(pos != std::string::npos)
                    {
                        std::string x_string = res.first.substr(0,pos);
                        std::string y_string = res.first.substr(pos + 1,res.first.length() - pos - 1);
                        x = std::stoi(x_string);
                        y = std::stoi(y_string);
                    }
                    x += ExecuteSearchCoordinatesX + Data->ScrollX;
                    y += ExecuteSearchCoordinatesY + Data->ScrollY;

                    if(!BrowserEventsEmulator::IsPointOnScreen(x,y,Data->ScrollX, Data->ScrollY, Data->WidthBrowser, Data->HeightBrowser))
                    {
                        IsLastCommandNull = false;
                    }else
                    {
                        v8handler->SetResultProcessed();
                        TypeTextX = x;
                        TypeTextY = y;
                        TypeTextTaskIsActive = true;
                        TypeTextIsFirstLetter = true;
                        DelayClickType = 3;
                        DelayNextClick = 0;
                        TypeTextState.Clear();
                        ExecuteTypeText();
                    }
                }
            }else if(LastCommand.CommandName == std::string("set") && LastCommand.StageId == 0 || LastCommand.CommandName == std::string("set_integer") && LastCommand.StageId == 0 || LastCommand.CommandName == std::string("set_random") && LastCommand.StageId == 0)
            {
                UpdateScrolls(res.first);
                IsLastCommandNull = false;

                v8handler->SetResultProcessed();
                BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
                TypeText = res.first;
                TypeTextDelay = 30;
                LastCommand.StageId = 1;
                std::string script = Javascript(std::string("(function(){var el = _BAS_HIDE(BrowserAutomationStudio_FindElement)(") + LastCommand.SerializePath() + std::string(");_BAS_HIDE(BrowserAutomationStudio_ScrollToElement)(el)})()"),"main");
                if(!script.empty())
                {
                    WORKER_LOG(std::string("EXEC<<") + script);
                    CefRefPtr<CefFrame> Frame;
                    if(ExecuteFrameChain.empty())
                        Frame = _HandlersManager->GetBrowser()->GetMainFrame();
                    else
                        Frame = _HandlersManager->GetBrowser()->GetFrame(ExecuteFrameChain.at(ExecuteFrameChain.size()-1).FrameData.frame_id);

                    Frame->ExecuteJavaScript(script,"",1);
                }
            }
            else
            {
                v8handler->SetResultProcessed();
                std::string data = res.first;
                xml_encode(data);
                FinishedLastCommand(data);
                WORKER_LOG(std::string("ElementCommandCallback>>"));
            }
        }
    }

    if(Data->IsRecord && v8handler->GetHighlightResultReady())
    {
        std::pair<HighlightResult,bool> res = v8handler->GetHighlightResult();
        if(res.second)
        {
            {
                LOCK_BROWSER_DATA
                Data->_Highlight = res.first;
                for(HighlightResult::rect & r:Data->_Highlight.highlights)
                {
                    r.selector = LastHighlightSelector;
                }
            }
            RECT r = Layout->GetBrowserRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
            InvalidateRect(Data->_MainWindowHandle,&r,false);
        }
    }

    if(v8handler->GetRecaptchaV3RequestReady())
    {
        std::pair<V8Handler::RecaptchaV3Request,bool> res = v8handler->GetRecaptchaV3Request();
        if(res.second)
        {
            if(Data->IsRecord)
            {
                if(BrowserToolbox)
                {
                    std::string ActionName = res.first.ActionName;
                    BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_Notify('recaptchav3',") + picojson::value(ActionName).serialize() + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
                }
            }

            if(!res.first.InspectId.empty())
            {
                xml_encode(res.first.ActionName);
                xml_encode(res.first.SiteKey);
                xml_encode(res.first.Url);
                xml_encode(res.first.ActionName);
                SendTextResponce(
                            std::string("<SolveRecaptchaV3 Id=\"") + res.first.InspectId + std::string("\"") +
                            std::string(" Action=\"") + res.first.ActionName + std::string("\"") +
                            std::string(" SiteKey=\"") + res.first.SiteKey + std::string("\"") +
                            std::string(" Url=\"") + res.first.Url + std::string("\"") +
                            std::string(" ></SolveRecaptchaV3>"));

            }
        }
    }

    if(v8handler->IsChangedMultiSelectPositions())
    {
        std::pair<std::string,bool> res2 = v8handler->GetMultiSelectPositions();
        if(res2.second)
        {
            LOCK_BROWSER_DATA
            Data->_MultiSelectData.UpdatePositions(res2.first);
        }
        RECT r = Layout->GetBrowserRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
        InvalidateRect(Data->_MainWindowHandle,&r,false);
    }

    if(v8handler->IsChangedMultiSelectReport())
    {
        std::pair<std::string,bool> res2 = v8handler->GetMultiSelectReport();
        if(res2.second && BrowserToolbox && Data->MultiselectMode)
        {
            BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_MultiSelectReport(") + res2.first + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
        }
    }

    if(v8handler->IsChangedFrameStructure())
    {
        std::pair<V8Handler::FrameStructure,bool> res = v8handler->GetFrameStructure();
        if(res.second)
        {
            _HandlersManager->SetFrameStructureQuery(res.first.Id,res.first.Result);
        }
    }

    if(v8handler->GetInspectResultReady())
    {

        std::pair<InspectResult,bool> res2 = v8handler->GetInspectResult();
        if(res2.second)
        {
            bool ShowInspectResults = false;
            if(!res2.first.FrameData.is_frame)
            {
                WORKER_LOG(std::string("not a frame"));

                //Not frame set result
                ShowInspectResults = true;
            }else
            {
                if(_HandlersManager->GetBrowser())
                {
                    res2.first.FrameData.frame_depth = InspectFrameChain.size() + 1;

                    WORKER_LOG(std::string("Inspect frame. frame_index<<") + std::to_string(res2.first.FrameData.frame_index) + std::string(" frame_name<<") + std::string(res2.first.FrameData.frame_name)+ std::string(" frame_depth<<") + std::to_string(res2.first.FrameData.frame_depth)+ std::string(" frame_url<<") + std::string(res2.first.FrameData.frame_url) );

                    //It is Frame! Add to chain and inspect next
                    int x = res2.first.FrameData.x_with_padding;
                    int y = res2.first.FrameData.y_with_padding;
                    for(InspectResult chain:InspectFrameChain)
                    {
                        x += chain.FrameData.x_with_padding;
                        y += chain.FrameData.y_with_padding;
                    }


                    res2.first.FrameData.parent_frame_id = -1;
                    if(!InspectFrameChain.empty())
                        res2.first.FrameData.parent_frame_id = InspectFrameChain.at(InspectFrameChain.size() - 1).FrameData.frame_id;
                    int64 ID = _HandlersManager->FindFrameId(res2.first.FrameData);
                    res2.first.FrameData.frame_id = ID;


                    //WORKER_LOG(std::string("IDDDD ") + std::to_string(ID));
                    if(ID == -2)
                    {
                        //Wait more
                        v8handler->ResetInspectResult();
                    }else if(ID < 0)
                    {
                        //Frame not found
                        ShowInspectResults = true;
                    }else
                    {
                        InspectFrameChain.push_back(res2.first);

                        //WORKER_LOG(std::string("BrowserAutomationStudio_InspectElement <<") + std::to_string(InspectX - x) + std::string(" <<") + std::to_string(InspectY - y) );

                        _HandlersManager->GetBrowser()->GetFrame(ID)->ExecuteJavaScript(Javascript(std::string("_BAS_HIDE(BrowserAutomationStudio_InspectElement)(") + std::to_string(InspectX - x) + std::string(",") + std::to_string(InspectY - y) + std::string(",") + std::to_string(InspectPosition) + std::string(")"),"main"),"", 0);
                    }
                }

            }

            if(ShowInspectResults)
            {

                std::string label;
                std::string css;
                std::string css2;
                std::string css3;
                std::string match;
                std::string xpath;
                WORKER_LOG(std::string("End inspect ") +std::to_string(InspectFrameChain.size()) + " " + std::to_string(res2.first.active));

                if(!res2.first.active && InspectFrameChain.size() > 0)
                {
                    res2.first = InspectFrameChain[InspectFrameChain.size() - 1];
                    InspectFrameChain.pop_back();
                }

                for(InspectResult chain:InspectFrameChain)
                {
                    res2.first.x += chain.FrameData.x_with_padding;
                    res2.first.y += chain.FrameData.y_with_padding;
                    label += chain.label + " >FRAME>";
                    css += chain.css + " >FRAME>";
                    css2 += chain.css2 + " >FRAME>";
                    css3 += chain.css3 + " >FRAME>";
                    match += chain.match + ">FRAME>";
                    xpath += chain.xpath + " >FRAME>";
                }
                res2.first.label = label + res2.first.label;
                res2.first.css = css + res2.first.css;
                res2.first.css2 = css2 + res2.first.css2;
                res2.first.css3 = css3 + res2.first.css3;
                res2.first.match = match + res2.first.match;
                res2.first.xpath = xpath + res2.first.xpath;

                {
                    LOCK_BROWSER_DATA
                    Data->_Inspect = res2.first;
                    Data->_MultiSelectData.MouseOverInspectData = res2.first;
                    Data->_MultiSelectData.MouseOverType = MouseOverInspect;
                }

                if(Data->ManualControl == BrowserData::DirectRecord)
                {
                    DirectControl()->SetInspectResult(Data->_Inspect);
                }

                InspectFrameSearching = false;
            }


            RECT r = Layout->GetBrowserRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
            InvalidateRect(Data->_MainWindowHandle,&r,false);
        }
    }

}

std::pair<int,int> MainApp::GetScrollPosition()
{
    std::pair<int,int> res;
    res.first = Data->ScrollX;
    res.second = Data->ScrollY;
    return res;
}


void MainApp::FinishedLastCommand(const std::string& data)
{
    SendTextResponce(std::string("<Element ID=\"") + LastCommand.CommandId + std::string("\"><") + LastCommand.CommandName + std::string(">") + data + std::string("</") + LastCommand.CommandName + ("></Element>"));
}

void MainApp::ExecuteMouseMove()
{
    if(!IsMouseMoveSimulation)
        return;
    if(!_HandlersManager->GetBrowser())
        return;

    int CursorX = Data->CursorX;
    int CursorY = Data->CursorY;

    double MouseSpeedActual = MouseSpeed;
    double MouseDeviationActual = MouseDeviation;

    if(Settings->EmulateMouse())
    {
        BrowserEventsEmulator::MouseMove(_HandlersManager->GetBrowser(), IsMouseMoveSimulation, MouseStartX, MouseStartY, MouseEndX, MouseEndY , CursorX, CursorY, MouseSpeedActual, Data->WidthBrowser, Data->HeightBrowser, MouseGravity, MouseDeviationActual, 0.0f, false, true,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
    }
    else
    {
        BrowserEventsEmulator::MouseMoveLine(_HandlersManager->GetBrowser(), IsMouseMoveSimulation, MouseStartX, MouseStartY, MouseEndX, MouseEndY , CursorX, CursorY, MouseSpeedActual, Data->WidthBrowser, Data->HeightBrowser,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
    }
    Data->CursorX = CursorX;
    Data->CursorY = CursorY;

    RECT r = Layout->GetBrowserRectangle(GetData()->WidthBrowser,GetData()->HeightBrowser,GetData()->WidthAll,GetData()->HeightAll);
    InvalidateRect(Data->_MainWindowHandle,&r,false);

    bool TrackScroll = false;

    if(MouseReleaseRadius > 0.01 && DoMouseUpOnFinishMove)
    {
        //Check if need to release mouse during movement
        float DistanceSquareCurrent = sqrtf((MouseEndX - CursorX) * (MouseEndX - CursorX) + (MouseEndY - CursorY) * (MouseEndY - CursorY));

        if(DistanceSquareCurrent < MouseReleaseRadius)
        {
            IsMouseMoveSimulation = false;

            if(Data->IsTouchScreen && DoTrackScroll)
            {
                TrackScroll = true;
                DoTrackScroll = false;
            }
        }
    }



    if(!IsMouseMoveSimulation)
    {
        if(LastCommand.CommandName == "move")
            FinishedLastCommand("");
        else
        {
            if(DoMouseUpOnFinishMove)
            {
                Data->LastClickIsFromIndirectControl = true;
                BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),Data->CursorX,Data->CursorY,GetScrollPosition(),1,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
            }
            if(TrackScroll)
            {
                ScrollStopTracking = clock();
                ScrollTrackingX = Data->ScrollX;
                ScrollTrackingY = Data->ScrollY;
                ScrollStopTrackingStart = ScrollStopTracking;
            }else
            {
                SendTextResponce("<MouseMove></MouseMove>");
            }

        }
    }
}

void MainApp::ExecuteTypeText()
{
    if(!TypeTextTaskIsActive)
        return;

    clock_t CurrentTime = clock();


    //Finish pressing character

    if(TypeTextState.IsPresingCharacter())
    {
        if(CurrentTime > TypeTextState.PresingKeyNext)
        {
            BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),TypeText,TypeTextState,Data->CursorX,Data->CursorY,Data->IsTouchScreen);
            if(TypeText.length() == 0 && TypeTextState.IsClear())
            {
                //Nothing more to type
                TypeTextTaskIsActive = false;
                FinishedLastCommand("");
            }else
            {
                TypeTextDelayCurrent = TypeTextDelay + (rand()) % ((int)(TypeTextDelay * 1.6)) - (int)(TypeTextDelay * 0.8);
                TypeTextLastTime = CurrentTime;
            }
        }
        return;
    }


    //Do a click before first text input

    if(TypeTextIsFirstLetter && DelayClickType == 3 && DelayNextClick == 0)
    {
        DelayNextClick = clock() + 80 + (rand()) % 40;
        BrowserEventsEmulator::SetFocus(_HandlersManager->GetBrowser());
        BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),TypeTextX,TypeTextY,GetScrollPosition(),2,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
        return;
    }

    if(TypeTextIsFirstLetter && DelayClickType == 3 && DelayNextClick > 0)
    {
        if(CurrentTime < DelayNextClick)
            return;

        BrowserEventsEmulator::MouseClick(_HandlersManager->GetBrowser(),TypeTextX,TypeTextY,GetScrollPosition(),1,Data->IsMousePress,Data->IsDrag,Data->IsTouchScreen,Data->TouchEventId,Data->IsTouchPressedAutomation);
        DelayClickType = 0;
    }



    //Check if there was enough time to do a next click

    if(!TypeTextIsFirstLetter && float( CurrentTime - TypeTextLastTime ) /  CLOCKS_PER_SEC < (float)TypeTextDelayCurrent / 1000.0f)
        return;
    TypeTextLastTime = CurrentTime;



    //Type first letter - type all instantly all delay next key press

    if(TypeTextIsFirstLetter)
    {
        Data->LastClickIsFromIndirectControl = true;
        WORKER_LOG(std::string("TypeTextIsFirstLetter<<") + std::to_string(TypeTextX) + std::string("<<") + std::to_string(TypeTextY));
        TypeTextIsFirstLetter = false;
        if(TypeTextDelay == 0)
        {
            for(int i = 0;i<1000;i++)
            {
                BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),TypeText,TypeTextState,Data->CursorX,Data->CursorY,Data->IsTouchScreen);

                if(TypeText.length() == 0 && TypeTextState.IsClear() && !TypeTextState.IsPresingCharacter())
                {
                    TypeTextTaskIsActive = false;
                    FinishedLastCommand("");
                    return;
                }

                if(i>100 && !TypeTextState.IsPresingCharacter())
                    break;
            }
            return;
        }else
        {
            TypeTextDelayCurrent = TypeTextDelay + (rand()) % ((int)(TypeTextDelay * 1.6)) - (int)(TypeTextDelay * 0.8);
        }
        return;
    }

    //Start typing

    if(TypeTextDelay == 0)
    {
        //Print all letters instantly
        for(int i = 0;i<1000;i++)
        {
            BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),TypeText,TypeTextState,Data->CursorX,Data->CursorY,Data->IsTouchScreen);
            if(TypeText.length() == 0 && TypeTextState.IsClear() && !TypeTextState.IsPresingCharacter())
            {
                TypeTextTaskIsActive = false;
                FinishedLastCommand("");
                return;
            }

            if(i>100 && !TypeTextState.IsPresingCharacter())
                break;
        }
        return;
    }else
    {
        //Print one letter
        BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),TypeText,TypeTextState,Data->CursorX,Data->CursorY,Data->IsTouchScreen);
        TypeTextDelayCurrent = TypeTextDelay + (rand()) % ((int)(TypeTextDelay * 1.6)) - (int)(TypeTextDelay * 0.8);
    }

    //Need to generate key up
    if(TypeTextState.IsPresingCharacter())
    {
        TypeTextState.PresingKeyNext = clock() + 80 + (rand()) % 40;
        return;
    }

    if(TypeText.length() == 0 && TypeTextState.IsClear())
    {
        TypeTextTaskIsActive = false;
        FinishedLastCommand("");
    }
}



void MainApp::ScrollUp()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }
        KeyState TypeTextState;
        std::string KeyText = "<MOUSESCROLLUP>";
        BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),KeyText,TypeTextState,Data->CursorX,Data->CursorY,false);

    }
}
void MainApp::ScrollDown()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        KeyState TypeTextState;
        std::string KeyText = "<MOUSESCROLLDOWN>";

        BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),KeyText,TypeTextState,Data->CursorX,Data->CursorY,false);

    }
}

void MainApp::ScrollUpUp()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        KeyState TypeTextState;
        std::string KeyText = "<HOME>";
        BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),KeyText,TypeTextState,Data->CursorX,Data->CursorY,false);
    }
}
void MainApp::ScrollDownDown()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        KeyState TypeTextState;
        std::string KeyText = "<END>";

        BrowserEventsEmulator::Key(_HandlersManager->GetBrowser(),KeyText,TypeTextState,Data->CursorX,Data->CursorY,false);

    }
}
void MainApp::ScrollLeft()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript("_BAS_HIDE(BrowserAutomationStudio_ScrollLeft)()","main"),"", 0);

    }
}
void MainApp::ScrollRight()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript("_BAS_HIDE(BrowserAutomationStudio_ScrollRight)()","main"),"", 0);

    }
}

void MainApp::ScrollLeftLeft()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript("_BAS_HIDE(BrowserAutomationStudio_ScrollLeftLeft)()","main"),"", 0);

    }

}
void MainApp::ScrollRightRight()
{
    if(_HandlersManager->GetBrowser())
    {
        Layout->HideCentralBrowser();
        {
            LOCK_BROWSER_DATA
            Data->_Inspect.active = false;
        }

        _HandlersManager->GetBrowser()->GetMainFrame()->ExecuteJavaScript(Javascript("_BAS_HIDE(BrowserAutomationStudio_ScrollRightRight)()","main"),"", 0);

    }
}

void MainApp::EmulateClick(int x, int y)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_Click(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::EmulateMove(int x, int y)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_Move(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::EmulateDrag(int x, int y)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_Drag(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::EmulateDrop(int x, int y)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_Drop(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::EmulateMoveAndClick(int x, int y)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_MoveAndClick(") + std::to_string(x) + std::string(",") + std::to_string(y) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::AddTab()
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_AddTab()"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::SelectTab(int i)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_SelectTab(") + std::to_string(i) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::TabInfo()
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_TabInfo()"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}


void MainApp::CloseTab(int i)
{
    if(BrowserToolbox)
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_CloseTab(") + std::to_string(i) + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
}

void MainApp::Terminate()
{
    SendTextResponce("<Terminate/>");
}

void MainApp::Restart()
{
    SendTextResponce("<Restart/>");
}

//Element Subtasks
void MainApp::ExecuteElementFunction(const std::string& FuncName, bool AskIfUseLoopFunction)
{
    if(BrowserToolbox)
    {
        std::string serialize;
        {
            LOCK_BROWSER_DATA
            serialize = Data->_Inspect.Serialize();
        }
        std::string AskIfUseLoopFunctionString = (AskIfUseLoopFunction ? std::string("1") : std::string("0"));
        BrowserToolbox->GetMainFrame()->ExecuteJavaScript(Javascript(std::string("BrowserAutomationStudio_") + FuncName + std::string("(") + serialize + std::string(",") + AskIfUseLoopFunctionString + std::string(")"),"toolbox"),BrowserToolbox->GetMainFrame()->GetURL(), 0);
    }
}

void MainApp::LoadSettingsPage()
{
    if(BrowserCentral)
    {
        BrowserCentral->GetMainFrame()->ExecuteJavaScript("document.body.style.display='none'","file:///html/central/empty.html",0);
        std::string page = std::string("file:///html/central/index_settings.html?d=") + CefURIEncode(Settings->Serialize(),true).ToString();
        BrowserCentral->GetMainFrame()->LoadURL(page);
        Layout->ShowCentralBrowser(true,false);
    }

}

void MainApp::ShowContextMenu(int X, bool IsImageSelect, const std::string & Json)
{
    if(BrowserCentral)
    {
        {
            LOCK_BROWSER_DATA
            LastUsedSelector = Data->_Inspect.css;
            LastUsedLabel = Data->_Inspect.label;
        }
        BrowserCentral->GetMainFrame()->ExecuteJavaScript("document.body.style.display='none'","file:///html/central/empty.html",0);
        std::string page = std::string("file:///html/menu/index.html?is_image_select=") + std::to_string(IsImageSelect) + std::string("&data=") + Json;
        BrowserCentral->GetMainFrame()->LoadURL(page);
        Layout->ShowContextMenu(X, GetData()->WidthBrowser, GetData()->HeightBrowser, GetData()->WidthAll, GetData()->HeightAll, Settings->Zoom());
    }
}

void MainApp::MainContextMenu(POINT& p)
{
    if(_HandlersManager->GetBrowser())
    {
        Data->_BrowserContextMenu.ShowMenu(Data->_MainWindowHandle, p, Data->IsRecord, _HandlersManager->GetBrowser()->CanGoBack(), _HandlersManager->GetBrowser()->CanGoForward());
    }

}

