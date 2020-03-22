ProfilePath = (<%= profile %>);
if(ProfilePath == "")
	ProfilePath = _get_profile()

if(ProfilePath.length == 0)
	fail(tr("Profile is empty"))

if(ProfilePath.indexOf("mla_id:") == 0)
	fail(tr("This action removes only local profiles, you are using online profile, please use \"Remove online profile\" action instead"))

_remove_local_profile(ProfilePath)!

_if(ProfilePath == _get_profile(), function(){
	_disable_browser()!
	var Params = {};
	Params["ProfilePath"] = "<Incognito>"
	_settings(Params)!
})!

native("filesystem", "removefile", ProfilePath)	
