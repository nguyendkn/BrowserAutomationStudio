#pragma once
#include <QObject>
#include <QString>
class IpcChannel : public QObject {
    Q_OBJECT
public: explicit IpcChannel(QObject *p=nullptr):QObject(p){}
    virtual ~IpcChannel(){}
    virtual bool connectToWorker(int pid)=0;
    virtual bool send(const QByteArray &msg)=0;
signals: void messageReceived(QByteArray msg); void disconnected();
};
class PipeIpcChannel : public IpcChannel {
    Q_OBJECT
public: explicit PipeIpcChannel(QObject *p=nullptr):IpcChannel(p){}
    bool connectToWorker(int) override { return false; }
    bool send(const QByteArray &) override { return false; }
};
