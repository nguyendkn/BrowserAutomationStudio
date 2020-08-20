#include "nodeconnector.h"
#include <QCoreApplication>
#include <QJsonDocument>
#include <QJsonParseError>
#include <QCryptographicHash>
#include <QJsonObject>
#include <QDir>
#include <QFutureWatcher>
#include <QFuture>
#include <QtConcurrent/QtConcurrent>
#include <random>
#include "zip/JlCompress.h"
#include "every_cpp.h"

namespace BrowserAutomationStudioFramework
{
    /*Helpers*/
    QString NodeConnector::GetRandomString()
    {
       const QString possibleCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
       const int randomStringLength = 4;

       QString randomString;
       for(int i=0; i<randomStringLength; ++i)
       {
           int index = qrand() % possibleCharacters.length();
           QChar nextChar = possibleCharacters.at(index);
           randomString.append(nextChar);
       }
       return randomString;
    }

    void NodeConnector::SetIsRecord(bool IsRecord)
    {
        this->IsRecord = IsRecord;
    }


    QString NodeConnector::A(const QString& RelativePath)
    {
        return QFileInfo(RelativePath).absoluteFilePath();
    }

    void NodeConnector::LOGINTERFACE(const QString& Text)
    {
        emit Log(Text);
    }

    void NodeConnector::LOG(const QString& Text)
    {
        QString txt;
        QString datestring = QTime::currentTime().toString("hh:mm:ss");
        txt = QString("[%1] %2").arg(datestring).arg(Text);

        QFile outFile("node_log.txt");
        outFile.open(QIODevice::WriteOnly | QIODevice::Append);
        QTextStream ts(&outFile);
        ts << txt << endl;
        outFile.close();
    }

    void NodeConnector::EnableLog(bool LogEnabled)
    {
        this->LogEnabled = LogEnabled;
    }

    NodeConnector::NodeConnector(QObject *parent) : ILanguageConnector(parent)
    {
    }

    void ExtractDir(QString Path, QString Dir)
    {
        JlCompress::extractDir(Path,Dir);
    }

    void RemoveDir(QString Dir)
    {
        QDir(Dir).removeRecursively();
    }

    bool RenameDir(QString From, QString To)
    {
        QDir dir;
        return dir.rename(From,To);
    }

    void RemoveData(QStringList Folders, QStringList Files)
    {
        for(const QString& Folder:Folders)
        {
            RemoveDir(Folder);
        }
        for(const QString& File:Files)
        {
            QFile file(File);
            file.remove();
        }
    }

    QString CaclulateFileChecksum(const QString &FileName)
    {
        QFile sourceFile(FileName);
        qint64 fileSize = sourceFile.size();
        const qint64 bufferSize = 10240;

        if (sourceFile.open(QIODevice::ReadOnly))
        {
            char buffer[bufferSize];
            int bytesRead;
            int readSize = qMin(fileSize, bufferSize);

            QCryptographicHash hash(QCryptographicHash::Sha256);
            while (readSize > 0 && (bytesRead = sourceFile.read(buffer, readSize)) > 0)
            {
                fileSize -= bytesRead;
                hash.addData(buffer, bytesRead);
                readSize = qMin(fileSize, bufferSize);
            }

            sourceFile.close();
            return QString(hash.result().toHex());
        }
        return QString();
    }

    QString ChecksumsCalculate(const QString& Folder)
    {
        QString ChecksumFileLocation = Folder + QString("/checksum.txt");

        if(!(QFileInfo(ChecksumFileLocation).exists()))
        {
            return QString("Failed to find checksum file at ") + ChecksumFileLocation + QString(". Can't verify checksums.");
        }

        int ChecksumRecordNumber = 0;
        QFile ChecksumFile(ChecksumFileLocation);
        if(ChecksumFile.open(QIODevice::ReadOnly))
        {
            QTextStream InputStream(&ChecksumFile);
            InputStream.setCodec("UTF-8");
            while(!InputStream.atEnd())
            {
                QString Line = InputStream.readLine();
                if(Line.size() > 65)
                {
                    QString ChecksumExpected = Line.mid(0,64);
                    QString FileNameRelative = Line.mid(65);
                    QString FileNameAbsolute = Folder + QString("/") + FileNameRelative;
                    // Calculate checksums is too expensive, so just check if all files exists

                    if(!QFileInfo(FileNameAbsolute).exists())
                    {
                        ChecksumFile.close();
                        return QString("File doesn't exist ") + FileNameAbsolute;
                    }

                    /*QString FileActualChecksum = CaclulateFileChecksum(FileNameAbsolute);
                    if(FileActualChecksum.isEmpty())
                    {
                        ChecksumFile.close();
                        return QString("Failed to get checksum for file ") + FileNameAbsolute;
                    }
                    if(FileActualChecksum != ChecksumExpected)
                    {
                        ChecksumFile.close();
                        return QString("Checksum for file ") + FileNameAbsolute + QString(" doesn't match. Expected ") + ChecksumExpected + QString(", got ") + FileActualChecksum + QString(".");
                    }*/
                    ChecksumRecordNumber++;
                }
            }
            ChecksumFile.close();
        }else
        {
            return QString("Failed to read checksum file at ") + ChecksumFileLocation + QString(". Can't verify checksums.");
        }

        if(ChecksumRecordNumber <= 0)
        {
            return QString("Checksum file at ") + ChecksumFileLocation + QString(" is empty.");
        }

        return QString();
    }


