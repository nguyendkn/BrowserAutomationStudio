var name = GetInputConstructorValue("name", loader);
if(name["original"].length == 0){
	Invalid(tr("The parameter \"") + tr("Folder name") + tr("\" is not specified"));
    return;
};
var res_name = this.$el.find("#res_name").val().toUpperCase();
if(res_name.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Folder name") + tr("\" is not specified"));
    return;
};
var uidnext = this.$el.find("#uidnext").val().toUpperCase();
if(uidnext.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Next identifier") + tr("\" is not specified"));
    return;
};
var uidvalidity = this.$el.find("#uidvalidity").val().toUpperCase();
if(uidvalidity.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Validity identifier") + tr("\" is not specified"));
    return;
};
var total = this.$el.find("#total").val().toUpperCase();
if(total.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Total messages") + tr("\" is not specified"));
    return;
};
var recent = this.$el.find("#recent").val().toUpperCase();
if(recent.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Recent messages") + tr("\" is not specified"));
    return;
};
var unseen = this.$el.find("#unseen").val().toUpperCase();
if(unseen.length == 0){
	Invalid(tr("The parameter \"") + tr("Variable") + " -> " + tr("Unseen messages") + tr("\" is not specified"));
    return;
};
try{
    var code = loader.GetAdditionalData() + _.template($("#InMail_Status_code").html())({
        "name": name["updated"],
        "res_name": "VAR_" + res_name,
		"uidnext": "VAR_" + uidnext,
        "uidvalidity": "VAR_" + uidvalidity,
        "total": "VAR_" + total,
        "recent": "VAR_" + recent,
        "unseen": "VAR_" + unseen
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}