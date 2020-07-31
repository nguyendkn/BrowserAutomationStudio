var RemotePath = GetInputConstructorValue("RemotePath", loader);
if(RemotePath["original"].length == 0){
	Invalid(tr("Remote path") + " " + tr("is empty"));
    return;
};
var DestinationPath = GetInputConstructorValue("DestinationPath", loader);
if(DestinationPath["original"].length == 0){
    Invalid(tr("Destination path") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#FTP_Download_code").html())({
        "RemotePath": RemotePath["updated"],
        "DestinationPath": DestinationPath["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}