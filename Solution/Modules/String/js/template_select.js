var Template;
if($("#Check").is(':checked')){
    Template = GetInputConstructorValue("Template", loader)["updated"];
}else{
	Template = "\"" + je($("#Template").val()) + "\"";
};
if ($("#Check3").is(':checked')){
	Template = Template.replace("\\)\\!", "BASASYNC")
};
var Save = this.$el.find("#Save").val().toUpperCase();
if (Save.length == 0) {
	Invalid(tr("The parameter \"") + tr("Variable") + tr("\" is not specified"));
	return;
};
if ($("#Template").val().length == 0) {
	Invalid(tr("The parameter \"") + tr("Template") + tr("\" is not specified"));
	return;
};
try {
    var code = loader.GetAdditionalData() + _.template($("#template_code").html())({
        "variable": "VAR_" + Save,
        "template": Template,
        "isspintax": $("#Check2").is(':checked'),
        "istemplate": $("#Check3").is(':checked')
    });
	code = Normalize(code, 0);
	BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch (e){}