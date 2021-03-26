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
var ColumnIndexOrName = GetInputConstructorValue("ColumnIndexOrName", loader);
if(ColumnIndexOrName["original"].length == 0){
	Invalid(tr("Column index or name") + " " + tr("is empty"));
    return;
};
var Width = GetInputConstructorValue("Width", loader);
if(Width["original"].length == 0){
	Invalid(tr("Width") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_SetColumnWidth_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "ColumnIndexOrName": ColumnIndexOrName["updated"],
        "Width": Width["updated"],
		"Sync": BrowserAutomationStudio_UsesWaitCode()
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}
