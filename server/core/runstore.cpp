#include "runstore.h"
#include <QDateTime>
#include <QUuid>
#include <QSqlQuery>
#include <QSqlError>
#include <QVariant>

QJsonObject RunRecord::toJson() const {
    QJsonObject o; o["id"]=id; o["taskId"]=taskId; o["status"]=status;
    o["startedAt"]=startedAt; o["finishedAt"]=finishedAt; o["log"]=log; return o;
}
RunStore &RunStore::instance(){ static RunStore s; return s; }
QString RunStore::create(const QString &taskId){
    RunRecord r; r.id=QUuid::createUuid().toString(QUuid::WithoutBraces).left(8);
    r.taskId=taskId; r.status="running"; r.startedAt=QDateTime::currentMSecsSinceEpoch();
    QMutexLocker l(&m_); runs_.insert(r.id,r);
    if(useDb_){
        QSqlQuery q(db_); q.prepare("INSERT INTO runs(id,taskId,status,startedAt) VALUES(?,?,?,?)");
        q.addBindValue(r.id); q.addBindValue(r.taskId); q.addBindValue(r.status); q.addBindValue(r.startedAt); q.exec();
    }
    return r.id;
}
bool RunStore::finish(const QString &id, const QString &status, const QString &log){
    QMutexLocker l(&m_); auto it=runs_.find(id); if(it==runs_.end()) return false;
    it->status=status; it->log=log; it->finishedAt=QDateTime::currentMSecsSinceEpoch();
    if(useDb_){
        QSqlQuery q(db_); q.prepare("UPDATE runs SET status=?, finishedAt=?, log=? WHERE id=?");
        q.addBindValue(status); q.addBindValue(it->finishedAt); q.addBindValue(log); q.addBindValue(id); q.exec();
    }
    return true;
}
RunRecord RunStore::get(const QString &id) const { QMutexLocker l(&m_); return runs_.value(id); }
QList<RunRecord> RunStore::listForTask(const QString &taskId) const {
    QMutexLocker l(&m_); QList<RunRecord> out; for(auto &r: runs_) if(r.taskId==taskId) out.append(r); return out;
}
QList<RunRecord> RunStore::listAll() const { QMutexLocker l(&m_); return runs_.values(); }
bool RunStore::openSqlite(const QString &dbPath){
    db_ = QSqlDatabase::addDatabase("QSQLITE","runstore");
    db_.setDatabaseName(dbPath); if(!db_.open()) return false;
    useDb_=true; ensureTable();
    QSqlQuery q(db_); q.exec("SELECT id,taskId,status,startedAt,finishedAt,log FROM runs");
    while(q.next()){
        RunRecord r; r.id=q.value(0).toString(); r.taskId=q.value(1).toString();
        r.status=q.value(2).toString(); r.startedAt=q.value(3).toLongLong();
        r.finishedAt=q.value(4).toLongLong(); r.log=q.value(5).toString();
        runs_.insert(r.id,r);
    }
    return true;
}
void RunStore::ensureTable(){
    QSqlQuery q(db_); q.exec("CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, taskId TEXT, status TEXT, startedAt INTEGER, finishedAt INTEGER, log TEXT)");
}
