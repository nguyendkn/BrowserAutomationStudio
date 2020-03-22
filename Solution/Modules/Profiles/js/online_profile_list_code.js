if(_is_bas_browser_real())
	fail(tr("This action can be used only with Multilogin browser"))
_find_all_online_profiles(<%= mask %>)!
try
{
	<%= variable %> = JSON.parse(_result())["data"]
}catch(e){}