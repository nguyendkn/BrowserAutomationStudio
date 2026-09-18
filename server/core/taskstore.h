#pragma once
#include <QObject>
#include <QJsonObject>
#include <QJsonArray>
#include <QHash>
#include <QMutex>
#include <QString>
struct TaskRecord {
    QString id;
    QString url;
    QString status;
    QString result;
    qint64 createdAt = 0;
    qint64 updatedAt = 0;
    QJsonObject toJson() const;
};
class TaskStore : public QObject {
    Q_OBJECT
public:
    static TaskStore &instance();
    QString create(const QString &url);
    bool updateStatus(const QString &id, const QString &status, const QString &result = {});
    TaskRecord get(const QString &id) const;
    QList<TaskRecord> list() const;
    int count() const;
private:
    explicit TaskStore(QObject *p = nullptr) : QObject(p) {}
    mutable QMutex m_;
    QHash<QString, TaskRecord> tasks_;
};
