#pragma once
#include <QObject>
#include <QWebSocketServer>
#include <QWebSocket>
#include <QList>
class EventHub : public QObject {
    Q_OBJECT
public: static EventHub &instance();
    void start(quint16 port);
    void broadcast(const QByteArray &msg);
private: explicit EventHub(QObject *p=nullptr):QObject(p),srv(nullptr){}
    QWebSocketServer *srv=nullptr; QList<QWebSocket*> clients;
private slots: void onNewConnection();
};
