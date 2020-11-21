var Value = GetInputConstructorValue("Value", loader);
var ReplaceFrom = GetInputConstructorValue("ReplaceFrom", loader);
var ReplaceTo = GetInputConstructorValue("ReplaceTo", loader);
var Save = this.$el.find("#Save").val().toUpperCase();
if(Save.length == 0){
    Invalid("Variable is empty");
    return;
};
if(Value["original"].length == 0){
    Invalid("Value is empty");
    return;
};
if(ReplaceFrom["original"].length == 0){
    Invalid("ReplaceFrom is empty");
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#replacestring_code").html())({
        "variable": "VAR_" + Save,
        "value": Value["updated"],
        "from": ReplaceFrom["updated"],
        "to": ReplaceTo["updated"]
    });
	code = Normalize(code, 0);
	BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch (e){}
