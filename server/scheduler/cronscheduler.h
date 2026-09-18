#pragma once
#include <QObject>
#include <QTimer>
class CronScheduler : public QObject{ Q_OBJECT
public: explicit CronScheduler(QObject*p=nullptr):QObject(p){t.setInterval(60000);connect(&t,&QTimer::timeout,this,&CronScheduler::tick);} void start(){t.start();}
private slots: void tick(){}
private: QTimer t;
};
