<%= variable %> = _get_profile()
<%= variable2 %> = <%= variable %>.indexOf("mla_id:") == 0
if(<%= variable2 %>)
	<%= variable %> = <%= variable %>.substr(7)
<%= variable3 %> = _get_profile().length > 0 && JSON.parse(native("filesystem", "fileinfo", _get_profile() + "/fingerprint.json"))["exists"]
