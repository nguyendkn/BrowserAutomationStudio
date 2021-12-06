var uids = GetInputConstructorValue("uids", loader);
if(uids["original"].length == 0){
    Invalid(tr("The parameter \"") + tr("Message Id") + tr("\" is not specified"));
    return;
};
var folder = GetInputConstructorValue("folder", loader);
try{
    var code = loader.GetAdditionalData() + _.template($("#InMail_DelMsgs_code").html())({
        "uids": uids["updated"],
        "folder": folder["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}
