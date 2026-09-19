#pragma once
#include "httprequest.h"
#include "httpresponse.h"
#include <QTimer>
class TaskController{ public: static void handle(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp); };
