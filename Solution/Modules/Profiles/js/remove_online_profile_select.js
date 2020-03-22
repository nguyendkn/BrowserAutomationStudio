var ProfileId = GetInputConstructorValue("ProfileId", loader);


try{
  var code = loader.GetAdditionalData() + _.template($("#remove_online_profile_code").html())({profile:ProfileId["updated"]});
  code = Normalize(code,0);
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{}