var query;
if($("#Check").is(':checked')){
	query = "\"" + je($("#query").val()) + "\"";
}else{
	query = GetInputConstructorValue("query", loader)["updated"];
};
if($("#query").val().length == 0){
	Invalid(tr("Query") + " " + tr("is empty"));
    return;
};
var type = GetInputConstructorValue("type", loader);
if(type["original"].length == 0){
	nvalid(tr("Query type") + " " + tr("is empty"));
    return;
};
var parameterize = $("#Check").is(':checked');
var results = this.$el.find("#results").val().toUpperCase();
var metadata = this.$el.find("#metadata").val().toUpperCase();
try{
    var code = loader.GetAdditionalData() + _.template($("#SQL_Query_code").html())({
        "query": query,
        "type": type["updated"],
		"parameterize": parameterize,
        "results": "VAR_" + results,
        "metadata": "VAR_" + metadata
    });
    code = Normalize(code, 0);
    BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}