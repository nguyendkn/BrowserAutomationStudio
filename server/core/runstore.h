#pragma once
#include <QObject>
#include <QJsonObject>
#include <QHash>
#include <QMutex>
#include <QSqlDatabase>

struct RunRecord {
    QString id;
    QString taskId;
    QString status;
    qint64 startedAt = 0;
    qint64 finishedAt = 0;
    QString log;
    QJsonObject toJson() const;
};

class RunStore : public QObject {
    Q_OBJECT
public:
    static RunStore &instance();
    QString create(const QString &taskId);
    bool finish(const QString &id, const QString &status, const QString &log = {});
    RunRecord get(const QString &id) const;
    QList<RunRecord> listForTask(const QString &taskId) const;
    QList<RunRecord> listAll() const;
    bool openSqlite(const QString &dbPath);
private:
    explicit RunStore(QObject *p=nullptr):QObject(p){}
    mutable QMutex m_;
    QHash<QString, RunRecord> runs_;
    QSqlDatabase db_;
    bool useDb_ = false;
    void ensureTable();
};
