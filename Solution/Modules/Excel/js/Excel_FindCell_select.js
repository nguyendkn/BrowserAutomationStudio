var FilePath = GetInputConstructorValueFilename("FilePath", loader);
if(FilePath["original"].length == 0){
    Invalid(tr("File path") + " " + tr("is empty"));
    return;
};
var SheetIndexOrName = GetInputConstructorValue("SheetIndexOrName", loader);
var Contains = GetInputConstructorValue("Contains", loader);
if(Contains["original"].length == 0){
	Invalid(tr("Cell contains") + " " + tr("is empty"));
    return;
};
var Column = this.$el.find("#Column").val().toUpperCase();
var Row = this.$el.find("#Row").val().toUpperCase();
var Sheet = this.$el.find("#Sheet").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_FindCell_code").html())({
        "FilePath": FilePath["updated"],
        "SheetIndexOrName": SheetIndexOrName["updated"],
        "Contains": Contains["updated"],
        "Column": "VAR_" + Column,
        "Row": "VAR_" + Row,
        "Sheet": "VAR_" + Sheet
		
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}