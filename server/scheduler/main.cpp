#include <QCoreApplication>
#include "cronscheduler.h"
int main(int argc,char*argv[]){
    QCoreApplication a(argc,argv);
    CronScheduler s; s.start();
    qInfo("BAS Scheduler started (stub, 60s tick)");
    return a.exec();
}
