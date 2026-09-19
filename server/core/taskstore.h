#pragma once
#include <QObject>
#include <QJsonObject>
#include <QJsonArray>
#include <QHash>
#include <QMutex>
#include <QString>
#include <QSqlDatabase>

struct TaskRecord {
    QString id;
    QString url;
    QString status;
    QString result;
    QString script;
    qint64 createdAt = 0;
    qint64 updatedAt = 0;
    QJsonObject toJson() const;
};

class TaskStore : public QObject {
    Q_OBJECT
public:
    static TaskStore &instance();
    QString create(const QString &url, const QString &script = {});
    bool updateStatus(const QString &id, const QString &status, const QString &result = {});
    bool remove(const QString &id);
    TaskRecord get(const QString &id) const;
    QList<TaskRecord> list() const;
    int count() const;
    bool openSqlite(const QString &dbPath);
private:
    explicit TaskStore(QObject *p = nullptr) : QObject(p) {}
    mutable QMutex m_;
    QHash<QString, TaskRecord> tasks_;
    QSqlDatabase db_;
    bool useDb_ = false;
    void ensureTable();
};
