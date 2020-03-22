ProfilePath = _get_profile()
if(ProfilePath == "")
	fail(tr("Profile is empty, create it with \"Create or switch to local profile\" action."))

if(ProfilePath.indexOf("mla_id:") == 0)
	fail(tr("You are using online profile, in current version it is impossible to make it local."))

_disable_browser()!

native("filesystem", "copyfile", JSON.stringify({path: ProfilePath,dest: <%= profile %>}))