#include "workersettings.h"
#include <QJsonDocument>
#include <QJsonParseError>
#include <QJsonObject>
#include <QDir>
#include <QDirIterator>
#include "every_cpp.h"

namespace BrowserAutomationStudioFramework
{

    const static int TIMEZONE_NONE = 99999;
    WorkerSettings::WorkerSettings(QObject *parent) :
        IWorkerSettings(parent)
    {
        Clear();
        BrowserEngine = "BASChrome";
        BrowserEngineVirtual = "BASChrome";
    }

    QString WorkerSettings::GetUniqueProcessId()
    {
        return UniqueProcessId;
    }

    void WorkerSettings::Clear()
    {
        Webrtc = "disable";
        Canvas = "disable";
        Audio = "disable";
        UseFlash = false;
        Webgl = "disable";
        ProxyTunneling = true;
        SkipFrames = 1;
        ProxyPort = 0;
        ProxyIsHttp = true;
        ProxyServer.clear();
        ProxyName.clear();
        ProxyPassword.clear();
        ProxyTarget.clear();
        Profile.clear();
        Extensions.clear();
        Timezone = TIMEZONE_NONE;
        TimezoneName = "BAS_NOT_SET";

        //Settings.clear();
        Settings = SettingsPreserved;
    }

    QString WorkerSettings::Get(const QString& Key)
    {
        if(!Settings.contains(Key))
            return QString();
        return Settings[Key];
    }

    void WorkerSettings::Set(const QString& Key,const QString& Value)
    {
        Settings[Key] = Value;
    }

    QStringList WorkerSettings::Keys()
    {
        return Settings.keys();
    }

    void WorkerSettings::SetTimezone(int Timezone)
    {
        this->Timezone = Timezone;
    }

    int WorkerSettings::GetTimezone()
    {
        return Timezone;
    }

    void WorkerSettings::SetTimezoneName(const QString& TimezoneName)
    {
        this->TimezoneName = TimezoneName;
    }

    QString WorkerSettings::GetTimezoneName()
    {
        return TimezoneName;
    }

    QString WorkerSettings::GetProxyServer()
    {
        return ProxyServer;
    }
    void WorkerSettings::SetProxyServer(const QString& ProxyServer)
    {
        this->ProxyServer = ProxyServer;
    }

    int WorkerSettings::GetProxyPort()
    {
        return ProxyPort;
    }

    void WorkerSettings::SetProxyPort(int ProxyPort)
    {
        this->ProxyPort = ProxyPort;
    }

    bool WorkerSettings::GetProxyIsHttp()
    {
        return ProxyIsHttp;
    }
    void WorkerSettings::SetProxyIsHttp(bool ProxyIsHttp)
    {
        this->ProxyIsHttp = ProxyIsHttp;
    }

    QString WorkerSettings::GetProxyName()
    {
        return ProxyName;
    }
    void WorkerSettings::SetProxyName(const QString& ProxyName)
    {
        this->ProxyName = ProxyName;
    }

    QString WorkerSettings::GetProxyPassword()
    {
        return ProxyPassword;
    }

    void WorkerSettings::SetProxyPassword(const QString& ProxyPassword)
    {
        this->ProxyPassword = ProxyPassword;
    }

    QString WorkerSettings::GetProxyTarget()
    {
        return ProxyTarget;
    }

    void WorkerSettings::SetProxyTarget(const QString& ProxyTarget)
    {
        this->ProxyTarget = ProxyTarget;
    }

    void WorkerSettings::SetBrowserEngine(const QString& BrowserEngine)
    {
        this->BrowserEngine = BrowserEngine;
    }

    QString WorkerSettings::GetBrowserEngine()
    {
        return BrowserEngine;
    }

    QString WorkerSettings::GetBrowserEngineVirtual()
    {
        return BrowserEngineVirtual;
    }
    void WorkerSettings::SetBrowserEngineVirtual(const QString& BrowserEngine)
    {
        this->BrowserEngineVirtual = BrowserEngine;
    }

