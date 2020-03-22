if(_is_bas_browser_virtual())
	fail(tr("This action can be used only with Multilogin browser"))
var Params = {};
var ProfilePath = (<%= name %>);
Params["ProfilePath"] = "mla_name:" + ProfilePath
_settings(Params)!