#include "cronscheduler.h"
#include <QCoreApplication>
#include <QDir>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QSqlQuery>
#include <QSqlError>

CronScheduler::CronScheduler(QObject *p):QObject(p){
    timer_.setInterval(60000);
    connect(&timer_, &QTimer::timeout, this, &CronScheduler::tick);
    dbPath_=QCoreApplication::applicationDirPath()+"/scheduler.db";
}
void CronScheduler::start(){ ensureDb(); timer_.start(); tick(); }
void CronScheduler::stop(){ timer_.stop(); }
bool CronScheduler::ensureDb(){
    auto db=QSqlDatabase::addDatabase("QSQLITE","cron");
    db.setDatabaseName(dbPath_);
    if(!db.open()) return false;
    QSqlQuery q(db); q.exec("CREATE TABLE IF NOT EXISTS cron_tasks(id TEXT PRIMARY KEY, url TEXT, cron TEXT, enabled INTEGER, lastRun INTEGER)");
    return true;
}
void CronScheduler::tick(){
    auto db=QSqlDatabase::database("cron");
    if(!db.isOpen()) return;
    QSqlQuery q(db); q.exec("SELECT id,url FROM cron_tasks WHERE enabled=1");
    int n=0;
    while(q.next()){
        QString id=q.value(0).toString();
        // enqueue via Task API would go here; for now just count
        Q_UNUSED(id) ++n;
    }
    if(n) emit ticked(n);
}
