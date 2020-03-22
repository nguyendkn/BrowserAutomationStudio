#include "processdeleter.h"
#include <windows.h>

ProcessDeleter::ProcessDeleter(QObject *parent) : QObject(parent)
{
    Process = 0;
}

void ProcessDeleter::Start(QProcess * Process)
{
    Process->setParent(0);
    this->Process = Process;
    QTimer::singleShot(5000, this, SLOT(Timer()));
}

void ProcessDeleter::Timer()
{
    if(Process)
    {
        Process->kill();
        Process->deleteLater();
    }
    deleteLater();
}
