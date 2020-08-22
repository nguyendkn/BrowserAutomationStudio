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
var NewSheetIndex = GetInputConstructorValue("NewSheetIndex", loader);
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_MoveSheet_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "NewSheetIndex": NewSheetIndex["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}