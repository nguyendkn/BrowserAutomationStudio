#ifndef RESUMEDOWNLOADER_H
#define RESUMEDOWNLOADER_H

#include <QObject>
#include "ihttpclient.h"

class ResumeDownloader : public QObject
{
    Q_OBJECT
    IHttpClient *Client = 0;
    qint64 ChunkSize = 10485760;
    int RetryCount = 10;
    int RetryInterval = 10000;
    bool _WasError = false;
    QString _LastError;
    QString Url;
    QString MetaUrl;

    bool IsMeta = false;
    qint64 TotalSize = 0;
    QStringList Chunks;
    QString Checksum;
    QString AlternativeUrl;

    QList<QByteArray> ResultChunks;
    qint64 CurrentDownloadPosition = 0;
    qint64 CurrentRetryCount = 0;
    qint64 CurrentChunkIndex = 0;


public:
    explicit ResumeDownloader(QObject *parent = nullptr);
    void Init(IHttpClient *Client, qint64 ChunkSize = 10485760 /* 10mb */, int RetryCount = 100, int RetryInterval = 2000);
    void Get(const QString &Url);

    bool WasError();
    QString GetErrorString();
    QByteArray GetPageData();

private slots:
    void DownloadMetaResult();
    void StartDownloadNextChunk();
    void DownloadNextChunk();
    void FinishDownloadNextChunk();
    void DownloadProgressSlot(qint64 BytesReceived, qint64 BytesTotal);
    void TotalSizeResult();

signals:
    void Finished();
    void Log(QString);
    void DownloadProgress(qint64 BytesReceived, qint64 BytesTotal);

};

#endif // RESUMEDOWNLOADER_H
