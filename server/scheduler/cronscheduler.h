#pragma once
#include <QObject>
#include <QTimer>
#include <QSqlDatabase>

class CronScheduler : public QObject {
    Q_OBJECT
public:
    explicit CronScheduler(QObject *p=nullptr);
    void setApiBase(const QString &base){ apiBase_=base; }
    void setIntervalMs(int ms){ timer_.setInterval(ms); }
    void start();
    void stop();
signals:
    void ticked(int enqueued);
private slots:
    void tick();
private:
    QTimer timer_;
    QString apiBase_ = "http://127.0.0.1:18080";
    QString dbPath_;
    bool ensureDb();
};
