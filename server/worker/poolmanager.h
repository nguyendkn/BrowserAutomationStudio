#pragma once
#include <QObject>
class PoolManager : public QObject{ Q_OBJECT
public: explicit PoolManager(QObject*p=nullptr):QObject(p){}
    int workerCount() const { return 0; }
};
