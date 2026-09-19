#include <QCoreApplication>
#include <QCommandLineParser>
#include <QTimer>
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QUrl>
#include "poolmanager.h"

int main(int argc,char*argv[]){
    QCoreApplication app(argc,argv);
    app.setApplicationName("BAS Worker");
    QCommandLineParser p; p.addHelpOption();
    QCommandLineOption apiOpt("api","API base url","url","http://127.0.0.1:18080");
    QCommandLineOption poolOpt("pool","pool size","n","2");
    QCommandLineOption portOpt("port","health port (unused)","port","18081");
    p.addOption(apiOpt); p.addOption(poolOpt); p.addOption(portOpt);
    p.process(app);
    QString apiBase=p.value(apiOpt);
    int poolSize=p.value(poolOpt).toInt();
    PoolManager pool;
    pool.setPoolSize(poolSize);
    pool.start();
    qInfo("BAS Worker pool=%d api=%s", poolSize, qPrintable(apiBase));
    QObject::connect(&pool, &PoolManager::taskDone, [&](QString taskId, bool ok, QString result){
        Q_UNUSED(ok) Q_UNUSED(result)
        qInfo("worker task done %s", qPrintable(taskId));
    });
    // Poll API for queued tasks
    auto *nam=new QNetworkAccessManager(&app);
    QTimer poll; poll.setInterval(1500);
    QObject::connect(&poll, &QTimer::timeout, [&](){
        QNetworkRequest req{QUrl(apiBase + "/tasks")};
        auto *rep=nam->get(req);
        QObject::connect(rep, &QNetworkReply::finished, [rep, nam, apiBase, &pool](){
            rep->deleteLater();
            if(rep->error()!=QNetworkReply::NoError) return;
            auto doc=QJsonDocument::fromJson(rep->readAll());
            auto arr=doc.object().value("tasks").toArray();
            for(auto v: arr){
                auto o=v.toObject();
                if(o.value("status").toString()!="queued") continue;
                QString id=o.value("id").toString();
                QString url=o.value("url").toString();
                if(!pool.assignTask(id, url)) break;
                // mark running via API
                QJsonObject body{{"status","running"}};
                QNetworkRequest req2{QUrl(apiBase + "/tasks/" + id)};
                req2.setHeader(QNetworkRequest::ContentTypeHeader,"application/json");
                auto *rep2=nam->sendCustomRequest(req2,"PUT", QJsonDocument(body).toJson());
                QObject::connect(rep2,&QNetworkReply::finished,[rep2](){rep2->deleteLater();});
                // pool will emit taskDone -> mark done
            }
        });
    });
    QObject::connect(&pool, &PoolManager::taskDone, [&, nam, apiBase](QString taskId, bool ok, QString result){
        QJsonObject body{{"status", ok?"done":"failed"},{"result",result}};
        QNetworkRequest req{QUrl(apiBase + "/tasks/" + taskId)};
        req.setHeader(QNetworkRequest::ContentTypeHeader,"application/json");
        auto *rep=nam->sendCustomRequest(req,"PUT", QJsonDocument(body).toJson());
        QObject::connect(rep,&QNetworkReply::finished,[rep](){rep->deleteLater();});
    });
    poll.start();
    return app.exec();
}