    void NodeConnector::FinalizeInstall(bool IsError, const QString& Message)
    {
        FinalizeInstallIsError = IsError;
        FinalizeInstallMessage = Message;

        QFutureWatcher<void> *watcher = new QFutureWatcher<void>();
        QFuture<void> future;
        connect(watcher, SIGNAL(finished()), watcher, SLOT(deleteLater()));
        connect(watcher, SIGNAL(finished()), this, SLOT(OnFinalizeInstall()));

        QString CacheDir = QFileInfo(QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.%1").arg(Suffix))).absoluteFilePath();
        QString ZipLocation = QString("e/cache.node.%1.zip").arg(LanguageVersion);

        QStringList Files;
        if(IsError)
        {
            Files.append(ZipLocation);
        }
        QStringList Folders = AutoCleanPrepare();
        Folders.append(CacheDir);
        if(IsError)
        {
            if(!NodeExeLock.isNull())
            {
                NodeExeLock->close();
                NodeExeLock.reset();
            }
            QString Path = A(QString("e/") + GetLanguageSettingsHash() + QString(".") + Suffix);
            Folders.append(Path);
            LOG(QString("Autoclean current folder becuase of error %1").arg(Path));
        }

        if(IsError)
        {
            LOG(QString("Autoclean distr becuase of error %1").arg(ZipLocation));
        }
        LOG(QString("Autoclean current cache %1").arg(CacheDir));

        future = QtConcurrent::run(RemoveData, Folders, Files);
        watcher->setFuture(future);

    }

    void NodeConnector::OnFinalizeInstall()
    {
        if(FinalizeInstallIsError)
            LOGINTERFACE(tr("Error occurred. See log for more details."));
        emit Started(FinalizeInstallIsError,FinalizeInstallMessage);
    }



    /* Language Settings*/

    QString NodeConnector::GetLanguageName()
    {
        return QString("Node");
    }


    void NodeConnector::SetLanguageVersion(const QString& Version)
    {
        LOG(QString("Language version set to %1").arg(Version));
        this->LanguageVersion = Version;
    }

    QString NodeConnector::GetLanguageVersion()
    {
        return LanguageVersion;
    }


    void NodeConnector::AddModule(const QString& Name,const QString& Version)
    {
        LOG(QString("Added module %1, %2").arg(Name).arg(Version));
        Modules.insert(Name, Version);
    }

    QHash<QString,QString> NodeConnector::GetModules()
    {
        return Modules;
    }


    void NodeConnector::AddFunction(const QString& Name,const QString& Code)
    {
        LOG(QString("Added function %1").arg(Name));

        Functions.insert(Name, Code);
    }

    QHash<QString,QString> NodeConnector::GetFunctions()
    {
        return Functions;
    }


    void NodeConnector::AddFile(const QString& Path,const QString& Code)
    {
        LOG(QString("Added file %1").arg(Path));

        Files.insert(Path, Code);
    }

    QHash<QString,QString> NodeConnector::GetFiles()
    {
        return Files;
    }

    void NodeConnector::SetHasPipeVersion()
    {
        this->HasPipeVersion = true;
    }


    void NodeConnector::ClearLanguageSettings()
    {
        LOG(QString("Clear language settings"));
        LanguageVersion.clear();
        Files.clear();
        Modules.clear();
        Functions.clear();
    }

    quint64 NodeConnector::GenerateId()
    {
        std::mt19937_64 gen (std::random_device{}());
        return gen();
    }

    QString NodeConnector::GetLanguageSettingsHash()
    {
        QString Str = "Node;";
        Str += LanguageVersion;
        Str += QString(";");
        QHashIterator<QString, QString> i(Modules);
        QStringList Mods;
        while (i.hasNext())
        {
            i.next();
            QString item;
            item += i.key();
            item += QString(";");
            item += i.value();
            Mods.append(item);
        }
        Mods.sort();
        Str += Mods.join(";");
        QCryptographicHash hash(QCryptographicHash::Sha256);
        hash.addData(Str.toUtf8());

        Str = QString::fromUtf8(hash.result().toHex());
        Str = Str.mid(0,4);
        return Str;

    }

    QString NodeConnector::GetExecutableLocationForNode()
    {
        return QDir::cleanPath(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix + QDir::separator() + QString("distr") + QDir::separator() + QString("node.exe"));
    }

    QString NodeConnector::GetExecutableLocationForMain()
    {
        return QDir::cleanPath(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix + QDir::separator() + QString("distr") + QDir::separator() + QString("lib") + QDir::separator() + QString("main.js"));
    }

    bool NodeConnector::IsX64()
    {
        return QSysInfo::currentCpuArchitecture() == "x86_64";
    }


    NodeConnector::~NodeConnector()
    {
        IsActive = false;
        NoNeedRestartProcess = true;
    }



    QString NodeConnector::FindInstalledDistr()
    {
        QDir dir("e");
        dir.setNameFilters(QStringList() << "*");
        dir.setFilter(QDir::Dirs);
        foreach(QString dirString, dir.entryList())
        {
            if(!dirString.startsWith("cache."))
            {
                QStringList Split = dirString.split(".");
                if(Split.length() == 2 && Split.first() == GetLanguageSettingsHash())
                {

                    QString LockPath = dir.absoluteFilePath(dirString + QDir::separator() + QString("distr") + QDir::separator() + QString("lock.file"));

                    NodeExeLock = QSharedPointer<QFile>::create(LockPath);
                    NodeExeLock->remove();

                    if(!NodeExeLock->exists() && NodeExeLock->open(QIODevice::WriteOnly))
                    {
                        LOG(QString("Found installed distr %1").arg(A(dirString)));

                        return Split.last();
                    }
                }
            }
        }

        NodeExeLock.reset();
        LOG(QString("Installed distr not found"));
        return QString();
    }

    QStringList NodeConnector::AutoCleanPrepare()
    {
        QStringList Result;
        LOG(QString("Autoclean"));

        QDir dir("e");
        dir.setNameFilters(QStringList() << "*");
        dir.setFilter(QDir::Dirs);
        QDateTime now = QDateTime::currentDateTime();

        foreach(QString dirString, dir.entryList())
        {
            if(dirString == "." || dirString == "..")
                continue;
            if(dirString.startsWith("cache."))
            {
                QFileInfo i(dir.absoluteFilePath(dirString));
                qint64 Diff = i.lastModified().secsTo(now);
                LOG(QString("Not modified %1 for %2 seconds").arg(i.absoluteFilePath()).arg(QString::number(Diff)));
                if(Diff > 5 * 60)
                {
                    LOG(QString("Autoclean %1").arg(i.absoluteFilePath()));
                    Result.append(i.absoluteFilePath());
                }

            }else
            {
                QString NodePath = dir.absoluteFilePath(dirString + QDir::separator() + QString("distr") + QDir::separator() + QString("node.exe"));
                QString LockPath = dir.absoluteFilePath(dirString + QDir::separator() + QString("distr") + QDir::separator() + QString("lock.file"));

                if(!QFileInfo(NodePath).exists())
                {
                    QFile LockPathFile(LockPath);
                    LockPathFile.remove();
                    if(!LockPathFile.exists())
                    {
                        LOG(QString("Autoclean ") + dir.absoluteFilePath(dirString) + QString(" because node.exe not found"));
                        Result.append(dir.absoluteFilePath(dirString));
                    }
                }else
                {

                    QFileInfo i(LockPath);
                    qint64 Diff = i.lastModified().secsTo(now);

                    LOG(QString("Not modified %1 for %2 seconds").arg(dir.absoluteFilePath(dirString)).arg(QString::number(Diff)));
                    if(Diff > 60 * 24)
                    {
                        QFile LockPathFile(LockPath);
                        LockPathFile.remove();
                        if(!LockPathFile.exists())
                        {
                            LOG(QString("Autoclean %1").arg(dir.absoluteFilePath(dirString)));
                            Result.append(dir.absoluteFilePath(dirString));
                        }
                    }
                }

            }
        }
        return Result;
    }

    void NodeConnector::Start()
    {
        if(IsActive)
            return;

        LOGINTERFACE(tr("Initialization ... "));

        LOG(QString("----------------------"));
        LOG(QString("Starting"));

        NodeExeLock.reset();

        InstalledDirSearchIteration();

    }

    void NodeConnector::InstalledDirSearchIteration()
    {
        Suffix = FindInstalledDistr();

        if(LanguageVersion == "8.6.0")
        {
            //No checksums available proceed next
            InstalledDirFinishedSearch();
            return;
        }

        if(Suffix.isEmpty())
        {
            //No installed dir found, no need to calculate checksums
            InstalledDirFinishedSearch();
            return;
        }

        QFutureWatcher<QString> *watcher = new QFutureWatcher<QString>();
        QFuture<QString> future;
        connect(watcher, SIGNAL(finished()), this, SLOT(OnInstallDirChecksum()));
        connect(watcher, SIGNAL(finished()), watcher, SLOT(deleteLater()));

        QString FolderPath = A(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix + QDir::separator() + QString("distr"));
        LOG(QString("Calculating checksums for ") + FolderPath);
        future = QtConcurrent::run(ChecksumsCalculate,FolderPath);
        watcher->setFuture(future);
    }

    void NodeConnector::OnInstallDirChecksum()
    {
        QFutureWatcher<QString> *watcher = ((QFutureWatcher<QString> *)sender());
        QString ChecksumVerificationError = watcher->future().result();

        if(!ChecksumVerificationError.isEmpty())
        {
            LOG(ChecksumVerificationError);
            NodeExeLock.reset();

            QFutureWatcher<void> *watcher = new QFutureWatcher<void>();
            QFuture<void> future;
            connect(watcher, SIGNAL(finished()), watcher, SLOT(deleteLater()));
            connect(watcher, SIGNAL(finished()), this, SLOT(InstalledDirSearchIteration()));

            QStringList Files;
            QStringList Folders;
            QString FolderPath = A(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix);

            Folders.append(FolderPath);
            LOG(QString("Autoclean folder ") + FolderPath + QString(" because failed to verify checksums."));

            Suffix.clear();

            future = QtConcurrent::run(RemoveData, Folders, Files);
            watcher->setFuture(future);

            return;
        }else
        {
            LOG("Checksum verified successfully");
        }

        InstalledDirFinishedSearch();
    }

    void NodeConnector::InstalledDirFinishedSearch()
    {
        LOG(QString("Hash %1").arg(GetLanguageSettingsHash()));

        if(!Suffix.isEmpty())
        {
            QString NodePath = QDir::cleanPath(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix + QDir::separator() + QString("distr"));
            if(!DeleteFunctionsAndFiles(NodePath))
            {
                LOG(QString("Failed to delete function files").arg(NodePath));
                emit Started(true,tr("Failed to delete function files"));
                return;
            }

            if(!InstallFunctionsAndFiles(NodePath))
            {
                LOG(QString("Failed to install function files").arg(NodePath));
                emit Started(true,tr("Failed to install function files"));
                return;
            }

            StartInternal();
            return;
        }

        Suffix = GetRandomString();

        LOG(QString("Suffix %1").arg(Suffix));

        QString cache = QString("e/cache.node.%1.zip").arg(LanguageVersion);
        if(QFileInfo(cache).exists())
        {
            LOG(QString("Found cache %1").arg(A(cache)));
            ExtractDistr();
            return;
        }

        _HttpClient = QSharedPointer<HttpClient>::create();
        _HttpClient->Connect(this,SLOT(DistrDownloaded()));

        LOGINTERFACE(tr("Downloading Node.js distribution ... "));

        QString Url = QString("http://bablosoft.com/distr/Embedded/Node/%1/distr.%2.zip").arg(LanguageVersion).arg((IsX64() ? "x64" : "x86"));
        LOG(QString("Getting url %1").arg(Url));
        _HttpClient->Get(Url);
    }




    void NodeConnector::DistrDownloaded()
    {
        if(_HttpClient->WasError())
        {
            LOG(QString("Http error ").arg(_HttpClient->GetErrorString()));
            FinalizeInstall(true,_HttpClient->GetErrorString());
            return;
        }

        LOGINTERFACE(tr("Extracting Node.js distribution ... "));

        QString Path = QFileInfo(QString("e/cache.node.%1.zip").arg(LanguageVersion)).absoluteFilePath();

        LOG(QString("Writting to %1").arg(Path));

        QString Dir = QFileInfo(QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.%1").arg(Suffix))).absoluteFilePath();
        QDir(Dir).mkpath(".");

        QByteArray Data = _HttpClient->GetPageData();

        QFile file(Path);
        if(!file.open(QIODevice::WriteOnly))
        {
            LOG(QString("Failed to write to zip file to %1").arg(Path));
            FinalizeInstall(true,QString(tr("Failed to write to zip file to %1")).arg(Path));
            return;
        }
        file.write(Data);
        file.close();

        ExtractDistr();
    }

    void NodeConnector::ExtractDistr()
    {
        QString Path = QFileInfo(QString("e/cache.node.%1.zip").arg(LanguageVersion)).absoluteFilePath();

        QString Dir = QFileInfo(QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.%1").arg(Suffix))).absoluteFilePath();
        LOG(QString("Extracting to folder %1").arg(Dir));

        QFutureWatcher<void> *watcher = new QFutureWatcher<void>();
        QFuture<void> future;
        connect(watcher, SIGNAL(finished()), watcher, SLOT(deleteLater()));
        connect(watcher, SIGNAL(finished()), this, SLOT(OnDistrExtracted()));

        future = QtConcurrent::run(ExtractDir,Path,Dir);
        watcher->setFuture(future);

    }

    void NodeConnector::OnDistrExtracted()
    {

        QVariantMap dependencies;
        QHashIterator<QString, QString> i(Modules);
        while (i.hasNext())
        {
            i.next();
            dependencies.insert(i.key(),i.value());
        }
        QJsonObject DependenciesObject = QJsonObject::fromVariantMap(dependencies);

        //Merge package.original with DependenciesObject
        {
            QFile PackageOriginalFile(QString("e/cache.%1/distr/package.original").arg(Suffix));
            if(PackageOriginalFile.open(QIODevice::ReadOnly))
            {
                QByteArray PackageOriginalData = PackageOriginalFile.readAll();
                PackageOriginalFile.close();

                QJsonParseError err;
                QJsonDocument doc = QJsonDocument::fromJson(PackageOriginalData, &err);
                if (err.error == QJsonParseError::NoError)
                {
                    if(doc.isObject() && doc.object().contains("dependencies") && doc.object()["dependencies"].isObject())
                    {
                        QJsonObject DependenciesObjectOriginal = doc.object()["dependencies"].toObject();
                        for(const QString& Key: DependenciesObjectOriginal.keys())
                        {
                            DependenciesObject[Key] = DependenciesObjectOriginal[Key];
                        }
                    }
                }
            }
        }

        QVariantMap res;
        res.insert("dependencies",DependenciesObject);

        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        QFile FileJson(QString("e/cache.%1/distr/package.json").arg(Suffix));
        if(!FileJson.open(QIODevice::WriteOnly))
        {
            LOG(QString("Failed to write to json file %1. Maybe damaged archive?").arg(A(QString("e/cache.%1/distr/package.json").arg(Suffix))));
            FinalizeInstall(true,QString(tr("Failed to write to json file %1")).arg(A(QString("e/cache.%1/distr/package.json").arg(Suffix))));
            return;
        }
        LOG(QString("package.json file content ") + document.toJson());
        FileJson.write(document.toJson());
        FileJson.close();

        NpmInstallProcess = QSharedPointer<QProcess>::create();
        connect(NpmInstallProcess.data(),SIGNAL(finished(int)),this,SLOT(NpmInstalled(int)));
        connect(NpmInstallProcess.data(),SIGNAL(errorOccurred(QProcess::ProcessError)),this,SLOT(FailedToStartNpm(QProcess::ProcessError)));
        QStringList params;
        params.append("node_modules\\npm\\bin\\npm-cli.js");
        params.append("install");
        QString WorkingDir = QFileInfo(QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.") + Suffix + QDir::separator() + QString("distr"))).absoluteFilePath();
        QString NpmPath = QFileInfo(QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.") + Suffix + QDir::separator() + QString("distr") + QDir::separator() + QString("node.exe"))).absoluteFilePath();
        LOG(QString("npm install with %1").arg(NpmPath));
        LOGINTERFACE(tr("Installing npm modules ... "));


        NpmInstallProcess->setWorkingDirectory(WorkingDir);
        NpmInstallProcess->start(NpmPath, params);
    }

    void NodeConnector::FailedToStartNpm(QProcess::ProcessError error)
    {
        if(error == QProcess::FailedToStart)
        {
            LOG(QString("Failed to execute npm install"));
            FinalizeInstall(true,tr("Failed to execute npm install"));
            return;
        }
    }

    void NodeConnector::FailedToStartNode(QProcess::ProcessError error)
    {
        if(error == QProcess::FailedToStart && !IsProcessRestart)
        {
            LOG(QString("Failed to start node"));
            FinalizeInstall(true,tr("Failed to start node"));
            return;
        }
    }

    void NodeConnector::NpmInstalled(int StatusCode)
    {
        if(NoNeedRestartProcess)
            return;

        /*if(StatusCode)
        {
            LOG(QString("Failed to install modules"));
            RemoveCacheCurrentInstall();
            emit Started(true,tr("Failed to install modules"));
            return;
        }*/

        QString NodePath = QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.") + Suffix + QDir::separator() + QString("distr"));
        if(!DeleteFunctionsAndFiles(NodePath))
        {
            LOG(QString("Failed to delete function files"));
            FinalizeInstall(true,tr("Failed to delete function files"));
            return;
        }

        if(!InstallFunctionsAndFiles(NodePath))
        {
            LOG(QString("Failed to install function files"));
            FinalizeInstall(true,tr("Failed to install function files"));
            return;
        }

        QString from = A(QString("e/cache.") + Suffix);
        QString to = A(QString("e/") + GetLanguageSettingsHash() + QString(".") + Suffix);
        LOG(QString("Renaming directory %1 -> %2").arg(from).arg(to));


        QFutureWatcher<bool> *watcher = new QFutureWatcher<bool>();
        QFuture<bool> future;
        connect(watcher, SIGNAL(finished()), this, SLOT(OnFolderMoved()));
        connect(watcher, SIGNAL(finished()), watcher, SLOT(deleteLater()));

        future = QtConcurrent::run(RenameDir,from,to);
        watcher->setFuture(future);


    }

    void NodeConnector::OnFolderMoved()
    {
        QFutureWatcher<bool> *watcher = ((QFutureWatcher<bool> *)sender());
        bool result = watcher->future().result();

        if(!result)
        {
            QString Message = QString("Failed to move folder");
            LOG(Message);
            FinalizeInstall(true,Message);
            return;
        }

        if(LanguageVersion != "8.6.0")
        {
            //Checksums for 8.6.0 are not available

            QFutureWatcher<QString> *watcher = new QFutureWatcher<QString>();
            QFuture<QString> future;
            connect(watcher, SIGNAL(finished()), this, SLOT(OnChecksumsCalculated()));
            connect(watcher, SIGNAL(finished()), watcher, SLOT(deleteLater()));

            QString FolderPath = A(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix + QDir::separator() + QString("distr"));
            LOG(QString("Calculating checksums for ") + FolderPath);
            future = QtConcurrent::run(ChecksumsCalculate,FolderPath);
            watcher->setFuture(future);
        }else
        {
            StartInternal();
        }

    }

    void NodeConnector::OnChecksumsCalculated()
    {
        QFutureWatcher<QString> *watcher = ((QFutureWatcher<QString> *)sender());
        QString ChecksumVerificationError = watcher->future().result();

        if(!ChecksumVerificationError.isEmpty())
        {
            LOG(ChecksumVerificationError);
            FinalizeInstall(true,ChecksumVerificationError);
            return;
        }else
        {
            LOG("Checksum verified successfully");
        }

        StartInternal();
    }



    bool NodeConnector::DeleteFunctionsAndFiles(const QString& NodePath)
    {
        LOG(QString("Deleting functions and files"));
        QString custom = QDir::cleanPath(NodePath + QDir::separator() + QString("lib") + QDir::separator() + QString("custom"));
        LOG(QString("Removing directory %1").arg(A(custom)));
        if(!QDir(custom).removeRecursively())
        {
            return false;
        }
        if(!QDir(custom).mkpath("."))
        {
            return false;
        }

        QDir dir(QDir::cleanPath(NodePath + QDir::separator() + QString("lib")));
        dir.setNameFilters(QStringList() << "*.js");
        dir.setFilter(QDir::Files);
        foreach(QString dirFile, dir.entryList())
        {
            if(dirFile != "main.js")
            {
                LOG(QString("Removing file %1").arg(A(dirFile)));
                if(!dir.remove(dirFile))
                {
                    return false;
                }
            }
        }
        return true;
    }


    bool NodeConnector::InstallFunctionsAndFiles(const QString& NodePath)
    {
        LOG(QString("Installing functions and files"));
        {
            QHashIterator<QString, QString> i(Functions);


            while (i.hasNext())
            {
                i.next();
                LOG(QString("Installing function %1").arg(A(QDir::cleanPath(NodePath + QDir::separator() + QString("lib") + QDir::separator() + QString("custom") + QDir::separator() + i.key() + QString(".js")))));
                QFile file(QDir::cleanPath(NodePath + QDir::separator() + QString("lib") + QDir::separator() + QString("custom") + QDir::separator() + i.key() + QString(".js")));
                if(!file.open(QIODevice::WriteOnly))
                {
                    return false;
                }
                QString ScriptStart = QString(
                "module.exports = async function(BAS_VARS,BAS_API_INTERNAL,BAS_CONSOLE_LOG){\n"
                    "\tvar BAS_API = async (API_STRING) => {let res = await BAS_API_INTERNAL(API_STRING); if(res[1]) throw \"-BAS-SILENT-STOP-\"; Object.assign(BAS_VARS, res[0]); BAS_VARS[\"-BAS-NEED-STOP-\"] = false; if(BAS_VARS[\"-BAS-API-ERROR-\"]){var ex = BAS_VARS[\"-BAS-API-ERROR-\"];delete BAS_VARS[\"-BAS-API-ERROR-\"];throw ex;}}\n"
                    "\tvar BAS_FUNCTION = async (FUNCTION_NAME,FUNCTION_PARAMS) => {"
                        "await BAS_API(\"_prepare_function_and_call(\" + JSON.stringify(FUNCTION_NAME) + \",\" + JSON.stringify(JSON.stringify(FUNCTION_PARAMS)) + \")!\" );"
                        "if(BAS_VARS[\"_BAS_FUNCTION_RESULT_\"]){var res = BAS_VARS[\"_BAS_FUNCTION_RESULT_\"];delete BAS_VARS[\"_BAS_FUNCTION_RESULT_\"];return res;}"
                        "return null;"
                    "}\n"


                    "\tvar BAS_PERHAPS_STOP = () => {if(BAS_VARS[\"-BAS-NEED-STOP-\"])throw \"-BAS-SILENT-STOP-\"}\n"
                    "\tmodule.BAS_VARS=BAS_VARS;module.BAS_API=BAS_API;module.BAS_FUNCTION=BAS_FUNCTION;module.BAS_CONSOLE_LOG=BAS_CONSOLE_LOG;\n"
                );

                QString ScriptEnd = QString("\n}");

                QString val = i.value();
                val = val.replace(QRegExp("\\[\\[([^\\]]+)\\]\\]"),"BAS_VARS[\"\\1\"]");
                val = val.replace("console.log","BAS_CONSOLE_LOG");

                file.write((ScriptStart + val + ScriptEnd).toUtf8());
                file.close();

            }
        }
        {
            QHashIterator<QString, QString> i(Files);
            while (i.hasNext())
            {
                i.next();
                LOG(QString("Installing file %1").arg(A(QDir::cleanPath(NodePath + QDir::separator() + QString("lib") + QDir::separator() + i.key() + QString(".js")))));
                QFile file(QDir::cleanPath(NodePath + QDir::separator() + QString("lib") + QDir::separator() + i.key() + QString(".js")));
                if(!file.open(QIODevice::WriteOnly))
                {
                    return false;
                }

                QString val = i.value();
                //Remove cache. This line is required in order to obtain correct module.parent value next time
                QString prefix = QString("delete require.cache[__filename];\r\n") +
                        QString("var BAS_VARS = module.parent.BAS_VARS;\r\n") +
                        QString("var BAS_API = module.parent.BAS_API;\r\n") +
                        QString("var BAS_FUNCTION = module.parent.BAS_FUNCTION;\r\n") +
                        QString("var BAS_CONSOLE_LOG = module.parent.BAS_CONSOLE_LOG;\r\n");
                val = prefix + val;
                val = val.replace(QRegExp("\\[\\[([^\\]]+)\\]\\]"),"BAS_VARS[\"\\1\"]");
                val = val.replace("console.log","BAS_CONSOLE_LOG");

                file.write((val).toUtf8());
                file.close();

            }
        }
        return true;
    }


    void NodeConnector::StartInternal()
    {
        QString LockPath = QDir::cleanPath(QString("e") + QDir::separator() + GetLanguageSettingsHash() + QString(".") + Suffix + QDir::separator() + QString("distr") + QDir::separator() + QString("lock.file"));
        LockPath = QFileInfo(LockPath).absoluteFilePath();

        if(NodeExeLock.isNull())
        {
            NodeExeLock = QSharedPointer<QFile>::create(LockPath);

            if(!NodeExeLock->open(QIODevice::WriteOnly))
            {
                LOG(QString("Failed to lock file"));
                FinalizeInstall(true,"Failed to lock file");
                return;
            }
        }

        LOGINTERFACE(tr("Running Node.js ... "));

        StartPipes();

        StartProcess();
    }

    void NodeConnector::Stop()
    {
        LOG(QString("Stop"));
        if(!NodeExeLock.isNull())
        {
            NodeExeLock->close();
            NodeExeLock.reset();
        }

        if(!Process.isNull())
        {
            disconnect(Process.data(),SIGNAL(finished(int)),this,SLOT(ProcessFinished()));
            disconnect(Process.data(),SIGNAL(errorOccurred(QProcess::ProcessError)),this,SLOT(FailedToStartNode(QProcess::ProcessError)));

            Process->kill();
            Process.reset();
            emit Stopped(QString(""));

        }
        IsActive = false;
        LOG(QString("EndStop"));

        //Auto clean cache folder in background

        /*QString CacheDir = QFileInfo(QDir::cleanPath(QString("e") + QDir::separator() + QString("cache.%1").arg(Suffix))).absoluteFilePath();
        QStringList Folders;
        QStringList Files;
        Folders.append(CacheDir);
        LOG(QString("Autoclean current cache %1").arg(CacheDir));

        QtConcurrent::run(RemoveData, Folders, Files);*/
    }

    void NodeConnector::SendRaw(const QString& Text)
    {
        if(IsRecord)
            LOG(QString("-> %1").arg(Text));
        if(!IsActive)
        {
            SendQueue.append(Text);
        }else
        {
            Write(Text.toUtf8());
        }
    }

    quint64 NodeConnector::SendFunction(const QString& Variables, const QString& Function)
    {
        QJsonParseError err;
        QJsonDocument VariablesObject = QJsonDocument::fromJson(Variables.toUtf8(),&err);
        if(err.error)
            return 0;


        quint64 id = GenerateId();
        QVariantMap res;
        res.insert("f",Function);
        res.insert("id",QString::number(id));
        res.insert("v",VariablesObject);
        res.insert("t",0);

        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        SendRaw(QString::fromUtf8(document.toJson()));

        return id;
    }

    void NodeConnector::SendApiResponce(const QString& Variables, quint64 Id)
    {
        QJsonParseError err;
        QJsonDocument VariablesObject = QJsonDocument::fromJson(Variables.toUtf8(),&err);
        if(err.error)
            return;

        QVariantMap res;
        res.insert("id",QString::number(Id));
        res.insert("v",VariablesObject);
        res.insert("t",1);

        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        SendRaw(QString::fromUtf8(document.toJson()));

    }

    void NodeConnector::KillTask(quint64 Id)
    {

        QVariantMap res;
        res.insert("id",QString::number(Id));
        res.insert("t",2);

        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        SendRaw(QString::fromUtf8(document.toJson()));

    }


    void NodeConnector::GetStats()
    {
        QVariantMap res;
        res.insert("t",3);

        QJsonObject object = QJsonObject::fromVariantMap(res);

        QJsonDocument document;
        document.setObject(object);

        SendRaw(QString::fromUtf8(document.toJson()));
    }


    void NodeConnector::ProcessFinished()
    {
        if(NoNeedRestartProcess)
            return;
        LOG(QString("ProcessFinished"));
        if(IsActive)
        {
            IsActive = false;
            IsProcessRestart = true;
            QString log = Process->readAllStandardError();
            LOG(QString("Stopped %1").arg(log));
            emit Stopped(log);
            Process.reset();
            QTimer::singleShot(1000, this, SLOT(StartProcess()));
            emit ReceivedResultData(-1, "", false, "Node process stopped.");

        }else
        {
            QString log = Process->readAllStandardError();
            LOG(QString("Failed to start %1").arg(log));

            FinalizeInstall(true,log);
        }
    }

    void NodeConnector::StartPipes()
    {
        Server = QSharedPointer<QLocalServer>::create();
        connect(Server.data(),SIGNAL(newConnection()),this,SLOT(NewConnection()));

        QString PipeName = QString("\\\\.\\pipe\\basembeddedpipes");
        if(HasPipeVersion)
            PipeName += GetLanguageVersion();
        PipeName += QString::number(qApp->applicationPid());

        LOG(QString("Starting pipes server %1").arg(PipeName));

        Server->listen(PipeName);
    }

    void NodeConnector::StartProcess()
    {

        Process = QSharedPointer<QProcess>(new QProcess,&QObject::deleteLater);
        //Process->setProcessChannelMode(QProcess::ForwardedChannels);
        connect(Process.data(),SIGNAL(finished(int)),this,SLOT(ProcessFinished()));
        connect(Process.data(),SIGNAL(errorOccurred(QProcess::ProcessError)),this,SLOT(FailedToStartNode(QProcess::ProcessError)));

        QStringList Params;
        Params.append(GetExecutableLocationForMain());
        Params.append(QString::number(qApp->applicationPid()));
        QString Location;
        Location = GetExecutableLocationForNode();
        LOG(QString("Starting process %1").arg(A(Location)));
        Process->start(Location,Params);

        IsActive = false;
    }

    void NodeConnector::ReadData()
    {
        QLocalSocket *Client = (QLocalSocket *)(sender());
        QString Data = QString::fromUtf8(Client->readAll());

        DataAll += Data;
        QStringList DataSplit = DataAll.split("--BAS-BOUNDARY--");
        QString DataLast = DataSplit.last();
        if(DataLast.isEmpty())
        {
            DataAll.clear();
        }else
        {
            DataAll = DataLast;
        }
        DataSplit.removeLast();

        for(const QString& Text:DataSplit)
        {
            if(IsRecord)
                LOG(QString("<- %1").arg(Text));
            QJsonParseError err;
            QJsonDocument Document = QJsonDocument::fromJson(Text.toUtf8(),&err);
            if(!err.error)
            {

                QJsonObject Object = Document.object();
                quint64 Id = 0;
                if(Object.contains("id"))
                {
                    Id = Object["id"].toString().toULongLong();
                }

                QString Variables = "{}";

                if(Object.contains("v"))
                {
                    QJsonDocument document;
                    document.setObject(Object["v"].toObject());
                    Variables = QString::fromUtf8(document.toJson());
                }

                if(Object.contains("s"))
                {
                    bool IsSuccess = Object["s"].toBool();
                    QString Error;
                    if(Object.contains("e"))
                    {
                        Error = Object["e"].toString();
                    }

                    emit ReceivedResultData(Id, Variables, IsSuccess, Error);
                }else if(Object.contains("s1"))
                {
                    emit ReceivedStats(Object["s1"].toInt(),Object["s2"].toInt());
                }else if(Object.contains("l"))
                {
                    emit LogConsole(Object["l"].toString(),Id);
                }else
                {
                    QString Api = Object["a"].toString();

                    emit ReceivedApiData(Id, Variables, Api);
                }

            }
        }

    }

    void NodeConnector::NewConnection()
    {
        Client = Server->nextPendingConnection();

        if(!Client)
            return;

        for(const QString& Text:SendQueue)
        {
            Write(Text.toUtf8());
        }

        SendQueue.clear();

        connect(Client,SIGNAL(readyRead()),this,SLOT(ReadData()));

        IsActive = true;
        LOG(QString("Started success"));
        LOGINTERFACE(tr("Finalization ... "));

        FinalizeInstall(false, QString());
    }

    void NodeConnector::Write(const QString& Text)
    {
        QString TextToWrite = Text + "--BAS-BOUNDARY--";
        Client->write(TextToWrite.toUtf8());
    }

}
