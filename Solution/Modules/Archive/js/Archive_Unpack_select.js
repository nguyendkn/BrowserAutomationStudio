var ArchivePath = GetInputConstructorValue("ArchivePath", loader);
if(ArchivePath["original"].length == 0){
    Invalid(tr("Archive path") + " " + tr("is empty"));
    return;
};
var DestinationPath = GetInputConstructorValue("DestinationPath", loader);
var ArchiveType = GetInputConstructorValue("ArchiveType", loader);
if(ArchiveType["original"].length == 0){
	Invalid(tr("Archive type") + " " + tr("is empty"));
    return;
};
var ListOfFiles = GetInputConstructorValue("ListOfFiles", loader);
try{
    var code = loader.GetAdditionalData() + _.template($("#Archive_Unpack_code").html())({
        "ArchivePath": ArchivePath["updated"],
        "DestinationPath": DestinationPath["updated"],
        "ArchiveType": ArchiveType["updated"],
        "ListOfFiles": ListOfFiles["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}
