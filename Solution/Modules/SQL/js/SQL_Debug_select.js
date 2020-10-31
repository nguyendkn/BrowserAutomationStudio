var enable = GetInputConstructorValue("enable",loader);
if(enable["original"].length == 0){
	Invalid(tr("Enable debug") + " " + tr("is empty"));
	return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#SQL_Debug_code").html())({
        "enable": enable["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){console.log(e)}