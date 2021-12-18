#include "aboutbrowserstudio.h"
#include "ui_aboutbrowserstudio.h"

#include "every_cpp.h"


AboutBrowserStudio::AboutBrowserStudio(const QString& Version,const QString& ServerName,QWidget *parent) :
    QDialog(parent),
    ui(new Ui::AboutBrowserStudio)
{
    ui->setupUi(this);
    ui->LabelWebkit->setText(QString("<b>") + "96.0.4664.110" + QString("</b>"));
    ui->LabelVersion->setText(QString("<b>") + Version + QString("</b>"));
    ui->LabelLicenseType->setText(QString("<b>") + tr("Free") + QString("</b>"));

    ui->LabelDescription->setText(QString(tr("<html><head/><body><p><span style=\" font-size:10pt;\">Browser Automation Studio - a comprehensive solution for creating complex network software. </span>Visit <a href=\"%1\"><span style=\" text-decoration: underline; color:#ffffff;\">%1</span></a> to see more details</p></body></html>")).arg(ServerName));
    this->setFixedSize(327,270);

}

void AboutBrowserStudio::SetIsPremium()
{
    ui->LabelLicenseType->setText(QString("<b>") + tr("Premium") + QString("</b>"));

}

void AboutBrowserStudio::changeEvent(QEvent *e)
{
    QDialog::changeEvent(e);
    switch (e->type()) {
    case QEvent::LanguageChange:
        ui->retranslateUi(this);
        break;
    default:
        break;
    }
}

AboutBrowserStudio::~AboutBrowserStudio()
{
    delete ui;
}
