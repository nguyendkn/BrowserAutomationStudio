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
var NewSheetName = GetInputConstructorValue("NewSheetName", loader);
if(NewSheetName["original"].length == 0){
	Invalid(tr("New sheet name") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_RenameSheet_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "NewSheetName": NewSheetName["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}