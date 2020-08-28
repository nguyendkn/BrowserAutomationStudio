var FilePath = GetInputConstructorValue("FilePath", loader);
if(FilePath["original"].length == 0){
    Invalid(tr("File path") + " " + tr("is empty"));
    return;
};
var Data = GetInputConstructorValue("Data", loader);
if(Data["original"].length == 0){
	Invalid(tr("JSON string") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_ConvertFromJSON_code").html())({
        "FilePath": FilePath["updated"],
        "Data": Data["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}