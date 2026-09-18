#pragma once
#include "httprequest.h"
#include "httpresponse.h"
class AuthFilter{ public: static bool check(stefanfrings::HttpRequest &req, stefanfrings::HttpResponse &resp); };