    void WorkerSettings::SetWorkerPathSafe(const QString& PathSafe)
    {
        this->PathSafe = PathSafe;
    }
    void WorkerSettings::SetWorkerPathNotSafe(const QString& PathNotSafe)
    {
        this->PathNotSafe = PathNotSafe;
    }
    void WorkerSettings::SetProfile(const QString& Profile)
    {
        this->Profile = Profile;
    }
    void WorkerSettings::SetExtensions(const QString& Extensions)
    {
        this->Extensions = Extensions;
    }
    void WorkerSettings::SetUseFlash(bool UseFlash)
    {
        this->UseFlash = UseFlash;
    }
    void WorkerSettings::SetProxyTunneling(bool ProxyTunneling)
    {
        this->ProxyTunneling = ProxyTunneling;
    }
    void WorkerSettings::SetSkipFrames(int SkipFrames)
    {
        this->SkipFrames = SkipFrames;
    }

    QString WorkerSettings::GetWebrtc()
    {
        return Webrtc;
    }
    QString WorkerSettings::GetWebrtcIps()
    {
        return WebrtcIps;
    }
    QString WorkerSettings::GetCanvas()
    {
        return Canvas;
    }
    QString WorkerSettings::GetCanvasNoise()
    {
        return CanvasNoise;
    }
    QString WorkerSettings::GetAudio()
    {
        return Audio;
    }
    QString WorkerSettings::GetAudioNoise()
    {
        return AudioNoise;
    }
    void WorkerSettings::SetAudio(const QString& Audio)
    {
        this->Audio = Audio;
    }
    void WorkerSettings::SetAudioNoise(const QString& AudioNoise)
    {
        this->AudioNoise = AudioNoise;
    }

    QString WorkerSettings::GetWebgl()
    {
        return Webgl;
    }
    QString WorkerSettings::GetWebglNoise()
    {
        return WebglNoise;
    }
    void WorkerSettings::SetWebrtc(const QString& Webrtc)
    {
        this->Webrtc = Webrtc;
    }
    void WorkerSettings::SetWebrtcIps(const QString& WebrtcIps)
    {
        this->WebrtcIps = WebrtcIps;
    }
    void WorkerSettings::SetCanvas(const QString& Canvas)
    {
        this->Canvas = Canvas;
    }
    void WorkerSettings::SetCanvasNoise(const QString& CanvasNoise)
    {
        this->CanvasNoise = CanvasNoise;
    }
    void WorkerSettings::SetWebgl(const QString& Webgl)
    {
        this->Webgl = Webgl;
    }
    void WorkerSettings::SetWebglNoise(const QString& WebglNoise)
    {
        this->WebglNoise = WebglNoise;
    }

    QString WorkerSettings::GetWorkerPathSafe()
    {
        return PathSafe;
    }
    QString WorkerSettings::GetWorkerPathNotSafe()
    {
        return PathNotSafe;
    }
    QString WorkerSettings::GetProfile()
    {
        return Profile;
    }
    QString WorkerSettings::GetWorkerPath()
    {
        return PathSafe;
    }
    QString WorkerSettings::GetExtensions()
    {
        return Extensions;
    }
    bool WorkerSettings::GetUseFlash()
    {
        return UseFlash;
    }
    bool WorkerSettings::GetProxyTunneling()
    {
        return ProxyTunneling;
    }
    int WorkerSettings::GetSkipFrames()
    {
        return SkipFrames;
    }

    IWorkerSettings* WorkerSettings::Clone()
    {
        WorkerSettings * res = new WorkerSettings();
        res->SetWorkerPathSafe(PathSafe);
        res->SetWorkerPathNotSafe(PathNotSafe);
        res->SetUseFlash(UseFlash);
        res->SetProxyTunneling(ProxyTunneling);
        res->SetProfile(Profile);
        res->SetExtensions(Extensions);
        res->SetSkipFrames(SkipFrames);
        res->SetBrowserEngine(BrowserEngine);
        res->SetProxyServer(ProxyServer);
        res->SetProxyPort(ProxyPort);
        res->SetProxyIsHttp(ProxyIsHttp);
        res->SetProxyName(ProxyName);
        res->SetProxyPassword(ProxyPassword);

        res->SetWebrtc(Webrtc);
        res->SetWebrtcIps(WebrtcIps);
        res->SetTimezone(Timezone);
        res->SetTimezoneName(TimezoneName);
        res->SetCanvas(Canvas);
        res->SetCanvasNoise(CanvasNoise);
        res->SetAudio(Audio);
        res->SetAudioNoise(AudioNoise);
        res->SetWebgl(Webgl);
        res->SetWebglNoise(WebglNoise);

        for(QString& key: Keys())
        {
            res->Set(key,Get(key));
        }
        return res;
    }

