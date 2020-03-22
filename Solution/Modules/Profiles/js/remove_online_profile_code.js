if(_is_bas_browser_virtual())
	fail(tr("This action can be used only with Multilogin browser"))

ProfilePath = (<%= profile %>);
if(ProfilePath == "")
{
	ProfilePath = _get_profile()
	if(ProfilePath.indexOf("mla_id:") != 0)
		fail(tr('This action removes only online profiles, you are using local profile, please use "Remove local profile" action instead'))
	ProfilePath = ProfilePath.substr(7)
}

if(ProfilePath.length == 0)
	fail(tr("Profile is empty"))

_remove_online_profile(ProfilePath)!

_if(ProfilePath == _get_profile().substr(7), function(){
	_disable_browser()!
	var Params = {};
	Params["ProfilePath"] = "<Incognito>"
	_settings(Params)!
})!

