var enable = $("#Check").is(':checked');
var disable = $("#Check2").is(':checked');
try{
    var code = loader.GetAdditionalData() + _.template($("#SQL_Debug_code").html())({
        "enable": enable
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){console.log(e)}