    void WorkerSettings::ParseFromSettings(QSettings& Settings)
    {
        if(Settings.contains("IsSafe"))
        {
            if(Settings.value("IsSafe",true).toBool())
            {
                SetWebrtc("disable");
                SetCanvas("disable");
                SetAudio("disable");
            }else
            {
                SetWebrtc("enable");
                SetCanvas("enable");
                SetAudio("enable");
            }
        }

        if(Settings.contains("DisableWebgl"))
        {
            if(Settings.value("DisableWebgl",true).toBool())
            {
                SetWebgl("disable");
            }else
            {
                SetWebgl("enable");
            }
        }

        if(Settings.contains("Webrtc"))
            SetWebrtc(Settings.value("Webrtc","disable").toString());

        if(Settings.contains("Canvas"))
            SetCanvas(Settings.value("Canvas","disable").toString());

        if(Settings.contains("CanvasNoise"))
            SetCanvasNoise(Settings.value("CanvasNoise","").toString());

        if(Settings.contains("Audio"))
            SetAudio(Settings.value("Audio","disable").toString());

        if(Settings.contains("AudioNoise"))
            SetAudioNoise(Settings.value("AudioNoise","").toString());

        if(Settings.contains("WebrtcIps"))
            SetWebrtcIps(Settings.value("WebrtcIps","").toString());

        if(Settings.contains("Webgl"))
            SetWebgl(Settings.value("Webgl","disable").toString());

        if(Settings.contains("WebglNoise"))
            SetWebglNoise(Settings.value("WebglNoise","").toString());

        if(Settings.contains("WebglVendor"))
        {
            QString Value = Settings.value("WebglVendor","").toString();
            if(!Value.isEmpty())
                Set("Webgl.unmaskedVendor", Value);
        }

        if(Settings.contains("WebglRenderer"))
        {
            QString Value = Settings.value("WebglRenderer","").toString();
            if(!Value.isEmpty())
                Set("Webgl.unmaskedRenderer", Value);
        }

        if(Settings.contains("EnableFlash"))
            SetUseFlash(Settings.value("EnableFlash",false).toBool());

        SetUseFlash(Settings.value("EnableFlash",false).toBool());

        SetProxyTunneling(Settings.value("ProxyTunneling",true).toBool());
        SetSkipFrames(Settings.value("SkipFrames",1).toInt());
    }

    void WorkerSettings::SetSettingWhichRestartsBrowser(const QString& Key, QJsonObject& Object, bool& NeedRestart, bool& NeedSend)
    {
        if(Object.contains(Key))
        {
            QString prev = Get(Key);
            QString next = Object[Key].toString();
            if(prev != next)
            {
                Set(Key, next);
                NeedRestart = true;
            }
        }
    }

    void WorkerSettings::SetSettingWhichRestartsVirtualBrowser(const QString& Key, QJsonObject& Object, bool& NeedToRestartVirtual, bool& NeedToCloseVirtual)
    {
        if(Object.contains(Key))
        {
            QString prev = Get(Key);
            QString next = Object[Key].toString();
            if(prev != next)
            {
                Set(Key, next);
                NeedToRestartVirtual = true;
            }
        }
    }

    void WorkerSettings::PreserveDefaultMultiloginSettings(const QJsonObject& Object)
    {
        SettingsPreserved.clear();
        for(QString &Key:Object.keys())
        {
            QString Prefix("multilogin.fingerprintGeneration.");
            if(Key.startsWith(Prefix))
            {
                SettingsPreserved[Key] = Object[Key].toString();
            }
        }
    }


