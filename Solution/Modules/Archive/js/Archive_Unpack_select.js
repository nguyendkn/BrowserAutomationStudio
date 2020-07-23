var ArchivePath = GetInputConstructorValue("ArchivePath", loader);
if(ArchivePath["original"].length == 0){
    Invalid(tr("Archive path") + " " + tr("is empty"));
    return;
};
var DestinationFolder = GetInputConstructorValue("DestinationFolder", loader);
try{
    var code = loader.GetAdditionalData() + _.template($("#Archive_Unpack_code").html())({
        "ArchivePath": ArchivePath["updated"],
        "DestinationFolder": DestinationFolder["updated"]
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}