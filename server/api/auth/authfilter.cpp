#include "authfilter.h"
#include <QProcessEnvironment>
#include <QJsonDocument>
#include <QJsonObject>
bool AuthFilter::check(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp){
    QString token=QProcessEnvironment::systemEnvironment().value("BAS_SERVER_TOKEN");
    if(token.isEmpty()) return true;
    QString auth=QString::fromUtf8(req.getHeader("Authorization"));
    if(auth==QString("Bearer ")+token) return true;
    QString path=QString::fromUtf8(req.getPath());
    if(path.endsWith("/health")) return true;
    resp.setStatus(401,"Unauthorized");
    resp.setHeader("Content-Type","application/json");
    resp.write(QJsonDocument(QJsonObject{{"error","unauthorized"}}).toJson(),true);
    return false;
}
