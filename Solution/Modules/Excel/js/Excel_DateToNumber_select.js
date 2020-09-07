var Date = GetInputConstructorValue("Date", loader);
if(Date["original"].length == 0){
	Invalid(tr("Date") + " " + tr("is empty"));
    return;
};
var Save = this.$el.find("#Save").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#Excel_DateToNumber_code").html())({
        "Date": Date["updated"],
        "variable": "VAR_" + Save
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch (e){}