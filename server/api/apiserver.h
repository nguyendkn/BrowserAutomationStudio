#pragma once
#include <QObject>
#include "httplistener.h"
#include "httprequesthandler.h"
class ApiServer : public stefanfrings::HttpRequestHandler {
    Q_OBJECT
public:
    explicit ApiServer(QObject *p=nullptr);
    void service(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp) override;
};
