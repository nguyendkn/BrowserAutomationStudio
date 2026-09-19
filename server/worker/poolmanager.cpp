#include "poolmanager.h"
#include <QCoreApplication>
#include <QFileInfo>
#include <QDir>

PoolManager::PoolManager(QObject *p):QObject(p){}
PoolManager::~PoolManager(){ stop(); }

QString PoolManager::workerExePath() const {
    // In dev, optionally use BAS Worker (ChromeWorker) if available
    QString appDir=QCoreApplication::applicationDirPath();
    QString cand=QDir(appDir).filePath("../../build-probe/ChromeWorker/release/ChromeWorker.exe");
    if(QFileInfo::exists(cand)) return QDir::cleanPath(cand);
    return {};
}

void PoolManager::setPoolSize(int n){ poolSize_=qBound(0,n,16); }
void PoolManager::start(){
    QMutexLocker l(&m_);
    for(int i=(int)pool_.size(); i<poolSize_; ++i){
        int id=nextId_++;
        auto *proc=new QProcess(this);
        WorkerInfo info; info.id=id; info.status="idle";
        pool_.insert(id, {proc, info});
        connect(proc, QOverload<int,QProcess::ExitStatus>::of(&QProcess::finished), this, &PoolManager::onProcessFinished);
        connect(proc, &QProcess::readyReadStandardOutput, this, &PoolManager::onReadyRead);
        connect(proc, &QProcess::readyReadStandardError, this, &PoolManager::onReadyRead);
        // For now, workers are idle placeholders; real ChromeWorker spawn is opt-in via BAS_WORKER_EXE env
        QString exe=workerExePath();
        if(!exe.isEmpty() && qEnvironmentVariableIsSet("BAS_SPAWN_WORKER")){
            proc->start(exe, QStringList());
            if(proc->waitForStarted(1500)){
                pool_[id].info.pid=proc->processId();
                pool_[id].info.status="idle";
            }
        }
    }
}
void PoolManager::stop(){
    QMutexLocker l(&m_);
    for(auto &e: pool_){
        if(e.proc){
            e.proc->kill();
            e.proc->waitForFinished(1000);
            e.proc->deleteLater();
        }
    }
    pool_.clear();
}
QList<WorkerInfo> PoolManager::workers() const {
    QMutexLocker l(&m_); QList<WorkerInfo> out; for(auto &e: pool_) out.append(e.info); return out;
}
int PoolManager::workerCount() const { QMutexLocker l(&m_); return pool_.size(); }
int PoolManager::idleCount() const {
    QMutexLocker l(&m_); int c=0; for(auto &e: pool_) if(e.info.status=="idle") ++c; return c;
}
bool PoolManager::assignTask(const QString &taskId, const QString &url){
    Q_UNUSED(url)
    QMutexLocker l(&m_);
    for(auto &e: pool_){
        if(e.info.status=="idle"){
            e.info.status="busy"; e.info.lastTaskId=taskId;
            // simulate async work; real impl would send via IpcChannel
            QTimer::singleShot(600, this, [this, taskId](){
                QMutexLocker ll(&m_);
                for(auto &ee: pool_) if(ee.info.lastTaskId==taskId){ ee.info.status="idle"; break; }
                emit taskDone(taskId, true, "ok");
            });
            return true;
        }
    }
    return false;
}
void PoolManager::onProcessFinished(int, QProcess::ExitStatus){
    auto *proc=qobject_cast<QProcess*>(sender()); if(!proc) return;
    for(auto it=pool_.begin(); it!=pool_.end(); ++it){
        if(it.value().proc==proc){ it.value().info.status="offline"; it.value().info.pid=0; break; }
    }
}
void PoolManager::onReadyRead(){
    auto *proc=qobject_cast<QProcess*>(sender()); if(!proc) return;
    QByteArray out=proc->readAllStandardOutput() + proc->readAllStandardError();
    for(auto &e: pool_) if(e.proc==proc){ emit workerOutput(e.info.id, out); break; }
}
