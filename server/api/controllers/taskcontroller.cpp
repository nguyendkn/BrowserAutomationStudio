#include "taskcontroller.h"
#include "taskstore.h"
#include "runstore.h"
#include "ws/eventhub.h"
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QTimer>

void TaskController::handle(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp){
    QString path=QString::fromUtf8(req.getPath());
    QString method=QString::fromUtf8(req.getMethod()).toUpper();
    if(path.startsWith("/api")) path=path.mid(4);
    resp.setHeader("Content-Type","application/json");

    // POST /tasks
    if(method=="POST" && path=="/tasks"){
        QJsonDocument doc=QJsonDocument::fromJson(req.getBody());
        auto obj=doc.object();
        QString url=obj.value("url").toString();
        QString script=obj.value("script").toString();
        if(url.isEmpty() && script.isEmpty()) url="https://example.com";
        QString id=TaskStore::instance().create(url, script);
        TaskRecord r=TaskStore::instance().get(id);
        EventHub::instance().broadcast(QJsonDocument(QJsonObject{{"event","task.created"},{"id",id}}).toJson());
        resp.setStatus(201,"Created");
        resp.write(QJsonDocument(r.toJson()).toJson(),true); return;
    }
    // GET /tasks
    if(method=="GET" && path=="/tasks"){
        QJsonArray arr; for(auto &t: TaskStore::instance().list()) arr.append(t.toJson());
        resp.write(QJsonDocument(QJsonObject{{"tasks",arr},{"count",arr.size()}}).toJson(),true); return;
    }
    // /tasks/:id  and /tasks/:id/run
    if(path.startsWith("/tasks/")){
        QString rest=path.mid(QString("/tasks/").size());
        QStringList parts=rest.split("/", Qt::SkipEmptyParts);
        QString id=parts.value(0).split("?").first();
        // POST /tasks/:id/run
        if(parts.size()>=2 && parts[1]=="run" && method=="POST"){
            TaskRecord r=TaskStore::instance().get(id);
            if(r.id.isEmpty()){resp.setStatus(404,"Not Found");resp.write(QJsonDocument(QJsonObject{{"error","task not found"}}).toJson(),true);return;}
            TaskStore::instance().updateStatus(id, "running");
            QString runId=RunStore::instance().create(id);
            EventHub::instance().broadcast(QJsonDocument(QJsonObject{{"event","task.running"},{"id",id},{"runId",runId}}).toJson());
            // simulate async completion after short delay (real worker would pick up)
            QTimer::singleShot(800, [id, runId](){
                TaskStore::instance().updateStatus(id, "done", "ok");
                RunStore::instance().finish(runId, "done", "completed");
                EventHub::instance().broadcast(QJsonDocument(QJsonObject{{"event","task.done"},{"id",id},{"runId",runId}}).toJson());
            });
            RunRecord run=RunStore::instance().get(runId);
            resp.setStatus(201,"Created");
            resp.write(QJsonDocument(run.toJson()).toJson(),true); return;
        }
        // /tasks/:id/runs
        if(parts.size()>=2 && parts[1]=="runs" && method=="GET"){
            QList<RunRecord> runs=RunStore::instance().listForTask(id);
            QJsonArray arr; for(auto &rr: runs) arr.append(rr.toJson());
            resp.write(QJsonDocument(QJsonObject{{"runs",arr},{"count",arr.size()}}).toJson(),true); return;
        }
        // GET /tasks/:id
        if(method=="GET" && parts.size()==1){
            TaskRecord r=TaskStore::instance().get(id);
            if(r.id.isEmpty()){resp.setStatus(404,"Not Found");resp.write(QJsonDocument(QJsonObject{{"error","task not found"}}).toJson(),true);return;}
            resp.write(QJsonDocument(r.toJson()).toJson(),true);return;
        }
        // PUT /tasks/:id
        if(method=="PUT" && parts.size()==1){
            TaskRecord r=TaskStore::instance().get(id);
            if(r.id.isEmpty()){resp.setStatus(404,"Not Found");resp.write(QJsonDocument(QJsonObject{{"error","task not found"}}).toJson(),true);return;}
            QJsonDocument doc=QJsonDocument::fromJson(req.getBody());
            auto obj=doc.object();
            QString status=obj.value("status").toString();
            QString result=obj.value("result").toString();
            if(!status.isEmpty()) TaskStore::instance().updateStatus(id, status, result);
            TaskRecord nr=TaskStore::instance().get(id);
            EventHub::instance().broadcast(QJsonDocument(QJsonObject{{"event","task.updated"},{"id",id}}).toJson());
            resp.write(QJsonDocument(nr.toJson()).toJson(),true); return;
        }
        // DELETE /tasks/:id
        if(method=="DELETE" && parts.size()==1){
            if(!TaskStore::instance().remove(id)){resp.setStatus(404,"Not Found");resp.write(QJsonDocument(QJsonObject{{"error","task not found"}}).toJson(),true);return;}
            EventHub::instance().broadcast(QJsonDocument(QJsonObject{{"event","task.deleted"},{"id",id}}).toJson());
            resp.write(QJsonDocument(QJsonObject{{"deleted",id}}).toJson(),true); return;
        }
    }
    resp.setStatus(404,"Not Found");
    resp.write(QJsonDocument(QJsonObject{{"error","not found"}}).toJson(),true);
}
