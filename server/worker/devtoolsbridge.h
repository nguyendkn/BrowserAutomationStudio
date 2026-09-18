#pragma once
#include <QObject>
class DevToolsBridge : public QObject{ Q_OBJECT
public: explicit DevToolsBridge(QObject*p=nullptr):QObject(p){}
};
