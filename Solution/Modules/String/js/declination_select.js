var number = GetInputConstructorValue("number", loader);
if(number["original"].length == 0){
	Invalid(tr("Number") + " " + tr("is empty"));
    return;
};
var word1 = GetInputConstructorValue("word1", loader);
if(word1["original"].length == 0){
	Invalid(tr("Word at") + " 1 " + tr("is empty"));
    return;
};
var word2 = GetInputConstructorValue("word2", loader);
if(word2["original"].length == 0){
	Invalid(tr("Word at") + " 2 " + tr("is empty"));
    return;
};
var word5 = GetInputConstructorValue("word5", loader);
if(word5["original"].length == 0){
	Invalid(tr("Word at") + " 5 " + tr("is empty"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#declination_code").html())({
        "number": number["updated"],
		"word1": word1["updated"],
		"word2": word2["updated"],
		"word5": word5["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}