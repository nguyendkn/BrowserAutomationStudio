var ArchivePath = GetInputConstructorValue("ArchivePath", loader);
if(ArchivePath["original"].length == 0){
    Invalid(tr("Archive path") + " " + tr("is empty"));
    return;
};
var ArchiveType = GetInputConstructorValue("ArchiveType", loader);
if(ArchiveType["original"].length == 0){
	Invalid(tr("Archive type") + " " + tr("is empty"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#Archive_GetFileList_code").html())({
        "ArchivePath": ArchivePath["updated"],
        "ArchiveType": ArchiveType["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}
