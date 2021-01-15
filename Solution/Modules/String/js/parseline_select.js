var Value = GetInputConstructorValue("Value",loader);
var List = $("#VariablesList").val().toUpperCase();
if(Value["original"].length <= 0){
	Invalid(tr("The parameter \"") + tr("String") + tr("\" is not specified"));
	return;
};
if(List.length <= 0){
	Invalid(tr("The parameter \"") + tr("Variables list") + tr("\" is not specified"));
	return;
};
List = List.replace(/\s/g,"");
List = List.split(",");
List = _.compact(List);
if(List.length > 0){
	/*List[0] = List[0].replace(/[\\[\\]]/g,"")
	List[List.length - 1] = List[List.length - 1].replace(/[\\[\\]]/g,"")*/
}else{
	Invalid(tr("The parameter \"") + tr("Variables list") + tr("\" is not specified"));
	return; 
};
try{
	var code = loader.GetAdditionalData() + _.template($("#parseline_code").html())({
		"list":List,
		"value":Value["updated"]
	});
	code = Normalize(code,0);
	BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e){}