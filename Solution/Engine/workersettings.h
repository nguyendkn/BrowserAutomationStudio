#ifndef WORKERSETTINGS_H
#define WORKERSETTINGS_H
#include "engine_global.h"
#include "iworkersettings.h"
#include <QObject>

namespace BrowserAutomationStudioFramework
{
    class ENGINESHARED_EXPORT WorkerSettings : public IWorkerSettings
    {
        Q_OBJECT


        QString PathSafe;
        QString PathNotSafe;
        QString Profile;
        QString TempProfile;
        QString BrowserEngine;
        QString BrowserEngineVirtual;
        bool UseFlash;
        bool UseWidevine;
        int Timezone;
        QString TimezoneName;

        QString Webrtc;
        QString Canvas;
        QString CanvasNoise;
        QString Audio;
        QString AudioNoise;
        QString Webgl;
        QString WebglNoise;
        QString WebrtcIps;
        int MaxFPS = 30;


        QString UniqueProcessId;

        QString ProxyServer;
        int ProxyPort;
        bool ProxyIsHttp;
        QString ProxyName;
        QString ProxyPassword;
        QString ProxyTarget;
        QHash<QString,QString> Settings;
        QHash<QString,QString> SettingsPreserved;
        QString Extensions;

        void SetSettingWhichRestartsBrowser(const QString& Key, QJsonObject& Object, bool& NeedRestart, bool& NeedSend);
        void SetSettingWhichRestartsVirtualBrowser(const QString& Key, QJsonObject& Object, bool& NeedToRestartVirtual, bool& NeedSend);
        void MLAAddCommandLineSettings(QStringList& Arguments,const QString& SettingKey,const QString& Prefix);

        void PreserveDefaultMultiloginSettings(const QJsonObject& Object);

    public:
        explicit WorkerSettings(QObject *parent = 0);

        virtual void SetWorkerPathSafe(const QString& PathSafe);
        virtual void SetWorkerPathNotSafe(const QString& PathNotSafe);
        virtual void SetProfile(const QString& Profile);
        virtual void SetExtensions(const QString& Extensions);
        virtual void SetUseFlash(bool UseFlash);
        virtual void SetUseWidevine(bool UseWidevine);

        virtual QString Get(const QString& Key);
        virtual void Set(const QString& Key,const QString& Value);
        virtual QStringList Keys();

        virtual void SetTimezone(int Timezone);
        virtual int GetTimezone();
        virtual void SetTimezoneName(const QString& TimezoneName);
        virtual QString GetTimezoneName();
        virtual QString GetWebrtc();
        virtual QString GetWebrtcIps();
        virtual QString GetCanvas();
        virtual QString GetCanvasNoise();
        virtual QString GetAudio();
        virtual QString GetAudioNoise();
        virtual int GetMaxFPS();
        virtual void SetAudio(const QString& Audio);
        virtual void SetAudioNoise(const QString& AudioNoise);
        virtual QString GetWebgl();
        virtual QString GetWebglNoise();
        virtual void SetWebrtc(const QString& Webrtc);
        virtual void SetWebrtcIps(const QString& WebrtcIps);
        virtual void SetCanvas(const QString& Canvas);
        virtual void SetCanvasNoise(const QString& CanvasNoise);
        virtual void SetWebgl(const QString& Webgl);
        virtual void SetWebglNoise(const QString& WebglNoise);
        virtual void SetMaxFPS(int MaxFPS);


        virtual QString GetWorkerPathSafe();
        virtual QString GetWorkerPathNotSafe();
        virtual QString GetWorkerPath();
        virtual QString GetExtensions();
        virtual void SetBrowserEngine(const QString& BrowserEngine);
        virtual QString GetBrowserEngine();
        virtual QString GetBrowserEngineVirtual();
        virtual void SetBrowserEngineVirtual(const QString& BrowserEngine);

        virtual QString GetProfile();
        virtual QString GetRealProfile();
        virtual bool IsTemporaryProfile();

        virtual bool GetUseFlash();
        virtual bool GetUseWidevine();

        virtual QString GetProxyServer();
        virtual void SetProxyServer(const QString& ProxyServer);

        virtual int GetProxyPort();
        virtual void SetProxyPort(int ProxyPort);

        virtual bool GetProxyIsHttp();
        virtual void SetProxyIsHttp(bool ProxyIsHttp);

        virtual QString GetProxyName();
        virtual void SetProxyName(const QString& ProxyName);

        virtual QString GetProxyPassword();
        virtual void SetProxyPassword(const QString& ProxyPassword);

        virtual QString GetProxyTarget();
        virtual void SetProxyTarget(const QString& ProxyTarget);

        virtual IWorkerSettings* Clone();
        virtual void ParseFromSettings(QSettings& Settings);
        virtual void Change(const QString& JsonString, bool& NeedRestart,bool& NeedSend,bool &NeedToRestartVirtual,bool &NeedToCloseVirtual,bool IsRecord);
        virtual QStringList GetCommandLineParameters(const QString &Language, bool IsVirtual);

        virtual void Clear();

        virtual QString GetUniqueProcessId();


    signals:

    public slots:

    private:
        QString GetRandomString();
        void RemoveOldFingerprintSettings();
        void UpdateFingerprintsSettings();


    };
}

#endif // WORKERSETTINGS_H
