#pragma once
#include <QObject>
#include <QProcess>
#include <QTimer>
#include <QHash>
#include <QMutex>

struct WorkerInfo {
    int id = 0;
    QString status; // idle | busy | offline
    qint64 pid = 0;
    QString lastTaskId;
};

class PoolManager : public QObject {
    Q_OBJECT
public:
    explicit PoolManager(QObject *p=nullptr);
    ~PoolManager();
    void setPoolSize(int n);
    void start();
    void stop();
    QList<WorkerInfo> workers() const;
    bool assignTask(const QString &taskId, const QString &url);
    int workerCount() const;
    int idleCount() const;

signals:
    void workerOutput(int workerId, QByteArray line);
    void taskDone(QString taskId, bool ok, QString result);

private slots:
    void onProcessFinished(int code, QProcess::ExitStatus st);
    void onReadyRead();

private:
    struct Entry { QProcess *proc=nullptr; WorkerInfo info; };
    QHash<int, Entry> pool_;
    int nextId_ = 1;
    int poolSize_ = 2;
    mutable QMutex m_;
    QString workerExePath() const;
};
