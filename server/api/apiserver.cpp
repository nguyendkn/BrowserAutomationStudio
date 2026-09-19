#include "apiserver.h"
#include "controllers/healthcontroller.h"
#include "controllers/taskcontroller.h"
#include "auth/authfilter.h"
#include "runstore.h"
#include <QCoreApplication>
#include <QDir>
#include <QFile>
#include <QFileInfo>
#include <QMimeDatabase>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
ApiServer::ApiServer(QObject *p): HttpRequestHandler(p){}
void ApiServer::service(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp){
    QString path=QString::fromUtf8(req.getPath());
    QString method=QString::fromUtf8(req.getMethod()).toUpper();
    resp.setHeader("Access-Control-Allow-Origin","*");
    resp.setHeader("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTIONS");
    resp.setHeader("Access-Control-Allow-Headers","Content-Type, Authorization");
    if(method=="OPTIONS"){resp.setStatus(204,"No Content");resp.write("",true);return;}
    if(!AuthFilter::check(req,resp)) return;
    if(path=="/health"||path=="/api/health"){HealthController::handle(req,resp);return;}
    if(path.startsWith("/api/tasks")||path.startsWith("/tasks")){TaskController::handle(req,resp);return;}
    if(path.startsWith("/api/workers")||path.startsWith("/workers")){
        resp.setHeader("Content-Type","application/json");
        QJsonArray arr;
        // workers are managed by basworker process; API reports empty when worker not embedded
        // If BAS_WORKER_API env is set, could proxy. For now return pool placeholder.
        resp.write(QJsonDocument(QJsonObject{{"workers",arr},{"count",arr.size()}}).toJson(),true);return;
    }
    if(path.startsWith("/api/runs")||path.startsWith("/runs")){
        QString p2=path; if(p2.startsWith("/api")) p2=p2.mid(4);
        if(p2.startsWith("/runs/")){
            QString id=p2.mid(QString("/runs/").size()).split("/").first().split("?").first();
            RunRecord r=RunStore::instance().get(id);
            resp.setHeader("Content-Type","application/json");
            if(r.id.isEmpty()){resp.setStatus(404,"Not Found");resp.write(QJsonDocument(QJsonObject{{"error","run not found"}}).toJson(),true);return;}
            resp.write(QJsonDocument(r.toJson()).toJson(),true);return;
        }
        resp.setHeader("Content-Type","application/json");
        QJsonArray arr; for(auto &r: RunStore::instance().listAll()) arr.append(r.toJson());
        resp.write(QJsonDocument(QJsonObject{{"runs",arr},{"count",arr.size()}}).toJson(),true);return;
    }
    // Dashboard: / -> /dashboard/index.html
    if(path=="/" || path=="/dashboard" || path=="/dashboard/" || path.startsWith("/dashboard/")){
        QString rel = path;
        if(rel=="/") rel="/dashboard/index.html";
        else if(rel=="/dashboard" || rel=="/dashboard/") rel="/dashboard/index.html";
        // rel is /dashboard/... -> strip prefix
        QString fileRel = rel.mid(QString("/dashboard").size());
        if(fileRel.isEmpty()) fileRel="/index.html";
        // Search for server/dashboard from exe dir upwards
        QString found;
        QDir cur(QCoreApplication::applicationDirPath());
        for(int i=0;i<6;i++){
            QString cand = cur.filePath("server/dashboard" + fileRel);
            if(QFileInfo::exists(cand)){ found=cand; break; }
            QString cand2 = cur.filePath("dashboard" + fileRel);
            if(QFileInfo::exists(cand2)){ found=cand2; break; }
            // also when running from repo root: server/dashboard is direct
            if(!cur.cdUp()) break;
        }
        if(!found.isEmpty()){
            QFile f(found);
            if(f.open(QIODevice::ReadOnly)){
                QByteArray data=f.readAll();
                QString mime="text/html; charset=utf-8";
                if(found.endsWith(".js")) mime="application/javascript";
                else if(found.endsWith(".css")) mime="text/css";
                else if(found.endsWith(".json")) mime="application/json";
                else if(found.endsWith(".png")) mime="image/png";
                resp.setHeader("Content-Type", mime.toUtf8());
                resp.setHeader("Cache-Control","no-cache");
                resp.write(data, true); return;
            }
        }
        if(rel=="/dashboard/index.html"){
            resp.setHeader("Content-Type","text/html; charset=utf-8");
            resp.write(QByteArray("<html><body><h3>Dashboard not found</h3><p>Missing server/dashboard/index.html</p></body></html>"), true); return;
        }
    }
    resp.setStatus(404,"Not Found");
    resp.setHeader("Content-Type","application/json");
    resp.write(QJsonDocument(QJsonObject{{"error","not found"},{"path",path}}).toJson(),true);
}
