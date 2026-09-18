#include <QCoreApplication>
#include <QCommandLineParser>
int main(int argc,char*argv[]){
    QCoreApplication app(argc,argv);
    QCommandLineParser p; p.addHelpOption();
    QCommandLineOption portOpt("port","port","port","18081");
    p.addOption(portOpt); p.process(app);
    qInfo("BAS Worker pool listening on :%s (stub)",qPrintable(p.value(portOpt)));
    return app.exec();
}
