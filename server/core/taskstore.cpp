#include "taskstore.h"
#include <QDateTime>
#include <QUuid>
QJsonObject TaskRecord::toJson() const {
    QJsonObject o; o["id"]=id; o["url"]=url; o["status"]=status;
    o["result"]=result; o["createdAt"]=createdAt; o["updatedAt"]=updatedAt; return o;
}
TaskStore &TaskStore::instance(){ static TaskStore s; return s; }
QString TaskStore::create(const QString &url){
    TaskRecord r; r.id=QUuid::createUuid().toString(QUuid::WithoutBraces).left(8);
    r.url=url; r.status="queued"; r.createdAt=r.updatedAt=QDateTime::currentMSecsSinceEpoch();
    QMutexLocker l(&m_); tasks_.insert(r.id,r); return r.id;
}
bool TaskStore::updateStatus(const QString &id, const QString &status, const QString &result){
    QMutexLocker l(&m_); auto it=tasks_.find(id); if(it==tasks_.end()) return false;
    it->status=status; if(!result.isEmpty()) it->result=result;
    it->updatedAt=QDateTime::currentMSecsSinceEpoch(); return true;
}
TaskRecord TaskStore::get(const QString &id) const { QMutexLocker l(&m_); return tasks_.value(id); }
QList<TaskRecord> TaskStore::list() const { QMutexLocker l(&m_); return tasks_.values(); }
int TaskStore::count() const { QMutexLocker l(&m_); return tasks_.size(); }
