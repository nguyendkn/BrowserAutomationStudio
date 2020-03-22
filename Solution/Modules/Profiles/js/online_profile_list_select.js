var Mask = GetInputConstructorValue("Mask",loader)
var Save = this.$el.find("#Save").val().toUpperCase();


if(Mask["original"].length <= 0)
{
  Invalid("Mask is empty");
  return;
}

if(Save.length == 0)
{
  Invalid("Variable is empty");
  return;
}


 try{
  var code = loader.GetAdditionalData() + _.template($('#online_profile_list_code').html())(
	  	{
	  		variable:"VAR_" + Save,
	  		mask:Mask["updated"]
	  	}
  	)
  code = Normalize(code,0)
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{
}