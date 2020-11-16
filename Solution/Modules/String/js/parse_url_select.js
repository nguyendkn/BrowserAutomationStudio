var string = GetInputConstructorValue("string", loader);
if(string["original"].length == 0){
	Invalid(tr("String") + " " + tr("is empty"));
    return;
};
var protocol = this.$el.find("#protocol").val().toUpperCase();
var username = this.$el.find("#username").val().toUpperCase();
var password = this.$el.find("#password").val().toUpperCase();
var host = this.$el.find("#host").val().toUpperCase();
var port = this.$el.find("#port").val().toUpperCase();
var path = this.$el.find("#path").val().toUpperCase();
var query = this.$el.find("#query").val().toUpperCase();
var fragment = this.$el.find("#fragment").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#parse_url_code").html())({
        "string": string["updated"],
        "protocol": "VAR_" + protocol,
        "username": "VAR_" + username,
        "password": "VAR_" + password,
        "host": "VAR_" + host,
        "port": "VAR_" + port,
        "path": "VAR_" + path,
        "query": "VAR_" + query,
        "fragment": "VAR_" + fragment
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}