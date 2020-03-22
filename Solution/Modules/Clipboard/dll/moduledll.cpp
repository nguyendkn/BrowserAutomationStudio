#include "moduledll.h"
#include <QClipboard>
#include <QVariantMap>
#include <QApplication>
#include <QMimeData>
#include <QJsonObject>
#include <QJsonParseError>
#include <QJsonDocument>

extern "C" {

    void* StartDll()
    {
        return 0;
    }

    void EndDll(void * DllData)
    {

    }

    void* StartThread()
    {
        return 0;
    }

    void EndThread(void * DllData)
    {

    }

    void ClipboardGetClipboard(char *InputJson, ResizeFunction AllocateSpace, void* AllocateData, void* DllData, void* ThreadData, unsigned int ThreadId, bool *NeedToStop, bool* WasError)
    {
        QJsonDocument InputObject;
        QJsonParseError err;
        InputObject = QJsonDocument::fromJson(QByteArray(InputJson),&err);
        if(err.error)
            return;

        if(!InputObject.object().contains("base64"))
            return;

        if(!InputObject.object().contains("mime"))
            return;

        bool IsBase64 = InputObject.object()["base64"].toBool();
        QString Mime = InputObject.object()["mime"].toString();


        QClipboard *clipboard = QApplication::clipboard();
        const QMimeData *mimeData = clipboard->mimeData();

        QByteArray ResArray = mimeData->data(Mime);
        if(IsBase64)
            ResArray = ResArray.toBase64();
        char * ResMemory = AllocateSpace(ResArray.size(),AllocateData);

        memcpy(ResMemory, ResArray.data(), ResArray.size());

    }

    void ClipboardSetClipboard(char *InputJson, ResizeFunction AllocateSpace, void* AllocateData, void* DllData, void* ThreadData, unsigned int ThreadId, bool *NeedToStop, bool* WasError)
    {
        QJsonDocument InputObject;
        QJsonParseError err;
        InputObject = QJsonDocument::fromJson(QByteArray(InputJson),&err);
        if(err.error)
            return;

        if(!InputObject.object().contains("base64"))
            return;

        if(!InputObject.object().contains("mime"))
            return;

        if(!InputObject.object().contains("data"))
            return;

        bool IsBase64 = InputObject.object()["base64"].toBool();
        QString Mime = InputObject.object()["mime"].toString();
        QString DataStr = InputObject.object()["data"].toString();



        QClipboard *clipboard = QApplication::clipboard();
        QMimeData *mimeData = new QMimeData();

        QByteArray Data;
        if(IsBase64)
        {
            Data = QByteArray::fromBase64(DataStr.toUtf8());
        }else
        {
            Data = DataStr.toUtf8();
        }

        mimeData->setData(Mime,Data);
        clipboard->setMimeData(mimeData);

    }


}
