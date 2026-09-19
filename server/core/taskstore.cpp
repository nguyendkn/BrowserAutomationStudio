#include "taskstore.h"
#include <QDateTime>
#include <QUuid>
#include <QSqlQuery>
#include <QSqlError>

QJsonObject TaskRecord::toJson() const {
    QJsonObject o; o["id"]=id; o["url"]=url; o["status"]=status;
    o["result"]=result; o["script"]=script;
    o["createdAt"]=createdAt; o["updatedAt"]=updatedAt; return o;
}
TaskStore &TaskStore::instance(){ static TaskStore s; return s; }
QString TaskStore::create(const QString &url, const QString &script){
    TaskRecord r; r.id=QUuid::createUuid().toString(QUuid::WithoutBraces).left(8);
    r.url=url; r.script=script; r.status="queued";
    r.createdAt=r.updatedAt=QDateTime::currentMSecsSinceEpoch();
    QMutexLocker l(&m_); tasks_.insert(r.id,r);
    if(useDb_){
        QSqlQuery q(db_); q.prepare("INSERT INTO tasks(id,url,status,result,script,createdAt,updatedAt) VALUES(?,?,?,?,?,?,?)");
        q.addBindValue(r.id); q.addBindValue(r.url); q.addBindValue(r.status);
        q.addBindValue(r.result); q.addBindValue(r.script); q.addBindValue(r.createdAt); q.addBindValue(r.updatedAt); q.exec();
    }
    return r.id;
}
bool TaskStore::updateStatus(const QString &id, const QString &status, const QString &result){
    QMutexLocker l(&m_); auto it=tasks_.find(id); if(it==tasks_.end()) return false;
    it->status=status; if(!result.isEmpty()) it->result=result;
    it->updatedAt=QDateTime::currentMSecsSinceEpoch();
    if(useDb_){
        QSqlQuery q(db_); q.prepare("UPDATE tasks SET status=?, result=?, updatedAt=? WHERE id=?");
        q.addBindValue(status); q.addBindValue(it->result); q.addBindValue(it->updatedAt); q.addBindValue(id); q.exec();
    }
    return true;
}
bool TaskStore::remove(const QString &id){
    QMutexLocker l(&m_); if(!tasks_.contains(id)) return false; tasks_.remove(id);
    if(useDb_){ QSqlQuery q(db_); q.prepare("DELETE FROM tasks WHERE id=?"); q.addBindValue(id); q.exec(); }
    return true;
}
TaskRecord TaskStore::get(const QString &id) const { QMutexLocker l(&m_); return tasks_.value(id); }
QList<TaskRecord> TaskStore::list() const { QMutexLocker l(&m_); return tasks_.values(); }
int TaskStore::count() const { QMutexLocker l(&m_); return tasks_.size(); }
bool TaskStore::openSqlite(const QString &dbPath){
    db_=QSqlDatabase::addDatabase("QSQLITE","taskstore");
    db_.setDatabaseName(dbPath); if(!db_.open()) return false;
    useDb_=true; ensureTable();
    QSqlQuery q(db_); q.exec("SELECT id,url,status,result,script,createdAt,updatedAt FROM tasks");
    while(q.next()){
        TaskRecord r; r.id=q.value(0).toString(); r.url=q.value(1).toString();
        r.status=q.value(2).toString(); r.result=q.value(3).toString();
        r.script=q.value(4).toString(); r.createdAt=q.value(5).toLongLong(); r.updatedAt=q.value(6).toLongLong();
        tasks_.insert(r.id,r);
    }
    return true;
}
void TaskStore::ensureTable(){
    QSqlQuery q(db_); q.exec("CREATE TABLE IF NOT EXISTS tasks(id TEXT PRIMARY KEY, url TEXT, status TEXT, result TEXT, script TEXT, createdAt INTEGER, updatedAt INTEGER)");
}
