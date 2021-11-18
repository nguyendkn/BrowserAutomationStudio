#ifndef SCRIPTALLOWEDCODESAVER_H
#define SCRIPTALLOWEDCODESAVER_H

#include <QObject>
#include <QList>

class ScriptAllowedCodeSaver : public QObject
{
    Q_OBJECT
    QString GenerateHash(const QString& Data);
    QList<QString> ProcessNodeScript(const QString& Script);

public:
    explicit ScriptAllowedCodeSaver(QObject *parent = nullptr);
    QList<QString> Process(const QString& Script, const QString& EmbeddedData, const QList<QString>& ModulesEngineCode, const QList<QString>& ModulesEmbeddedData);

signals:

};

#endif // SCRIPTALLOWEDCODESAVER_H
