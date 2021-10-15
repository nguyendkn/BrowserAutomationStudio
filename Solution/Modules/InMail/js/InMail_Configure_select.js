var protocol = GetInputConstructorValue("protocol", loader);
if(protocol["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Protocol") + tr("\" is not specified"));
    return;
};
var autoConfig = GetInputConstructorValue("autoConfig", loader);
if(autoConfig["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Auto configuration") + tr("\" is not specified"));
    return;
};
var host = GetInputConstructorValue("host", loader);
var port = GetInputConstructorValue("port", loader);
var encrypt = GetInputConstructorValue("encrypt", loader);
if($('#autoConfig').val() != "true"){
	if(host["original"].length == 0){
		Invalid(tr("The parameter \"") + tr("Host name") + tr("\" is not specified"));
		return;
	};
	if(port["original"].length == 0){
		Invalid(tr("The parameter \"") + tr("Port") + tr("\" is not specified"));
		return;
	};
	if(encrypt["original"].length == 0){
		Invalid(tr("The parameter \"") + tr("Encryption") + tr("\" is not specified"));
		return;
	};
};
var username = GetInputConstructorValue("username", loader);
var password = GetInputConstructorValue("password", loader);
var folder = GetInputConstructorValue("folder", loader);
if(folder["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Folder name") + tr("\" is not specified"));
    return;
};
var timeout = GetInputConstructorValue("timeout", loader);
if(timeout["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Timeout") + tr("\" is not specified"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#InMail_Configure_code").html())({
        "protocol": protocol["updated"],
        "autoConfig": autoConfig["updated"],
        "host": host["updated"],
        "port": port["updated"],
        "encrypt": encrypt["updated"],
        "username": username["updated"],
        "password": password["updated"],
        "folder": folder["updated"],
        "timeout": timeout["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}