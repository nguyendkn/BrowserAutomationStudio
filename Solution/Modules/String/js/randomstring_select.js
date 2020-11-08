var AllowedChars = GetInputConstructorValue("AllowedChars", loader);
var Length = GetInputConstructorValue("Length", loader);
var Save = this.$el.find("#Save").val().toUpperCase();
if(Save.length == 0){
    Invalid("Variable is empty");
    return;
};
if(AllowedChars["original"].length == 0){
    Invalid("AllowedChars is empty");
    return;
};
if(Length["original"].length == 0){
    Invalid("Length is empty");
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($('#' + State + "_code").html())({
        "variable": "VAR_" + Save,
        "chars": AllowedChars["updated"],
        "length": Length["updated"]
    });
	code = Normalize(code, 0);
	BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}