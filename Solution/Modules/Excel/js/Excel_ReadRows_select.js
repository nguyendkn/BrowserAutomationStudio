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
var FromRow = GetInputConstructorValue("FromRow", loader);
if(FromRow["original"].length == 0){
	Invalid(tr("From row") + " " + tr("is empty"));
    return;
};
var ToRow = GetInputConstructorValue("ToRow", loader);
if(ToRow["original"].length == 0){
	Invalid(tr("To row") + " " + tr("is empty"));
    return;
};
var DataFormat = GetInputConstructorValue("DataFormat", loader);
if(DataFormat["original"].length == 0){
	Invalid(tr("Data format") + " " + tr("is empty"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_ReadRows_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "FromRow": FromRow["updated"],
        "ToRow": ToRow["updated"],
        "DataFormat": DataFormat["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}