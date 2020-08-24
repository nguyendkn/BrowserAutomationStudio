var FilePath = GetInputConstructorValue("FilePath", loader);
if(FilePath["original"].length == 0){
    Invalid(tr("File path") + " " + tr("is empty"));
    return;
};
var SheetIndexOrName = GetInputConstructorValue("SheetIndexOrName", loader);
if(SheetIndexOrName["original"].length == 0){
    Invalid(tr("Sheet index or name") + " " + tr("is empty"));
    return;
};
var FromRow = GetInputConstructorValue("FromRow", loader);
if(FromRow["original"].length == 0){
	Invalid(tr("From row") + " " + tr("is empty"));
    return;
};
var Count = GetInputConstructorValue("Count", loader);
if(Count["original"].length == 0){
	Invalid(tr("Count") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_DeleteRows_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "FromRow": FromRow["updated"],
        "Count": Count["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}