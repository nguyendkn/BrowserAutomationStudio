#include "devtoolsbridge.h"
#include <QNetworkAccessManager>
#include <QNetworkRequest>
#include <QEventLoop>
#include <QJsonDocument>

DevToolsBridge::DevToolsBridge(QObject *p):QObject(p){}
void DevToolsBridge::setEndpoint(const QString &wsUrl){ wsUrl_=wsUrl; }
bool DevToolsBridge::navigate(const QString &url){ Q_UNUSED(url) return !wsUrl_.isEmpty(); }
bool DevToolsBridge::evaluate(const QString &js, QString *out){ Q_UNUSED(js) if(out) *out="{}"; return !wsUrl_.isEmpty(); }
bool DevToolsBridge::screenshot(QByteArray *out){ if(out) *out=""; return !wsUrl_.isEmpty(); }
bool DevToolsBridge::setHeaders(const QJsonObject &h){ Q_UNUSED(h) return !wsUrl_.isEmpty(); }
