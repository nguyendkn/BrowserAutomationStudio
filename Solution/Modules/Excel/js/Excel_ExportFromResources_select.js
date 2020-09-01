var FilePath = GetInputConstructorValue("FilePath", loader);
if(FilePath["original"].length == 0){
    Invalid(tr("File path") + " " + tr("is empty"));
    return;
};
var ResourceList = GetInputConstructorValue("ResourceList", loader);
if(ResourceList["original"].length == 0){
	Invalid(tr("List of resource names") + " " + tr("is empty"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_ExportFromResources_code").html())({
        "FilePath": FilePath["updated"],
        "ResourceList": ResourceList["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}