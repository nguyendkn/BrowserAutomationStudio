#include "taskcontroller.h"
#include "taskstore.h"
#include "ws/eventhub.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
void TaskController::handle(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp){
    QString path=QString::fromUtf8(req.getPath());
    QString method=QString::fromUtf8(req.getMethod()).toUpper();
    if(path.startsWith("/api")) path=path.mid(4);
    resp.setHeader("Content-Type","application/json");
    if(method=="POST" && path=="/tasks"){
        QJsonDocument doc=QJsonDocument::fromJson(req.getBody());
        QString url=doc.object().value("url").toString();
        if(url.isEmpty()) url="https://example.com";
        QString id=TaskStore::instance().create(url);
        TaskRecord r=TaskStore::instance().get(id);
        EventHub::instance().broadcast(QJsonDocument(QJsonObject{{"event","task.created"},{"id",id}}).toJson());
        resp.setStatus(201,"Created");
        resp.write(QJsonDocument(r.toJson()).toJson(),true); return;
    }
    if(method=="GET" && path=="/tasks"){
        QJsonArray arr; for(auto &t: TaskStore::instance().list()) arr.append(t.toJson());
        resp.write(QJsonDocument(QJsonObject{{"tasks",arr},{"count",arr.size()}}).toJson(),true); return;
    }
    if(path.startsWith("/tasks/")){
        QString id=path.mid(QString("/tasks/").size()).split("/").first().split("?").first();
        if(method=="GET"){
            TaskRecord r=TaskStore::instance().get(id);
            if(r.id.isEmpty()){resp.setStatus(404,"Not Found");resp.write(QJsonDocument(QJsonObject{{"error","task not found"}}).toJson(),true);return;}
            resp.write(QJsonDocument(r.toJson()).toJson(),true);return;
        }
    }
    resp.setStatus(404,"Not Found");
    resp.write(QJsonDocument(QJsonObject{{"error","not found"}}).toJson(),true);
}
