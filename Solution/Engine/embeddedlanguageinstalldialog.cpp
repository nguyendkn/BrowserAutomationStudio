#include "embeddedlanguageinstalldialog.h"
#include "ui_embeddedlanguageinstalldialog.h"
#include <QCloseEvent>
#include <QFileInfo>
#include <QDesktopServices>

EmbeddedLanguageInstallDialog::EmbeddedLanguageInstallDialog(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::EmbeddedLanguageInstallDialog)
{
    ui->setupUi(this);
    connect(ui->RunAnyway,SIGNAL(clicked(bool)),this,SIGNAL(RunWithoutEmbeddedLanguages()));
    connect(ui->Close,SIGNAL(clicked(bool)),this,SIGNAL(Close()));
}


void EmbeddedLanguageInstallDialog::closeEvent(QCloseEvent *event)
{
    event->ignore();
    emit Close();
}

void EmbeddedLanguageInstallDialog::SetIsError()
{
    ui->Label->setStyleSheet("*{color:red}");
}


void EmbeddedLanguageInstallDialog::SetLabel(const QString& Label)
{
    ui->Label->setText(Label);
}

void EmbeddedLanguageInstallDialog::SetTitle(const QString& Title)
{
    ui->Title->setText(Title);
    this->setWindowTitle(Title);

}

EmbeddedLanguageInstallDialog::~EmbeddedLanguageInstallDialog()
{
    delete ui;
}

void EmbeddedLanguageInstallDialog::on_ShowLog_clicked()
{
    QFileInfo info("node_log.txt");
    QDesktopServices::openUrl(QUrl::fromLocalFile(info.absoluteFilePath()));
}
