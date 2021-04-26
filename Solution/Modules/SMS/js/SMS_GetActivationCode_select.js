var number = GetInputConstructorValue("number", loader);
if(number["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Number") + tr("\" is not specified"));
    return;
};
var timeout = GetInputConstructorValue("timeout", loader);
if(timeout["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Timeout") + tr("\" is not specified"));
    return;
};
var delay = GetInputConstructorValue("delay", loader);
if(delay["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Delay") + tr("\" is not specified"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#SMS_GetActivationCode_code").html())({
        "number": number["updated"],
        "timeout": timeout["updated"],
        "delay": delay["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}