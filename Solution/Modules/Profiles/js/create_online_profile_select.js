var Name = GetInputConstructorValue("Name", loader);

if(Name["original"].length == 0)
{
  Invalid("Name is empty");
  return;
}


try{
  var code = loader.GetAdditionalData() + _.template($("#create_online_profile_code").html())({name:Name["updated"]});
  code = Normalize(code,0);
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{}