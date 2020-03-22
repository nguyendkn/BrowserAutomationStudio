#ifndef PROCESSDELETER_H
#define PROCESSDELETER_H

#include <QObject>
#include <QProcess>
#include <QTimer>

class ProcessDeleter : public QObject
{
    Q_OBJECT
    QProcess * Process;
public:
    explicit ProcessDeleter(QObject *parent = 0);
    void Start(QProcess * Process);
public slots:
    void Timer();
};

#endif // PROCESSDELETER_H
