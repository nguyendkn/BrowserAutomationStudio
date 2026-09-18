#include "healthcontroller.h"
#include "version.h"
#include <QJsonDocument>
#include <QJsonObject>
void HealthController::handle(stefanfrings::HttpRequest&, stefanfrings::HttpResponse &resp){
    QJsonObject o{{"status","ok"},{"name",BAS_SERVER_NAME},{"version",BAS_SERVER_VERSION}};
    resp.setHeader("Content-Type","application/json");
    resp.write(QJsonDocument(o).toJson(),true);
}
