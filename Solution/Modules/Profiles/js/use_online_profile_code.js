if(_is_bas_browser_virtual())
	fail(tr("This action can be used only with Multilogin browser"))
var Params = {};
var ProfilePath = (<%= id %>);
Params["ProfilePath"] = "mla_id:" + ProfilePath
_settings(Params)!