#ifndef PCAPDNSLISTENSERVER_H
#define PCAPDNSLISTENSERVER_H

#include <QObject>
#include <QTcpServer>
#include <QMap>
#include <QString>


class PcapDNSListenServer : public QObject
{
    Q_OBJECT
    QTcpServer *Server;
    //QMap<QString,unsigned int>Ids;
    unsigned int Id = 0;
    bool Started = false;
public:
    explicit PcapDNSListenServer(QObject *parent = 0);

signals:
public slots:
    void Start();

private slots:
    void NewConnection();
    void ReadyRead();
};

#endif // PCAPDNSLISTENSERVER_H