    void WorkerSettings::Change(const QString& JsonString, bool& NeedRestart,bool& NeedSend,bool &NeedToRestartVirtual,bool &NeedToCloseVirtual, bool IsRecord)
    {
        NeedRestart = false;
        NeedSend = false;
        NeedToRestartVirtual = false;
        NeedToCloseVirtual = false;

        QJsonParseError err;
        QJsonDocument doc = QJsonDocument::fromJson(JsonString.toUtf8(), &err);

        if(err.error != QJsonParseError::NoError)
        {
            return;
        }

         QJsonObject object = doc.object();

         if(object.contains("BrowserEngine"))
         {
            QString next = object["BrowserEngine"].toString();

            if(IsRecord)
            {
                QString prev = GetBrowserEngineVirtual();
                if(prev != next)
                {

                    if(!prev.startsWith("BAS") && next.startsWith("BAS"))
                    {
                        //returning to BAS engine in record mode - need to close virtual browser
                        NeedToCloseVirtual = true;
                    }

                    //record mode - nofify script editor about new engine
                    NeedSend = true;
                }
            }else
            {
                QString prev = GetBrowserEngine();
                if(prev != next)
                {
                    //Not a record mode - restart browser
                    NeedRestart = true;
                    SetBrowserEngine(next);
                }
            }

            if(next.startsWith("MLA"))
            {
                PreserveDefaultMultiloginSettings(object);
            }

            SetBrowserEngineVirtual(next);
         }

         bool IsMLAReal = !GetBrowserEngine().startsWith("BAS");
         bool IsMLAVirtual = !GetBrowserEngineVirtual().startsWith("BAS");
         bool IsMLA = IsMLAReal || IsMLAVirtual;

         if(object.contains("server"))
         {
            QString prev = GetProxyServer();
            QString next = object["server"].toString();
            if(prev != next)
            {
                SetProxyServer(next);
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedSend = true;
                }
            }
         }

