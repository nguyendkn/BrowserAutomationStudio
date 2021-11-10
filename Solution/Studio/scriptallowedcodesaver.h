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
    QList<QString> Process(const QString& EmbeddedData, const QList<QString>& CustomItems);

signals:

};

#endif // SCRIPTALLOWEDCODESAVER_H
