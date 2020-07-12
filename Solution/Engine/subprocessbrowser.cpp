#include "subprocessbrowser.h"
#include "iprocesscomunicator.h"
#include "subprocesswebelement.h"
#include <QXmlStreamWriter>
#include <QFile>
#include <QProcess>
#include <QDir>
#include <QDirIterator>
#include "every_cpp.h"


namespace BrowserAutomationStudioFramework
{
    SubprocessBrowser::SubprocessBrowser(QObject *parent) :
        IBrowser(parent), Worker(0), NetworkAccessManager(0), NetworkAccessManagerVirtual(0), ProcessComunicator(0), ProcessComunicatorVirtual(0), LastInjectedWorker(0), ManualBrowserControl(false), LastPID(-1), BrowserId(-1), WorkerSettings(0)

    {
    }



    SubprocessBrowser::~SubprocessBrowser()
    {
        ClearLastTunnelFolder();
    }

    void SubprocessBrowser::SetWorkerSettings(IWorkerSettings *WorkerSettings)
    {
        if(this->WorkerSettings)
        {
            this->WorkerSettings->deleteLater();
            this->WorkerSettings = 0;
        }
        this->WorkerSettings = WorkerSettings;
    }

    void SubprocessBrowser::SetPCResourcesSmoothUsage(IPCResourcesSmoothUsage *PCResourcesSmoothUsage)
    {
        this->PCResourcesSmoothUsage = PCResourcesSmoothUsage;
        connect(this,SIGNAL(CheckSystemResourcesBeforeBrowserCreate(int)),PCResourcesSmoothUsage,SLOT(NeedToStartBrowser(int)));
        connect(this,SIGNAL(BrowserStarted(int)),PCResourcesSmoothUsage,SLOT(BrowserStarted(int)));
        connect(PCResourcesSmoothUsage,SIGNAL(CanStartBrowser(int)),this,SLOT(ResourcesCheckedCommon(int)));
    }

    IWorkerSettings * SubprocessBrowser::GetWorkerSettings()
    {
        return WorkerSettings;
    }

    void SubprocessBrowser::MouseClickInstant(int x, int y)
    {

    }