         if(object.contains("Port"))
         {
            int prev = GetProxyPort();
            int next = object["Port"].toInt();
            if(prev != next)
            {
                SetProxyPort(next);
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedSend = true;
                }
            }
         }


         if(object.contains("IsHttp"))
         {
            bool prev = GetProxyIsHttp();
            bool next = object["IsHttp"].toBool();
            if(prev != next)
            {
                SetProxyIsHttp(next);
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedSend = true;
                }
            }
         }


         if(object.contains("name"))
         {
            QString prev = GetProxyName();
            QString next = object["name"].toString();
            if(prev != next)
            {
                SetProxyName(next);
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedSend = true;
                }
            }
         }


         if(object.contains("password"))
         {
            QString prev = GetProxyPassword();
            QString next = object["password"].toString();
            if(prev != next)
            {
                SetProxyPassword(next);
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedSend = true;
                }
            }
         }


         if(object.contains("target"))
         {
            QString prev = GetProxyTarget();
            QString next = object["target"].toString();
            if(prev != next)
            {
                SetProxyTarget(next);
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedSend = true;
                }
            }
         }

         if(!IsMLA && object.contains("IsSafe"))
         {
            if(object["IsSafe"].toBool())
            {
                SetCanvas("disable");
                SetWebrtc("disable");
                SetAudio("disable");
            }else
            {
                SetCanvas("enable");
                SetWebrtc("enable");
                SetAudio("enable");
            }
            UpdateFingerprintsSettings();
         }


         if(!IsMLA && object.contains("UseFlash"))
         {
            bool prev = GetUseFlash();
            bool next = object["UseFlash"].toBool();
            if(prev != next)
            {
                NeedRestart = true;
                SetUseFlash(next);
            }
         }

         if(!IsMLA && object.contains("Webrtc"))
         {
            SetWebrtc(object["Webrtc"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("Canvas"))
         {
            SetCanvas(object["Canvas"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("Audio"))
         {
            SetAudio(object["Audio"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("CanvasNoise"))
         {
            SetCanvasNoise(object["CanvasNoise"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("AudioNoise"))
         {
            SetAudioNoise(object["AudioNoise"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("WebrtcIps"))
         {
            SetWebrtcIps(object["WebrtcIps"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("Timezone"))
         {
            SetTimezone(object["Timezone"].toString().toInt());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("TimezoneName"))
         {
            SetTimezoneName(object["TimezoneName"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("Webgl"))
         {
            SetWebgl(object["Webgl"].toString());
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("WebglNoise"))
         {
            SetWebglNoise(object["WebglNoise"].toString());
            UpdateFingerprintsSettings();
         }

         bool UpdatedWebglSettings = false;
         for(QString &Key:object.keys())
         {
             QString Prefix("Webgl.");
             if(Key.startsWith(Prefix))
             {
                 Set(Key,object[Key].toString());
                 UpdatedWebglSettings = true;
             }
         }
         if(UpdatedWebglSettings)
         {
            UpdateFingerprintsSettings();
         }

         bool UpdatedAttributes = false;
         for(QString &Key:object.keys())
         {
             QString Prefix("Attribute.");
             if(Key.startsWith(Prefix))
             {
                 Set(Key,object[Key].toString());
                 UpdatedAttributes = true;
             }
         }
         bool UpdatedFingerprints = false;
         for(QString &Key:object.keys())
         {
             QString Prefix("Fingerprints.");
             if(Key.startsWith(Prefix))
             {
                 Set(Key,object[Key].toString());
                 UpdatedFingerprints = true;
             }
         }
         if(UpdatedAttributes || UpdatedFingerprints)
         {
            UpdateFingerprintsSettings();
         }

         if(!IsMLA && object.contains("ProxyTunneling"))
         {
            bool prev = GetProxyTunneling();
            bool next = object["ProxyTunneling"].toBool();
            if(prev != next)
            {
                NeedRestart = true;
                SetProxyTunneling(next);
            }
         }


         if(object.contains("ProfilePath"))
         {
            QString prev = GetProfile();
            QString next = object["ProfilePath"].toString();
            if(next == QString("<Incognito>"))
            {
                next.clear();
            }

            if(prev != next || (prev.isEmpty() && next.isEmpty() && IsMLA))
            {
                if(IsMLAReal)
                {
                    NeedRestart = true;
                }else if(IsMLAVirtual)
                {
                    NeedToRestartVirtual = true;
                }else
                {
                    NeedRestart = true;
                }
                SetProfile(next);
            }

         }

         if(object.contains("Extensions"))
         {
            QString prev = GetExtensions();
            QString next = object["Extensions"].toString();

            if(prev != next)
            {
                NeedRestart = true;
                SetExtensions(next);
            }

         }


         if(!IsMLA && object.contains("SkipFrames"))
         {
            int prev = GetSkipFrames();
            int next = object["SkipFrames"].toInt();
            if(prev != next)
            {
                NeedSend = true;
                SetSkipFrames(next);
            }
         }


         if(IsMLA && object.contains("LoadFingerprintFromProfileFolder"))
         {
            QString prev = Get("LoadFingerprintFromProfileFolder");
            QString next = object["LoadFingerprintFromProfileFolder"].toString();
            if(prev != next)
            {
                Set("LoadFingerprintFromProfileFolder",next);
            }
         }

         if(IsMLAReal)
         {
             for(QString &Key:object.keys())
             {
                 QString Prefix("multilogin.fingerprintGeneration.");
                 if(Key.startsWith(Prefix))
                 {
                     SetSettingWhichRestartsBrowser(Key, object, NeedRestart, NeedSend);
                 }
             }
         }else if(IsMLAVirtual)
         {
             for(QString &Key:object.keys())
             {
                 QString Prefix("multilogin.fingerprintGeneration.");
                 if(Key.startsWith(Prefix))
                 {
                     SetSettingWhichRestartsVirtualBrowser(Key, object, NeedToRestartVirtual, NeedToCloseVirtual);
                 }
             }
         }
    }

    QString WorkerSettings::GetRandomString()
    {
       const QString possibleCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
       const int randomStringLength = 8;

       QString randomString;
       for(int i=0; i<randomStringLength; ++i)
       {
           int index = qrand() % possibleCharacters.length();
           QChar nextChar = possibleCharacters.at(index);
           randomString.append(nextChar);
       }
       return randomString;
    }

    void WorkerSettings::RemoveOldTempProfiles()
    {
        QDirIterator it("prof", QDir::Dirs | QDir::NoDotAndDotDot, QDirIterator::NoIteratorFlags);
        while (it.hasNext())
        {
            QString dir = it.next();
            QString FilePath = dir + "/LOCK";

            QFile(FilePath).remove();

            if(!QFileInfo(FilePath).exists())
            {
                QDir(dir).removeRecursively();
            }
        }
    }

    void WorkerSettings::UpdateFingerprintsSettings()
    {
        RemoveOldFingerprintSettings();

        QString Text;

        if(Webrtc == "enable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "WebrtcType=Enable";
        }

        if(Webrtc == "disable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "WebrtcType=Disable";
        }

        if(Webrtc == "replace")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "WebrtcType=Replace";
        }


        if(!WebrtcIps.isEmpty())
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("WebrtcIps=") + WebrtcIps;
        }


        if(Timezone >= TIMEZONE_NONE || Timezone <= -TIMEZONE_NONE)
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("TimezoneReplace=Disable");
        }else
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("TimezoneReplace=Enable");
            Text += "\r\n";
            Text += QString("TimezoneOffset=") + QString::number(Timezone);
        }


        if(TimezoneName != "BAS_NOT_SET")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("TimezoneName=") + TimezoneName;

            if(!Text.isEmpty())
                Text += "\r\n";
            std::hash<std::string> Hasher;
            unsigned short int hash = Hasher(TimezoneName.toStdString());
            Text += QString("TimezoneHash=") + QString::number(hash);
        }




        if(Canvas == "enable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "CanvasType=Enable";
        }

        if(Canvas == "disable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "CanvasType=Disable";
        }

        if(Canvas == "noise")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "CanvasType=Noise";
        }


        if(Audio == "enable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "AudioType=Enable";
        }

        if(Audio == "disable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "AudioType=Disable";
        }

        if(Audio == "noise")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "AudioType=Noise";
        }

        if(Webgl == "enable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "WebglType=Enable";
        }

        if(Webgl == "disable")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "WebglType=Disable";
        }

        if(Webgl == "noise")
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += "WebglType=Noise";
        }

        if(!CanvasNoise.isEmpty())
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("CanvasFingerprint=") + CanvasNoise;
        }

        if(!AudioNoise.isEmpty())
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("AudioFingerprint=") + AudioNoise;
        }

        if(!WebglNoise.isEmpty())
        {
            if(!Text.isEmpty())
                Text += "\r\n";
            Text += QString("WebglFingerprint=") + WebglNoise;
        }

        QStringList keys = Keys();

        for(const QString& Key: keys)
        {
            if(Key.startsWith("Webgl."))
            {
                if(!Text.isEmpty())
                    Text += "\r\n";
                Text += Key + QString("=") + Get(Key);
            }
        }

        for(const QString& Key: keys)
        {
            if(Key.startsWith("Attribute."))
            {
                if(!Text.isEmpty())
                    Text += "\r\n";
                Text += Key + QString("=") + Get(Key);
            }
        }

        //Check if fingerprint uses canvas replacement
        bool ReplaceCanvas = keys.contains("Fingerprints.PerfectCanvasDoReplace") && Get("Fingerprints.PerfectCanvasDoReplace") == "Enable";

        for(const QString& Key: keys)
        {
            if(Key.startsWith("Fingerprints."))
            {
                if(Key.startsWith("Fingerprints.PerfectCanvasReplace.") && !ReplaceCanvas)
                {
                    //Disable PerfectCanvas data if no need to replace it
                    continue;
                }
                if(!Text.isEmpty())
                    Text += "\r\n";
                QString KeyUpdated = Key;
                KeyUpdated = KeyUpdated.remove("Fingerprints.");
                Text += KeyUpdated + QString("=") + Get(Key);
            }
        }

        QFile file(QString("s/") + UniqueProcessId + QString("1.ini"));
        if(file.open(QIODevice::WriteOnly))
        {
            file.write(Text.toUtf8());
        }
        file.close();

    }

    void WorkerSettings::RemoveOldFingerprintSettings()
    {
        QDirIterator it("s", QDir::Files | QDir::NoDotAndDotDot, QDirIterator::NoIteratorFlags);
        while (it.hasNext())
        {
            QString FilePath = it.next();
            if(FilePath.toLower().endsWith(".lock"))
            {
                QFile(FilePath).remove();

                if(!QFileInfo(FilePath).exists())
                {
                    FilePath.remove(FilePath.size()-5,5);
                    QFile(FilePath + ".txt").remove();
                    QFile(FilePath + ".ini").remove();
                    QFile(FilePath + "1.ini").remove();
                    QFile(FilePath + ".detect").remove();
                }

            }
        }
    }

    QStringList WorkerSettings::GetCommandLineParameters(const QString &Language, bool IsVirtual)
    {
        QString Engine;
        if(IsVirtual)
            Engine = GetBrowserEngineVirtual();
        else
            Engine = GetBrowserEngine();
        QStringList res;
        if(Engine == QString("BASChrome"))
        {
            RemoveOldTempProfiles();

            res.append(Language);

            res.append("--UseFlash");
            res.append(QString::number(GetUseFlash()));

            res.append("--ProxyTunneling");
            res.append(QString::number(GetProxyTunneling()));

            res.append("--SkipFrames");
            res.append(QString::number(GetSkipFrames()));

            UniqueProcessId = GetRandomString();
            UpdateFingerprintsSettings();
            res.append(QString("--unique-process-id=") + UniqueProcessId);

            res.append("--Profile");
            QString ActualProfile = GetProfile();
            if(ActualProfile.isEmpty())
            {
                ActualProfile = QString("prof/") + GetRandomString();
            }
            res.append(ActualProfile);

            res.append("--Extensions");
            res.append(GetExtensions().split(QRegExp("[\r\n]"),QString::SkipEmptyParts).join(";"));
        }else if(Engine.startsWith(QString("WebDriver")))
        {
            //res.append("--headless");
            if(!GetProxyServer().isEmpty())
            {
                QString ProxyServerString = "--proxy-server=";
                if(GetProxyIsHttp())
                {
                    ProxyServerString += "http://";
                }else
                {
                    ProxyServerString += "socks5://";
                }
                if(!GetProxyName().isEmpty() && !GetProxyPassword().isEmpty())
                {
                    ProxyServerString += GetProxyName();
                    ProxyServerString += ":";
                    ProxyServerString += GetProxyPassword();
                    ProxyServerString += "@";
                }
                ProxyServerString += GetProxyServer();
                ProxyServerString += ":";
                ProxyServerString += QString::number(GetProxyPort());
                res.append(ProxyServerString);
            }

        }else if(Engine.startsWith(QString("MLA")))
        {
            if(!GetProxyServer().isEmpty())
            {
                if(GetProxyIsHttp())
                {
                    res.append(QString("proxyType=\"http\""));
                }else
                {
                    res.append(QString("proxyType=\"socks5\""));
                }
                if(!GetProxyName().isEmpty() && !GetProxyPassword().isEmpty())
                {
                    res.append(QString("proxyUser=\"") + GetProxyName() + QString("\""));
                    res.append(QString("proxyPass=\"") + GetProxyPassword() + QString("\""));
                }
                res.append(QString("proxyHost=\"") + GetProxyServer() + QString("\""));
                res.append(QString("proxyPort=") + QString::number(GetProxyPort()));
            }else
            {
                res.append(QString("proxyType=\"none\""));
            }
            res.append("Profile=" + GetProfile());
            if(Get("LoadFingerprintFromProfileFolder") == QString("true"))
                res.append("LoadFingerprintFromProfileFolder=true");

            for(QString &Key:Keys())
            {
                QString Prefix("multilogin.fingerprintGeneration.");
                if(Key.startsWith(Prefix))
                {
                    QString KeyCopy = Key;
                    MLAAddCommandLineSettings(res, KeyCopy.mid(Prefix.length()),Prefix);
                }
            }
        }
        return res;
    }

    void WorkerSettings::MLAAddCommandLineSettings(QStringList& Arguments,const QString& SettingKey,const QString& Prefix)
    {
        if(Keys().contains(Prefix + SettingKey))
        {
            Arguments.append(SettingKey + QString("=") + Get(Prefix + SettingKey));
        }
    }

}
