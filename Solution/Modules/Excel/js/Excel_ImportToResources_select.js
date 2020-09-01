var FilePath = GetInputConstructorValue("FilePath", loader);
if(FilePath["original"].length == 0){
    Invalid(tr("File path") + " " + tr("is empty"));
    return;
};
var SuccessNumber = GetInputConstructorValue("SuccessNumber", loader);
if(SuccessNumber["original"].length == 0){
	Invalid(tr("Success Usage") + " " + tr("is empty"));
    return;
};
var FailNumber = GetInputConstructorValue("FailNumber", loader);
if(FailNumber["original"].length == 0){
	Invalid(tr("Fail Usage") + " " + tr("is empty"));
    return;
};
var SimultaneousUsage = GetInputConstructorValue("SimultaneousUsage", loader);
if(SimultaneousUsage["original"].length == 0){
	Invalid(tr("Simultaneous Usage") + " " + tr("is empty"));
    return;
};
var Interval = GetInputConstructorValue("Interval", loader);
if(Interval["original"].length == 0){
	Invalid(tr("Interval Between Usage") + " " + tr("is empty"));
    return;
};
var Greedy = $("#Check").is(':checked');
var DontGiveUp = $("#Check2").is(':checked');
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_ImportToResources_code").html())({
        "FilePath": FilePath["updated"],
        "SuccessNumber": SuccessNumber["updated"],
        "FailNumber": FailNumber["updated"],
        "SimultaneousUsage": SimultaneousUsage["updated"],
        "Interval": Interval["updated"],
        "Greedy": Greedy,
        "DontGiveUp": DontGiveUp
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}