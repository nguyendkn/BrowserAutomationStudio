#include "apiserver.h"
#include "controllers/healthcontroller.h"
#include "controllers/taskcontroller.h"
#include "auth/authfilter.h"
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
        resp.write(QJsonDocument(QJsonObject{{"workers",QJsonArray()}}).toJson(),true);return;
    }
    if(path.startsWith("/api/runs")||path.startsWith("/runs")){
        resp.setHeader("Content-Type","application/json");
        resp.write(QJsonDocument(QJsonObject{{"runs",QJsonArray()}}).toJson(),true);return;
    }
    resp.setStatus(404,"Not Found");
    resp.setHeader("Content-Type","application/json");
    resp.write(QJsonDocument(QJsonObject{{"error","not found"},{"path",path}}).toJson(),true);
}
