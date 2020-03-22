var Tags = GetInputConstructorValue("Tags", loader);
var Key = GetInputConstructorValue("Key", loader);
var Save = this.$el.find("#Save").val().toUpperCase();

var AddedDate = GetInputConstructorValue("AddedDate", loader);
var BrowserVersion = GetInputConstructorValue("BrowserVersion", loader);
var MinimumWidth = GetInputConstructorValue("MinimumWidth", loader);
var MinimumHeight = GetInputConstructorValue("MinimumHeight", loader);
var MaximumWidth = GetInputConstructorValue("MaximumWidth", loader);
var MaximumHeight = GetInputConstructorValue("MaximumHeight", loader);


if(Tags["original"].length == 0)
{
  Invalid("Tags are empty");
  return;
}

if(AddedDate["original"].length == 0)
{
  Invalid("AddedDate are empty");
  return;
}
if(BrowserVersion["original"].length == 0)
{
  Invalid("BrowserVersion are empty");
  return;
}
if(MinimumWidth["original"].length == 0)
{
  Invalid("MinimumWidth are empty");
  return;
}
if(MinimumHeight["original"].length == 0)
{
  Invalid("MinimumHeight are empty");
  return;
}
if(MaximumWidth["original"].length == 0)
{
  Invalid("MaximumWidth are empty");
  return;
}
if(MaximumHeight["original"].length == 0)
{
  Invalid("MaximumHeight are empty");
  return;
}


try{
  var code = loader.GetAdditionalData() + _.template($("#get_fingerprint_code").html())(
    {
      tags: Tags["updated"], 
      variable:"VAR_" + Save, 
      key: Key["updated"],
      min_browser_version: BrowserVersion["updated"],
      min_width: MinimumWidth["updated"],
      min_height: MinimumHeight["updated"],
      max_width: MaximumWidth["updated"],
      max_height: MaximumHeight["updated"],
      time_limit: AddedDate["updated"]
    })

  code = Normalize(code,0)
  BrowserAutomationStudio_Append("", BrowserAutomationStudio_SaveControls() + code, action, DisableIfAdd);
}catch(e)
{}