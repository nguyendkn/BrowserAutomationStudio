var string = GetInputConstructorValue("string", loader);
if(string["original"].length == 0){
	Invalid(tr("String") + " " + tr("is empty"));
    return;
};
var from = GetInputConstructorValue("from", loader);
var count = GetInputConstructorValue("count", loader);
if(count["original"].length == 0){
	Invalid(tr("Count") + " " + tr("is empty"));
    return;
};
var substring = GetInputConstructorValue("substring", loader);
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#remove_string_part_code").html())({
        "string": string["updated"],
        "from": from["updated"],
        "count": count["updated"],
        "substring": substring["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}
