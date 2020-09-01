var FilePath = GetInputConstructorValueFilename("FilePath", loader);
if(FilePath["original"].length == 0){
    Invalid(tr("File path") + " " + tr("is empty"));
    return;
};
var SheetIndexOrName = GetInputConstructorValue("SheetIndexOrName", loader);
if(SheetIndexOrName["original"].length == 0){
    Invalid(tr("Sheet index or name") + " " + tr("is empty"));
    return;
};
var FromCell = GetInputConstructorValue("FromCell", loader);
if(FromCell["original"].length == 0){
	Invalid(tr("From cell") + " " + tr("is empty"));
    return;
};
var ToCell = GetInputConstructorValue("ToCell", loader);
if(ToCell["original"].length == 0){
	Invalid(tr("To cell") + " " + tr("is empty"));
    return;
};
var StyleName = GetInputConstructorValue("StyleName", loader);
if(StyleName["original"].length == 0){
	Invalid(tr("Style name") + " " + tr("is empty"));
    return;
};
var StyleValue = GetInputConstructorValue("StyleValue", loader);
if(StyleValue["original"].length == 0){
	Invalid(tr("Style value") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_SetStyleToCellsRange_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "FromCell": FromCell["updated"],
        "ToCell": ToCell["updated"],
        "StyleName": StyleName["updated"],
        "StyleValue": StyleValue["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}