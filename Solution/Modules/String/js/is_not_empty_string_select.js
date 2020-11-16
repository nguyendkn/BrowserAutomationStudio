var data = GetInputConstructorValue("data", loader);
if(data["original"].length == 0){
	Invalid(tr("Data") + " " + tr("is empty"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#is_not_empty_data_code").html())({
        "data": data["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}