#pragma once
#include <QObject>
#include <QUrl>
#include <QJsonObject>

// Thin wrapper around ChromeWorker CDP via DevTools websocket.
// Phase 1: HTTP fallback (curl to CDP json), real WS in Phase 3+.
class DevToolsBridge : public QObject {
    Q_OBJECT
public:
    explicit DevToolsBridge(QObject *p=nullptr);
    void setEndpoint(const QString &wsUrl); // ws://127.0.0.1:9222/devtools/page/...
    bool navigate(const QString &url);
    bool evaluate(const QString &js, QString *resultJson = nullptr);
    bool screenshot(QByteArray *pngBase64 = nullptr);
    bool setHeaders(const QJsonObject &headers);
private:
    QString wsUrl_;
};
