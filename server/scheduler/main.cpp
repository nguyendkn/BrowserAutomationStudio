#include <QCoreApplication>
#include <QCommandLineParser>
#include "cronscheduler.h"
int main(int argc,char*argv[]){
    QCoreApplication app(argc,argv);
    app.setApplicationName("BAS Scheduler");
    QCommandLineParser p; p.addHelpOption();
    QCommandLineOption apiOpt("api","API base url","url","http://127.0.0.1:18080");
    QCommandLineOption intervalOpt("interval","poll interval ms","ms","60000");
    p.addOption(apiOpt); p.addOption(intervalOpt); p.process(app);
    CronScheduler s;
    s.setApiBase(p.value(apiOpt));
    s.setIntervalMs(p.value(intervalOpt).toInt());
    QObject::connect(&s, &CronScheduler::ticked, [](int n){ qInfo("scheduler tick enqueued %d", n); });
    s.start();
    qInfo("BAS Scheduler started api=%s interval=%sms", qPrintable(p.value(apiOpt)), qPrintable(p.value(intervalOpt)));
    return app.exec();
}
