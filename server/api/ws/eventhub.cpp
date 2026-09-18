#include "eventhub.h"
EventHub &EventHub::instance(){ static EventHub s; return s; }
void EventHub::start(quint16 port){
    if(srv) return;
    srv=new QWebSocketServer("BAS-Events",QWebSocketServer::NonSecureMode,this);
    if(srv->listen(QHostAddress::Any,port))
        QObject::connect(srv,&QWebSocketServer::newConnection,this,&EventHub::onNewConnection);
}
void EventHub::onNewConnection(){
    auto *c=srv->nextPendingConnection();
    clients.append(c);
    QObject::connect(c,&QWebSocket::disconnected,[this,c]{clients.removeAll(c);c->deleteLater();});
    c->sendTextMessage(QStringLiteral("{\"event\":\"connected\"}"));
}
void EventHub::broadcast(const QByteArray &msg){
    for(auto *c: clients) c->sendTextMessage(QString::fromUtf8(msg));
}
