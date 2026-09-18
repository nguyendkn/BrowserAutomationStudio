#include <QCoreApplication>
#include <QCommandLineParser>
#include <QSettings>
#include "httplistener.h"
#include "apiserver.h"
#include "ws/eventhub.h"
int main(int argc,char*argv[]){
    QCoreApplication app(argc,argv);
    app.setApplicationName("BAS Server API");
    QCommandLineParser p; p.addHelpOption();
    QCommandLineOption portOpt("port","API port","port","18080");
    p.addOption(portOpt); p.process(app);
    quint16 port=quint16(p.value(portOpt).toUShort());
    quint16 wsPort=port+1;
    QString iniPath = QCoreApplication::applicationDirPath() + "/bas-server.ini";
    QSettings *cfg=new QSettings(iniPath, QSettings::IniFormat);
    cfg->setValue("host","127.0.0.1");
    cfg->setValue("port",port);
    cfg->sync();
    ApiServer *handler=new ApiServer(&app);
    auto *listener=new stefanfrings::HttpListener(cfg,handler,&app);
    Q_UNUSED(listener)
    EventHub::instance().start(wsPort);
    qInfo("BAS API listening on http://127.0.0.1:%d  ws on :%d",port,wsPort);
    return app.exec();
}
