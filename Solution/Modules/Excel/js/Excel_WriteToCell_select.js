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
var CellAddress = GetInputConstructorValue("CellAddress", loader);
if(CellAddress["original"].length == 0){
	Invalid(tr("Cell address") + " " + tr("is empty"));
    return;
};
var Data = GetInputConstructorValue("Data", loader);
if(Data["original"].length == 0){
	Invalid(tr("Data") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_WriteToCell_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "CellAddress": CellAddress["updated"],
        "Data": Data["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}