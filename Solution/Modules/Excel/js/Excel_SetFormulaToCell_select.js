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
var Formula = GetInputConstructorValue("Formula", loader);
if(Formula["original"].length == 0){
	Invalid(tr("Formula") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_SetFormulaToCell_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "CellAddress": CellAddress["updated"],
        "Formula": Formula["updated"],
		"Sync": BrowserAutomationStudio_UsesWaitCode()
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}