#pragma once
#include "httprequest.h"
#include "httpresponse.h"
class HealthController{ public: static void handle(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp); };
