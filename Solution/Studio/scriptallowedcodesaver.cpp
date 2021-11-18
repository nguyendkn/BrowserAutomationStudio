#include "scriptallowedcodesaver.h"
#include <QCryptographicHash>
#include <QJsonDocument>
#include <QJsonObject>
#include <QJsonArray>
#include <QJsonParseError>
#include <QJsonDocument>
#include "versioninfo.h"
#include <regex>

using namespace BrowserAutomationStudioFramework;

ScriptAllowedCodeSaver::ScriptAllowedCodeSaver(QObject *parent) : QObject(parent)
{

}

QString ScriptAllowedCodeSaver::GenerateHash(const QString& Data)
{
    QCryptographicHash hash(QCryptographicHash::Sha256);
    hash.addData(Data.toUtf8());
    return QString::fromUtf8(hash.result().toHex());
}

QList<QString> ScriptAllowedCodeSaver::ProcessNodeScript(const QString& Script)
{
    QList<QString> Result;
    int IndexStartSearch = 0;
    QString SearchData("BAS_API");
    while(true)
    {
        int Index = Script.indexOf(SearchData, IndexStartSearch);
        if(Index < 0)
            break;

        //0 - skip space, searching for (
        //1 - skip space, searching for first " or '
        //2 - searching for closing " or '

        int Stage = 0;
        QString Quote;
        QString Data;
        bool Found = false;
        for(int i = Index + SearchData.length();i<Script.length();i++)
        {
            QChar Char = Script[i];
            if(Stage == 0)
            {
                if(!Char.isSpace())
                {
                    if(Char == '(')
                    {
                        Stage = 1;
                    }else
                    {
                        IndexStartSearch = i;
                        break;
                    }
                }
            }else if(Stage == 1)
            {
                if(!Char.isSpace())
                {
                    if(Char == '"' || Char == '\'')
                    {
                        Stage = 2;
                        Quote = Char;
                        Data.append(Char);
                    }else
                    {
                        IndexStartSearch = i;
                        break;
                    }
                }
            }else if(Stage == 2)
            {
                if(Char == Quote)
                {
                    Data.append(Char);
                    Found = true;
                    IndexStartSearch = i;
                    break;
                }else if(Char == '\\')
                {
                    Data.append(Char);
                    i++;
                    if(i < Script.length())
                    {
                        Char = Script[i];
                        Data.append(Char);
                    }
                }else
                {
                    Data.append(Char);
                }

            }
        }
        if(Found)
        {
            Data = QString("[") + Data + QString("]");
            QJsonParseError err;

            QJsonDocument JsonDocument = QJsonDocument::fromJson(Data.toUtf8(), &err);
            if(JsonDocument.isArray())
            {
                QJsonArray JsonArray = JsonDocument.array();
                if(JsonArray.size() > 0)
                {
                    QJsonValue Value = JsonArray[0];

                    if(Value.isString())
                    {
                        QString DataString = Value.toString();
                        if(DataString.startsWith("_HEX:"))
                        {
                            DataString.remove(0,5);
                            DataString = QString::fromUtf8(QByteArray::fromHex(DataString.toUtf8()));
                        }
                        Result.append(DataString);
                    }
                }
            }
        }
    }
    return Result;
}


QList<QString> ScriptAllowedCodeSaver::Process(const QString& Script, const QString& EmbeddedData, const QList<QString>& ModulesEngineCode, const QList<QString>& ModulesEmbeddedData)
{
    QList<QString> Result;
    for(const QString& CustomItem: ModulesEngineCode)
    {
        Result.append(GenerateHash(CustomItem));
    }

    //Add info about current version
    VersionInfo _VersionInfo;
    Result.append(GenerateHash(QString("BASVERSION") + _VersionInfo.VersionString()));

    //Parse script code and add all functions
    std::string code = Script.toStdString();
    try
    {
        std::regex pieces_regex("section_start\\((\\\"[^\\\"]+\\\")\\s*\\,\\s*\\d+\\)\\!\\s*function");
        std::smatch pieces_match;
        std::string::const_iterator SearchStart( code.cbegin() );

        while(std::regex_search(SearchStart, code.cend(), pieces_match, pieces_regex))
        {
            std::ssub_match sub_match = pieces_match[1];
            std::string piece = sub_match.str();
            QString ItemStringJson = QString::fromStdString(piece);

            QString ItemJson;

            {
                QJsonParseError err;
                QJsonDocument Document = QJsonDocument::fromJson((QString("[") + ItemStringJson + QString("]")).toUtf8(),&err);

                if(!err.error && Document.isArray() && !Document.array().isEmpty() && Document.array()[0].isString())
                {
                    ItemJson = Document.array()[0].toString();
                }
            }

            if(!ItemJson.isEmpty())
            {
                QJsonParseError err;
                QJsonDocument Document = QJsonDocument::fromJson(ItemJson.toUtf8(),&err);

                if(!err.error && Document.isObject() && Document.object().contains("n") && Document.object()["n"].isString())
                {
                    QString FunctionName = Document.object()["n"].toString();
                    Result.append(GenerateHash(QString("FUNCTION") + FunctionName));
                }
            }

            SearchStart += pieces_match.position() + pieces_match.length();
        }

    }catch(...)
    {

    }

    //Add info about all BAS_API code inside script
    QJsonDocument JsonDocument = QJsonDocument::fromJson(EmbeddedData.toUtf8());
    QJsonArray JsonArray = JsonDocument.array();
    for(QJsonValue Value: JsonArray)
    {
        QJsonObject JsonObject = Value.toObject();
        QString Script = JsonObject["data"].toString();
        for(QString& ResultItem: ProcessNodeScript(Script))
        {
            QString ResultHash = GenerateHash(ResultItem);
            Result.append(ResultHash);
        }
    }

    //Add info about all BAS_API code inside modules
    for(QString EmbeddedData: ModulesEmbeddedData)
    {
        for(QString& ResultItem: ProcessNodeScript(EmbeddedData))
        {
            QString ResultHash = GenerateHash(ResultItem);
            Result.append(ResultHash);
        }
    }


    return Result;
}
