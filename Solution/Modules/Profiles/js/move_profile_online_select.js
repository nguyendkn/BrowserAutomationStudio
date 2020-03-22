var Name = GetInputConstructorValue("Name",loader)
var Save = this.$el.find("#Save").val().toUpperCase();


if(Name["original"].length <= 0)
{
  Invalid("Name is empty");
  return;
}

if(Save.length == 0)
{
  Invalid("Variable is empty");
  return;
}


 try{
  var code = loader.GetAdditionalData() + _.template($('#move_profile_online_code').html())(
      {
        variable:"VAR_" + Save,
        name:Name["updated"]        
      }
    )
  code = Normalize(code,0)
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{
}