    void SubprocessBrowser::MouseClick(int x, int y, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("MouseClick",QString("%1,%2").arg(QString::number(x)).arg(QString::number(y)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("MouseClick"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(MouseClick()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::MouseClickUp(int x, int y, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("MouseClickUp",QString("%1,%2").arg(QString::number(x)).arg(QString::number(y)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("MouseClickUp"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(MouseClickUp()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::MouseClickDown(int x, int y, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("MouseClickDown",QString("%1,%2").arg(QString::number(x)).arg(QString::number(y)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("MouseClickDown"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(MouseClickDown()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Timezone(int offset, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Timezone",QString("%1").arg(QString::number(offset)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("Timezone"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Timezone()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Geolocation(float latitude, float longitude, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Geolocation",QString("%1;%2").arg(QString::number(latitude)).arg(QString::number(longitude)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("Geolocation"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Geolocation()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::GeolocationObject(const QString& data, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("GeolocationObject",data);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("GeolocationObject"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(GeolocationObject()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::PopupClose(int index, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("PopupClose",QString("%1").arg(QString::number(index)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("PopupClose"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(PopupClose()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::PopupSelect(int index, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("PopupSelect",QString("%1").arg(QString::number(index)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("PopupSelect"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(PopupSelect()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }


    void SubprocessBrowser::PopupCreate(bool is_silent, const QString& url, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeStartElement("PopupCreate");
            xmlWriter.writeAttribute("is_silent", QString::number(is_silent));
            xmlWriter.writeAttribute("url", url);
        xmlWriter.writeEndElement();

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("PopupCreate"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(PopupCreate()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::PopupInfo(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("PopupInfo",QString());

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("PopupInfo"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(PopupInfo()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::MouseMove(int x, int y, const QString& params, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeStartElement("MouseMove");
            xmlWriter.writeAttribute("params", params);
            xmlWriter.writeCharacters(QString("%1,%2").arg(QString::number(x)).arg(QString::number(y)));
        xmlWriter.writeEndElement();

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("MouseMove"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(MouseMove()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Scroll(int x, int y, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Scroll",QString("%1,%2").arg(QString::number(x)).arg(QString::number(y)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("scroll"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Scroll()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Render(int x, int y, int width, int height, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Render",QString("%1,%2,%3,%4").arg(QString::number(x)).arg(QString::number(y)).arg(QString::number(width)).arg(QString::number(height)));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("render"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Render()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::ClearImageData(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("ClearImageData","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("ClearImageData"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(ClearImageData()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::SetImageData(const QString& base64, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SetImageData",base64);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SetImageData"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetImageData()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::FindImage(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("FindImage","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("FindImage"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(FindImage()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::WaitCode(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("WaitCode","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("WaitCode"));
        Worker->GetWaiter()->WaitInfinity(this,SIGNAL(WaitCode()),Worker,SLOT(RunSubScript()));
        if(Worker->GetProcessComunicator())
            Worker->GetProcessComunicator()->Send(WriteString);
    }

    void SubprocessBrowser::StartSection(const QString& Name, int Id, const QString& callback)
    {
        if(Id)
        {
            QString WriteString;
            QXmlStreamWriter xmlWriter(&WriteString);
            xmlWriter.writeTextElement("StartSection",QString("%1").arg(QString::number(Id)));

            Worker->SetScript(callback);
            Worker->SetFailMessage(tr("Timeout during ") + QString("StartSection"));
            Worker->GetWaiter()->WaitInfinity(this,SIGNAL(WaitCode()), Worker,SLOT(RunSubScript()));
            if(Worker->GetProcessComunicator())
                Worker->GetProcessComunicator()->Send(WriteString);
        }else
        {
            Worker->SetScript(callback);
            Worker->RunSubScript();
        }

    }


    void SubprocessBrowser::LoadPage(const QString& url, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Load",url);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("LoadPage ") + url);
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->SetGeneralTimeout(Worker->GetWaiter()->PeekGeneralWait());
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Loaded()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);

    }

    void SubprocessBrowser::LoadPageInstant(const QString& url, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Load",url);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("LoadPageInstant ") + url);
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(LoadedInstant()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);

    }

    void SubprocessBrowser::DebugVariablesResult(const QString& data, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("DebugVariablesResult",data);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("DebugVariablesResult"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(DebugVariablesResult()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicator())
            Worker->GetProcessComunicator()->Send(WriteString);
    }

    void SubprocessBrowser::SendRecaptchaV3List(const QString& action, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("RecaptchaV3List",action);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("RecaptchaV3List"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(RecaptchaV3List()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicator())
            Worker->GetProcessComunicator()->Send(WriteString);
    }

    void SubprocessBrowser::SendRecaptchaV3Result(const QString& id,const QString& result)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeStartElement("RecaptchaV3Result");
            xmlWriter.writeAttribute("Id", id);
            xmlWriter.writeAttribute("Result", result);
        xmlWriter.writeEndElement();

        if(Worker->GetProcessComunicator())
            Worker->GetProcessComunicator()->Send(WriteString);
    }

    bool SubprocessBrowser::HasBrowserProcess()
    {
        return Worker && Worker->GetProcessComunicatorActual() && Worker->GetProcessComunicatorActual()->HasProcess();
    }

    QString SubprocessBrowser::GetBrowserEngine()
    {
        return WorkerSettings->GetBrowserEngine();
    }

    void SubprocessBrowser::SendWorkerSettings(const QString& json, const QString& callback)
    {
        bool NeedRestart;
        bool NeedSend;
        bool NeedToRestartVirtual;
        bool NeedToCloseVirtual;
        WorkerSettings->Change(json, NeedRestart, NeedSend, NeedToRestartVirtual, NeedToCloseVirtual, Worker->GetIsRecord());

        if(!Worker->GetProcessComunicator())
        {
            Worker->SetAsyncResult(0);
            Worker->SetScript(callback);
            Worker->RunSubScript();
            return;
        }

        Worker->GetProcessComunicator()->SetLocation(WorkerSettings->GetWorkerPath());

        Worker->SetAsyncResult(0);

        if(NeedToRestartVirtual || NeedToCloseVirtual)
        {
            if(Worker->GetProcessComunicatorVirtual() && Worker->GetProcessComunicatorVirtual()->HasProcess())
            {
                OnSuspendVirtual();
                Worker->SetAsyncResult(1);
            }
        }

        if(NeedRestart)
        {
            if(Worker->GetProcessComunicator()->HasProcess())
            {
                if(Worker->GetIsRecord())
                {
                    Worker->SetAsyncResult(1);
                    CreateNewBrowser(true,callback);
                }else
                {
                    Worker->SetAsyncResult(2);
                    OnSupend();
                    Worker->SetScript(callback);
                    Worker->RunSubScript();
                }
            }else
            {
                Worker->SetScript(callback);
                Worker->RunSubScript();
            }
        }else if(NeedSend)
        {
            if(Worker->GetProcessComunicator()->HasProcess())
            {
                QString WriteString;
                QXmlStreamWriter xmlWriter(&WriteString);
                xmlWriter.writeStartElement("SendWorkerSettings");
                    xmlWriter.writeAttribute("BrowserEngine", WorkerSettings->GetBrowserEngineVirtual());
                    xmlWriter.writeAttribute("RecordId", RecordId);
                    xmlWriter.writeAttribute("SkipFrames", QString::number(WorkerSettings->GetSkipFrames()));

                    xmlWriter.writeAttribute("ProxyServer", WorkerSettings->GetProxyServer());
                    xmlWriter.writeAttribute("ProxyPort", QString::number(WorkerSettings->GetProxyPort()));
                    xmlWriter.writeAttribute("ProxyIsHttp", QString::number(WorkerSettings->GetProxyIsHttp()));
                    xmlWriter.writeAttribute("ProxyName", WorkerSettings->GetProxyName());
                    xmlWriter.writeAttribute("ProxyPassword", WorkerSettings->GetProxyPassword());
                    xmlWriter.writeAttribute("ProxyTarget", WorkerSettings->GetProxyTarget());
                xmlWriter.writeEndElement();

                Worker->SetScript(callback);
                Worker->SetFailMessage(tr("Timeout during ") + QString("WorkerSettings"));
                Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SendWorkerSettings()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
                if(Worker->GetProcessComunicator())
                    Worker->GetProcessComunicator()->Send(WriteString);
            }else
            {
                Worker->SetScript(callback);
                Worker->RunSubScript();
            }
        }else
        {
            Worker->SetScript(callback);
            Worker->RunSubScript();
        }

        return;

    }

    void SubprocessBrowser::SetOpenFileName(const QString & OpenFileName, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SetOpenFileName",OpenFileName);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("OpenFileName ") + OpenFileName);
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetOpenFileName()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::NavigateBack(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("NavigateBack","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("NavigateBack"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(NavigateBack()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::DisableBrowser(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeStartElement("DisableBrowser");
        xmlWriter.writeEndElement();

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("DisableBrowser"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(DisableBrowser()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }


    void SubprocessBrowser::DragFile(const QString & FileName, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("DragFile",FileName);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("DragFile ") + FileName);
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(DragFile()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::SetStartupScript(const QString& script,const QString& script_id,const QString& target, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeStartElement("SetStartupScript");
            xmlWriter.writeAttribute("target", target);
            xmlWriter.writeAttribute("script_id", script_id);
            xmlWriter.writeCharacters(script);
        xmlWriter.writeEndElement();

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SetStartupScript"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetStartupScript()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::SetFontList(const QString& fonts, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SetFontList",fonts);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SetFontList"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetFontList()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }


    void SubprocessBrowser::SetPromptResult(const QString & Text, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SetPromptResult",Text);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SetPromptResult ") + Text);
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetPromptResult()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::SetHttpAuthResult(const QString & Login, const QString & Password, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SetHttpAuthResult",Login + ":" + Password);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SetHttpAuthResult ") + Login);
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetHttpAuthResult()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::SetUserAgent(const QString& agent, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SetUserAgent",agent);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SetUserAgent"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SetUserAgent()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Resize(int x, int y, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Resize",QString::number(x) + "," + QString::number(y));

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("Resize"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Resize()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }
    void SubprocessBrowser::ResetNoCookies(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("ResetNoCookies","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("ResetNoCookies"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Reset()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()), 60000);
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::StartManualBrowserControl(const QString& message, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("ManualBrowserControl",message);

        Worker->SetScript(callback);
        Worker->GetWaiter()->WaitInfinity(this,SIGNAL(StartManualBrowserControl()), Worker,SLOT(RunSubScript()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }


    void SubprocessBrowser::Reset(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Reset","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("Reset"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Reset()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()), 60000);
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Jquery(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Jquery","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("Jquery"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Jquery()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::OptimizeMemory(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("OptimizeMemory","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("OptimizeMemory"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(OptimizeMemory()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::GetCookiesForUrl(const QString& url, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("GetCookiesForUrl",url);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("GetCookiesForUrl ") + url);
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(GetCookiesForUrl()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::SaveCookies(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("SaveCookies", "");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("SaveCookies"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(SaveCookies()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::RestoreCookies(const QString& cookies, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("RestoreCookies", cookies);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("RestoreCookies"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(RestoreCookies()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::RestoreLocalStorage(const QString& localstorage, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("RestoreLocalStorage", localstorage);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("RestoreLocalStorage"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(RestoreLocalStorage()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }


    IWebElement* SubprocessBrowser::GetRootElement()
    {
         SubprocessWebElement *el = new SubprocessWebElement();
         connect(Worker->GetProcessComunicatorActual(),SIGNAL(Received(QString)),el,SLOT(Received(QString)));
         return el;
    }
    void SubprocessBrowser::GetUrl(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("GetUrl","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("GetUrl"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(GetUrl()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::RemoveOnlineProfile(const QString& ProfileId, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("RemoveOnlineProfile",ProfileId);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("RemoveOnlineProfile"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(RemoveOnlineProfile()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }
    void SubprocessBrowser::RemoveLocalProfile(const QString& ProfileId, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("RemoveLocalProfile",ProfileId);

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("RemoveLocalProfile"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(RemoveLocalProfile()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::FindAllOnlineProfiles(const QString& SearchPattern, const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeStartElement("FindAllOnlineProfiles");
        xmlWriter.writeAttribute("SearchPattern",SearchPattern);
        xmlWriter.writeEndElement();


        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("FindAllOnlineProfiles"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(FindAllOnlineProfiles()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }

    void SubprocessBrowser::Received(const QString& value)
    {

        QXmlStreamReader xmlReader(value);
        while(!xmlReader.atEnd() && !xmlReader.hasError())
        {
            if(!Worker)
                return;

            QXmlStreamReader::TokenType token = xmlReader.readNext();

            if(xmlReader.name() == "Load" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString().toInt() == 0));
                emit Loaded();
            }else if(xmlReader.name() == "GetUrl" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit GetUrl();
            }else if(xmlReader.name() == "SetUserAgent" && token == QXmlStreamReader::StartElement)
            {
                emit SetUserAgent();
            }else if(xmlReader.name() == "SetOpenFileName" && token == QXmlStreamReader::StartElement)
            {
                emit SetOpenFileName();
            }else if(xmlReader.name() == "NavigateBack" && token == QXmlStreamReader::StartElement)
            {
                emit NavigateBack();
            }else if(xmlReader.name() == "DisableBrowser" && token == QXmlStreamReader::StartElement)
            {
                OnSupend();
                emit DisableBrowser();
            }else if(xmlReader.name() == "DragFile" && token == QXmlStreamReader::StartElement)
            {
                emit DragFile();
            }else if(xmlReader.name() == "ManualBrowserControl" && token == QXmlStreamReader::StartElement)
            {
                emit StartManualBrowserControl();
            }else if(xmlReader.name() == "SetStartupScript" && token == QXmlStreamReader::StartElement)
            {
                emit SetStartupScript();
            }
            else if(xmlReader.name() == "SetFontList" && token == QXmlStreamReader::StartElement)
            {
                emit SetFontList();
            }
            else if(xmlReader.name() == "SetPromptResult" && token == QXmlStreamReader::StartElement)
            {
                emit SetPromptResult();
            }
            else if(xmlReader.name() == "SetHttpAuthResult" && token == QXmlStreamReader::StartElement)
            {
                emit SetHttpAuthResult();
            }
            else if(xmlReader.name() == "GetCookiesForUrl" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit GetCookiesForUrl();
            }else if(xmlReader.name() == "SaveCookies" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit SaveCookies();
            }else if(xmlReader.name() == "RestoreCookies" && token == QXmlStreamReader::StartElement)
            {
                emit RestoreCookies();
            }else if(xmlReader.name() == "RestoreLocalStorage" && token == QXmlStreamReader::StartElement)
            {
                emit RestoreLocalStorage();
            }else if(xmlReader.name() == "MouseClick" && token == QXmlStreamReader::StartElement)
            {
                emit MouseClick();
            }else if(xmlReader.name() == "MouseClickUp" && token == QXmlStreamReader::StartElement)
            {
                emit MouseClickUp();
            }else if(xmlReader.name() == "MouseClickDown" && token == QXmlStreamReader::StartElement)
            {
                emit MouseClickDown();
            }else if(xmlReader.name() == "LoadedInstant" && token == QXmlStreamReader::StartElement)
            {
                emit LoadedInstant();
            }else if(xmlReader.name() == "Timezone" && token == QXmlStreamReader::StartElement)
            {
                emit Timezone();
            }else if(xmlReader.name() == "Geolocation" && token == QXmlStreamReader::StartElement)
            {
                emit Geolocation();
            }else if(xmlReader.name() == "GeolocationObject" && token == QXmlStreamReader::StartElement)
            {
                emit GeolocationObject();
            }else if(xmlReader.name() == "MouseMove" && token == QXmlStreamReader::StartElement)
            {
                emit MouseMove();
            }else if(xmlReader.name() == "Resize" && token == QXmlStreamReader::StartElement)
            {
                emit Resize();
            }else if(xmlReader.name() == "Reset" && token == QXmlStreamReader::StartElement)
            {
                emit Reset();
            }else if(xmlReader.name() == "Render" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit Render();
            }else if(xmlReader.name() == "Scroll" && token == QXmlStreamReader::StartElement)
            {
                emit Scroll();
            }else if(xmlReader.name() == "Jquery" && token == QXmlStreamReader::StartElement)
            {
                emit Jquery();
            }else if(xmlReader.name() == "DebugVariablesResult" && token == QXmlStreamReader::StartElement)
            {
                emit DebugVariablesResult();
            }else if(xmlReader.name() == "RecaptchaV3List" && token == QXmlStreamReader::StartElement)
            {
                emit RecaptchaV3List();
            }else if(xmlReader.name() == "SendWorkerSettings" && token == QXmlStreamReader::StartElement)
            {
                emit SendWorkerSettings();
            }
            else if(xmlReader.name() == "OptimizeMemory" && token == QXmlStreamReader::StartElement)
            {
                emit OptimizeMemory();
            }
            else if(xmlReader.name() == "ClearImageData" && token == QXmlStreamReader::StartElement)
            {
                emit OptimizeMemory();
            }
            else if(xmlReader.name() == "SetImageData" && token == QXmlStreamReader::StartElement)
            {
                emit SetImageData();
            }
            else if(xmlReader.name() == "FindImage" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit FindImage();
            }
            else if(xmlReader.name() == "PopupClose" && token == QXmlStreamReader::StartElement)
            {
                emit PopupClose();
            }
            else if(xmlReader.name() == "PopupSelect" && token == QXmlStreamReader::StartElement)
            {
                emit PopupSelect();
            }else if(xmlReader.name() == "PopupCreate" && token == QXmlStreamReader::StartElement)
            {
                emit PopupCreate();
            }else if(xmlReader.name() == "PopupInfo" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit PopupInfo();
            }else if(xmlReader.name() == "RemoveOnlineProfile" && token == QXmlStreamReader::StartElement)
            {
                emit RemoveOnlineProfile();
            }else if(xmlReader.name() == "RemoveLocalProfile" && token == QXmlStreamReader::StartElement)
            {
                emit RemoveLocalProfile();
            }else if(xmlReader.name() == "FindAllOnlineProfiles" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                Worker->SetAsyncResult(QScriptValue(xmlReader.text().toString()));
                emit FindAllOnlineProfiles();
            }else if(xmlReader.name() == "SolveRecaptchaV3" && token == QXmlStreamReader::StartElement)
            {
                QString Id;
                QString SiteKey;
                QString Action;
                QString Url;
                for(QXmlStreamAttribute attr: xmlReader.attributes())
                {
                    if(attr.name() == "Id")
                    {
                        Id = attr.value().toString();
                    }
                    if(attr.name() == "SiteKey")
                    {
                        SiteKey = attr.value().toString();
                    }
                    if(attr.name() == "Action")
                    {
                        Action = attr.value().toString();
                    }
                    if(attr.name() == "Url")
                    {
                        Url = attr.value().toString();
                    }
                }
                Worker->SolveRecaptchaV3(Id,Action,SiteKey,Url);
            }
            else if(xmlReader.name() == "WaitCode" && token == QXmlStreamReader::StartElement)
            {
                xmlReader.readNext();
                QString code = xmlReader.text().toString();
                NextAction.clear();
                QRegExp Regexp("section\\_start\\(\\s*\\\"[^\\\"]*\\\"\\s*\\,\\s*(\\-?\\d*)\\)\\!");
                if(Regexp.indexIn(code, 0)>=0)
                    NextAction = Regexp.cap(1);
                QString Script = Worker->GetPreprocessor()->Preprocess(QString(" { ") + code + QString(" } "),0,false);
                Worker->SetScript(Script);
                emit WaitCode();
            }
        }
        if (xmlReader.hasError())
        {
            return;
        }
    }

    void SubprocessBrowser::OnSupend()
    {
        if(Worker && Worker->GetProcessComunicator())
        {
            Worker->GetProcessComunicator()->Suspend();
            Worker->GetProcessComunicator()->disconnect();
            Worker->GetProcessComunicator()->deleteLater();

        }else if(ProcessComunicator)
        {
            ProcessComunicator->Suspend();
            ProcessComunicator->disconnect();
            ProcessComunicator->deleteLater();
        }
        ProcessComunicator = 0;
        NetworkAccessManager = 0;

        if(Worker)
        {
            Worker->SetProcessComunicator(0);
        }
    }

    void SubprocessBrowser::OnSuspendVirtual()
    {
        if(Worker && Worker->GetProcessComunicatorVirtual())
        {
            Worker->GetProcessComunicatorVirtual()->Suspend();
            Worker->GetProcessComunicatorVirtual()->disconnect();
            Worker->GetProcessComunicatorVirtual()->deleteLater();

        }else if(ProcessComunicatorVirtual)
        {
            ProcessComunicatorVirtual->Suspend();
            ProcessComunicatorVirtual->disconnect();
            ProcessComunicatorVirtual->deleteLater();
        }
        ProcessComunicatorVirtual = 0;
        NetworkAccessManagerVirtual = 0;

        if(Worker)
        {
            Worker->SetProcessComunicatorVirtual(0);
        }
    }

    void SubprocessBrowser::WorkerStopped()
    {
        OnSupend();

        if(Worker)
        {
            Worker->FailProcessFinished();
        }
    }

    void SubprocessBrowser::MarkBeforeReset()
    {
        if(ProcessComunicator)
        {
            ProcessComunicator->setProperty("mbr",QVariant(true));
        }
    }

    void SubprocessBrowser::MarkAfterReset()
    {
        if(ProcessComunicator)
        {
            ProcessComunicator->setProperty("mbr",QVariant(false));
        }
    }

    void SubprocessBrowser::SetManualBrowserControl()
    {
        ManualBrowserControl = true;
    }

    bool SubprocessBrowser::GetManualBrowserControl()
    {
        return ManualBrowserControl;
    }


    void SubprocessBrowser::SetLanguage(const QString& Language)
    {
        this->Language = Language;
    }

    void SubprocessBrowser::SetRecordId(const QString& RecordId)
    {
        this->RecordId = RecordId;
    }


    void SubprocessBrowser::CloseBrowser()
    {
        if(Worker && Worker->GetProcessComunicator())
        {
            Worker->GetProcessComunicator()->Abort();
            Worker->GetProcessComunicator()->setProperty("empty",true);
        }
    }

    void SubprocessBrowser::CloseVirtualBrowser()
    {
        OnSuspendVirtual();
    }

    void SubprocessBrowser::ResetSettings()
    {
        WorkerSettings->Clear();
    }

    QString SubprocessBrowser::GetBrowserUniqueId()
    {
        if(!WorkerSettings)
            return QString();

        return WorkerSettings->GetUniqueProcessId();
    }


    void SubprocessBrowser::ResetProxy()
    {
        WorkerSettings->SetProxyServer(QString());
        WorkerSettings->SetProxyPort(0);
        WorkerSettings->SetProxyIsHttp(true);
        WorkerSettings->SetProxyName(QString());
        WorkerSettings->SetProxyPassword(QString());
    }

    bool SubprocessBrowser::IsBASBrowser()
    {
        return WorkerSettings->GetBrowserEngine() == QString("BASChrome");
    }
    bool SubprocessBrowser::IsBASBrowserVirtual()
    {
        return WorkerSettings->GetBrowserEngineVirtual() == QString("BASChrome");
    }
    bool SubprocessBrowser::NeedToCreateVirtualProcessCommunicator()
    {
        if(!Worker)
            return false;
        return Worker->GetIsRecord() && !IsBASBrowserVirtual() && IsBASBrowser() && !ProcessComunicatorVirtual;
    }


    QString SubprocessBrowser::GetProfilePath()
    {
        QString res;
        if(Worker->GetProcessComunicatorActual())
        {
            res = Worker->GetProcessComunicatorActual()->GetProfileId();
        }
        if(!res.isEmpty())
        {
            return res;
        }
        return WorkerSettings->GetProfile();
    }

    void SubprocessBrowser::ClearLastTunnelFolder()
    {
        if(LastPID>0)
        {
            QString OldConfigDir = QDir(QString("t") + QDir::separator() + QString::number(LastPID)).absolutePath();
            QDir(OldConfigDir).removeRecursively();
            LastPID = -1;
        }
    }

    void SubprocessBrowser::StartTunnel()
    {
        if(!Worker)
            return;
        if(!Worker->GetProcessComunicator())
            return;

        if(Worker->GetProcessComunicator()->IsFail())
        {
            Worker->SetAsyncFailMessage(Worker->GetProcessComunicator()->FailString());
            Worker->RunSubScript();
            return;
        }

        if(Worker->GetProcessComunicator()->IsDie())
        {
            Worker->SetAsyncDieMessage(Worker->GetProcessComunicator()->DieString());
            Worker->RunSubScript();
            return;
        }

        if(BrowserId >= 0)
        {
            emit BrowserStarted(BrowserId);
            BrowserId = -1;
        }

        if(!Worker->GetProcessComunicator()->GetPID())
        {
            Worker->RunSubScript();
            return;
        }

        ClearLastTunnelFolder();

        if(!WorkerSettings->GetProxyTunneling())
        {
            Worker->RunSubScript();
            return;
        }
        QString pid = QString::number(Worker->GetProcessComunicator()->GetPID());

        /*QProcess * Tunnel = new QProcess(this);
        connect(Tunnel,SIGNAL(finished(int)),Tunnel,SLOT(deleteLater()));
        connect(Tunnel,SIGNAL(finished(int)),Worker,SLOT(RunSubScript()));
        QDir Current(".");
        QString SetProxyExe = Current.absoluteFilePath("SetProxy.exe");
        QStringList Params;
        Params.append(QString::number(0));
        Params.append(pid);
        Params.append(Current.absoluteFilePath("Proxy.dll"));
        QString WorkingDir = Current.absolutePath();*/
        QString ConfigDir = QDir(QString("t") + QDir::separator() + pid).absolutePath();
        QDir Config(ConfigDir);

        QDirIterator it(ConfigDir, QStringList() << "*.*", QDir::Files, QDirIterator::Subdirectories);
        while (it.hasNext())
            QFile(it.next()).remove();

        Config.mkpath(".");

        {
            QFile file(Config.absoluteFilePath("s"));
            file.open(QIODevice::WriteOnly);
            file.write("\x4d\x43\x23\x23\x01\x01\x01\x01\x73\x6f\x63\x6b\x73\x63\x61\x70\x36\x34\x2e\x63\x6f\x6d\x23\xa5\x68\xe4\xb4\x0d\xb4\x06\xfd\x29\xdb\x14\x9b\xe3\x56\x3b\xb1\x29\x00\x00\x00\x9f\x1d\x56\x48\xcf\x61\x27\xd7\xfc\x8d\x18\x4e\x89\xfd\x2e\x59\x72\x11\x95\xa4\x89\xcb\x7f\xe6\xc4\x44\x06\xd8\xf8\xc2\xd1\x8a\xd6\x18\xb7\x8f\xdb\xda\x48\x41\xd7\x23\x4d\x43\x00",88);
            file.close();
        }

        /*Tunnel->setProgram(SetProxyExe);
        Tunnel->setArguments(Params);
        Tunnel->setWorkingDirectory(WorkingDir);*/
        LastPID = Worker->GetProcessComunicator()->GetPID();
        //Tunnel->start();

        Worker->RunSubScript();

    }

    void SubprocessBrowser::AfterVirtualBrowserCreated()
    {
        if(!Worker)
            return;
        if(!Worker->GetProcessComunicatorVirtual())
            return;

        if(Worker->GetProcessComunicatorVirtual()->IsFail())
        {
            Worker->SetAsyncFailMessage(Worker->GetProcessComunicatorVirtual()->FailString());
            Worker->RunSubScript();
            return;
        }

        if(Worker->GetProcessComunicatorVirtual()->IsDie())
        {
            Worker->SetAsyncDieMessage(Worker->GetProcessComunicatorVirtual()->DieString());
            Worker->RunSubScript();
            return;
        }

        Worker->RunSubScript();
    }

    void SubprocessBrowser::AfterResourcesChecked()
    {
        Worker->GetWaiter()->WaitForSignal(Worker->GetProcessComunicator(),SIGNAL(ProcessStarted()),this,SLOT(StartTunnel()), Worker, SLOT(FailBecauseOfTimeout()), 60000);

        QStringList arg;
        arg += WorkerSettings->GetCommandLineParameters(Language, false);
        Worker->GetProcessComunicator()->SetRecord(Worker->GetIsRecord());
        Worker->GetProcessComunicator()->CreateProcess(arg);
        if(!NextAction.isEmpty())
        {
            Worker->GetProcessComunicator()->Send(QString("<SetNextAction>") + NextAction + QString("</SetNextAction>"));
        }
        emit ProcessCreated(ProcessComunicator);
    }

    void SubprocessBrowser::ResourcesCheckedCommon(int BrowserId)
    {
        if(this->BrowserId == BrowserId)
        {
            emit ResourcesCheckedThis();
        }
    }

    void SubprocessBrowser::CreateNewVirtualBrowser(bool ForseNewBrowserCreation,const QString& callback)
    {
        if(ForseNewBrowserCreation || !ProcessComunicatorVirtual)
        {
            OnSuspendVirtual();

            ProcessComunicatorVirtual = ProcessComunicatorFactory->CreateProcessComunicator(WorkerSettings->GetBrowserEngineVirtual());
            ProcessComunicatorVirtual->setParent(this);
            ProcessComunicatorVirtual->SetLocation(WorkerSettings->GetWorkerPath());

            if(Worker)
                Worker->SetProcessComunicatorVirtual(ProcessComunicatorVirtual);


            NetworkAccessManagerVirtual = NetworkAccessManagerFactory->CreateNetworkAccessManager();
            connect(ProcessComunicatorVirtual,SIGNAL(Received(QString)),NetworkAccessManagerVirtual,SLOT(Received(QString)));
            NetworkAccessManagerVirtual->setParent(ProcessComunicatorVirtual);

            connect(ProcessComunicatorVirtual,SIGNAL(Received(QString)),this,SLOT(Received(QString)));
            Worker->SetFailMessage(QString("Timeout during creating new process"));
            Worker->SetScript(callback);
            Worker->GetWaiter()->WaitForSignal(ProcessComunicatorVirtual,SIGNAL(ProcessStarted()),this,SLOT(AfterVirtualBrowserCreated()), Worker, SLOT(FailBecauseOfTimeout()), 60000);

            QStringList arg;

            arg += WorkerSettings->GetCommandLineParameters(Language, true);
            ProcessComunicatorVirtual->SetRecord(Worker->GetIsRecord());
            ProcessComunicatorVirtual->CreateProcess(arg);
        }else
        {
            Worker->SetScript(callback);
            Worker->RunSubScript();
        }
    }


    void SubprocessBrowser::CreateNewBrowser(bool ForseNewBrowserCreation, const QString& callback)
    {
        {
            QFile settings("settings_worker.ini");
            if (settings.open(QFile::ReadOnly | QFile::Text))
            {
                QTextStream in(&settings);
                QString file_string = in.readAll();

                if(file_string.contains("Restart=true"))
                    ForseNewBrowserCreation = true;
                qDebug()<<file_string<<ForseNewBrowserCreation;
            }
            settings.close();
        }

        bool CreateNewBrowser = ForseNewBrowserCreation || !ProcessComunicator || ProcessComunicator->property("empty").toBool();
        if(LastInjectedWorker == Worker && !CreateNewBrowser)
        {
            Worker->SetScript(callback);
            Worker->RunSubScript();
            return;
        }

        LastInjectedWorker = Worker;
        int NumberUsed = 0;
        if(ProcessComunicator)
        {
            QVariant NumberUsedVariant = ProcessComunicator->property("used");
            if(NumberUsedVariant.isValid() && !NumberUsedVariant.isNull())
                NumberUsed = NumberUsedVariant.toInt();
            if(NumberUsed<0)
                NumberUsed = 0;

            NumberUsed++;

            ProcessComunicator->setProperty("used",QVariant(NumberUsed));
            QVariant mbr = ProcessComunicator->property("mbr");
            if(!mbr.isNull() && mbr.isValid() && mbr.toBool())
            {
                NumberUsed = 1000;
            }
        }

        //Create process first time
        if(CreateNewBrowser || NumberUsed > 10)
        {
            OnSupend();
            Worker->SetProcessComunicator(ProcessComunicatorFactory->CreateProcessComunicator(WorkerSettings->GetBrowserEngine()));
            ProcessComunicator = Worker->GetProcessComunicator();
            Worker->GetProcessComunicator()->setParent(this);
            Worker->GetProcessComunicator()->SetLocation(WorkerSettings->GetWorkerPath());


            NetworkAccessManager = NetworkAccessManagerFactory->CreateNetworkAccessManager();
            connect(Worker->GetProcessComunicator(),SIGNAL(Received(QString)),NetworkAccessManager,SLOT(Received(QString)));
            NetworkAccessManager->setParent(Worker->GetProcessComunicator());

            //connect(Worker->GetProcessComunicator(),SIGNAL(ProcessFinished()),this,SLOT(WorkerStopped()));
            //connect(Worker->GetProcessComunicator(),SIGNAL(Error()),this,SLOT(WorkerStopped()));

            connect(Worker->GetProcessComunicator(),SIGNAL(Received(QString)),this,SLOT(Received(QString)));
            Worker->SetFailMessage(QString("Timeout during creating new process"));
            Worker->SetScript(callback);
            BrowserId = qrand() % 100000;
            if(Worker->GetIsRecord())
            {
                AfterResourcesChecked();
            }else
            {
                Worker->GetWaiter()->WaitInfinity(this,SIGNAL(ResourcesCheckedThis()),this,SLOT(AfterResourcesChecked()));
                emit CheckSystemResourcesBeforeBrowserCreate(BrowserId);
            }
        }
        //Use existing process
        else
        {
            Worker->SetProcessComunicator(ProcessComunicator);


            disconnect(Worker->GetProcessComunicator(),SIGNAL(Received(QString)),0,0);

            connect(Worker->GetProcessComunicator(),SIGNAL(Received(QString)),this,SLOT(Received(QString)));
            connect(Worker->GetProcessComunicator(),SIGNAL(Received(QString)),NetworkAccessManager,SLOT(Received(QString)));
            
            Worker->SetScript(callback);
            Worker->RunSubScript();
        }
    }
    INetworkAccessManager* SubprocessBrowser::GetNetworkAccessManager()
    {
        return NetworkAccessManager;
    }
    INetworkAccessManager* SubprocessBrowser::GetNetworkAccessManagerVirtual()
    {
        return NetworkAccessManagerVirtual;
    }
    void SubprocessBrowser::SetScriptResources(IScriptResources* ScriptResources)
    {

    }
    IScriptResources* SubprocessBrowser::GetScriptResources()
    {
        return 0;
    }
    void SubprocessBrowser::SetWorker(IWorker* Worker)
    {
        this->Worker = Worker;
    }


    IWorker* SubprocessBrowser::GetWorker()
    {
        return Worker;
    }
    void SubprocessBrowser::SetNetworkAccessManagerFactory(INetworkAccessManagerFactory *NetworkAccessManagerFactory)
    {
        this->NetworkAccessManagerFactory = NetworkAccessManagerFactory;
    }

    void SubprocessBrowser::SetProcessComunicatorFactory(IProcessComunicatorFactory *ProcessComunicatorFactory)
    {
        this->ProcessComunicatorFactory = ProcessComunicatorFactory;
    }

    void SubprocessBrowser::SimulateCrush(const QString& callback)
    {
        QString WriteString;
        QXmlStreamWriter xmlWriter(&WriteString);
        xmlWriter.writeTextElement("Crush","");

        Worker->SetScript(callback);
        Worker->SetFailMessage(tr("Timeout during ") + QString("Crush"));
        Worker->GetWaiter()->WaitForSignal(this,SIGNAL(Crush()), Worker,SLOT(RunSubScript()), Worker, SLOT(FailBecauseOfTimeout()));
        if(Worker->GetProcessComunicatorActual())
            Worker->GetProcessComunicatorActual()->Send(WriteString);
    }
}
