#include <QCoreApplication>
#include <QCommandLineParser>
#include <QSettings>
#include <QDir>
#include "httplistener.h"
#include "apiserver.h"
#include "ws/eventhub.h"
#include "taskstore.h"
#include "runstore.h"

int main(int argc,char*argv[]){
    QCoreApplication app(argc,argv);
    app.setApplicationName("BAS Server API");
    QCommandLineParser p; p.addHelpOption();
    QCommandLineOption portOpt("port","API port","port","18080");
    QCommandLineOption dbOpt("db","SQLite db path","path","");
    p.addOption(portOpt); p.addOption(dbOpt); p.process(app);
    quint16 port=quint16(p.value(portOpt).toUShort());
    quint16 wsPort=port+1;
    QString dbPath=p.value(dbOpt);
    if(!dbPath.isEmpty()){
        TaskStore::instance().openSqlite(dbPath);
        RunStore::instance().openSqlite(dbPath);
        qInfo("SQLite persistence: %s", qPrintable(dbPath));
    } else {
        QString defaultDb=QCoreApplication::applicationDirPath()+"/bas-server.db";
        // try open, ignore failure (in-memory fallback)
        TaskStore::instance().openSqlite(defaultDb);
        RunStore::instance().openSqlite(defaultDb);
    }
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
