var input = GetInputConstructorValue("input", loader);
if(input["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("String") + tr("\" is not specified"));
    return;
};
var algorithm = GetInputConstructorValue("algorithm", loader);
if(algorithm["original"].length == 0){
    Invalid(tr("The parameter \"") + tr("Algorithm") + tr("\" is not specified"));
    return;
};
var base64 = $("#Check").is(':checked');
var encoding = GetInputConstructorValue("encoding", loader);
if(encoding["original"].length == 0){
    Invalid(tr("The parameter \"") + tr("Encoding") + tr("\" is not specified"));
    return;
};
var outputFormat = GetInputConstructorValue("outputFormat", loader);
if(outputFormat["original"].length == 0){
    Invalid(tr("The parameter \"") + tr("Output format") + tr("\" is not specified"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#Checksum_String_code").html())({
        "input": input["updated"],
        "algorithm": algorithm["updated"],
        "base64": base64,
        "encoding": encoding["updated"],
        "outputFormat": outputFormat["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}