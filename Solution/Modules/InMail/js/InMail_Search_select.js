var from = GetInputConstructorValue("from", loader);
var to = GetInputConstructorValue("to", loader);
var subject = GetInputConstructorValue("subject", loader);
var text = GetInputConstructorValue("text", loader);
var sortType = GetInputConstructorValue("sortType", loader);
if(sortType["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Sorting type") + tr("\" is not specified"));
    return;
};
var sortField = GetInputConstructorValue("sortField", loader);
var folder = GetInputConstructorValue("folder", loader);
var errorNotFound = $("#Check").is(':checked');
var Save = this.$el.find("#Save").val().toUpperCase();
if(Save.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + tr("\" is not specified"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#InMail_Search_code").html())({
		"from": from["updated"],
		"to": to["updated"],
		"subject": subject["updated"],
		"text": text["updated"],
		"sortType": sortType["updated"],
		"sortField": sortField["updated"],
        "folder": folder["updated"],
        "errorNotFound": errorNotFound,
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}