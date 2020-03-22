#include "embeddedlanguageinstalldialog.h"
#include "ui_embeddedlanguageinstalldialog.h"
#include <QCloseEvent>

EmbeddedLanguageInstallDialog::EmbeddedLanguageInstallDialog(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::EmbeddedLanguageInstallDialog)
{
    ui->setupUi(this);
    connect(ui->RunAnyway,SIGNAL(clicked(bool)),this,SIGNAL(RunWithoutEmbeddedLanguages()));
    connect(ui->Close,SIGNAL(clicked(bool)),this,SIGNAL(Close()));
    ui->plainTextEdit->setVisible(false);
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

void EmbeddedLanguageInstallDialog::AddLog(const QString& Log)
{
    ui->plainTextEdit->setPlainText(Log + ui->plainTextEdit->toPlainText());
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
    ui->ShowLog->setVisible(false);
    ui->plainTextEdit->setVisible(true);
    ui->Label->setVisible(false);
}
