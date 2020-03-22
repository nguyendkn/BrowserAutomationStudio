var q = (<%= tags %>).split(",").map(function(el){return el.trim()})
if(q.length == 0 || q.length == 1 && q[0] == "*")
{
    q = ((<%= key %>).length > 0) ? ("?version=2&key=" + encodeURIComponent(<%= key %>)) : "?version=2"
}else
{
    q = "?version=2&tags=" + encodeURIComponent(q.join(",")) + (((<%= key %>).length > 0) ? ("&key=" + encodeURIComponent(<%= key %>)) : "")
}

if(<%= min_browser_version %> != "*")
	q += "&min_browser_version=" + parseInt(<%= min_browser_version %>)

if(<%= min_width %> != "*")
	q += "&min_width=" + parseInt(<%= min_width %>)	

if(<%= min_height %> != "*")
	q += "&min_height=" + parseInt(<%= min_height %>)	

if(<%= max_width %> != "*")
	q += "&max_width=" + parseInt(<%= max_width %>)	

if(<%= max_height %> != "*")
	q += "&max_height=" + parseInt(<%= max_height %>)	

if(<%= time_limit %> != "*")
	q += "&time_limit=" + encodeURIComponent(<%= time_limit %>)	


var api_url = "https://fingerprints.bablosoft.com/prepare" + q

_switch_http_client_internal()
http_client_set_fail_on_error(false)

_do(function(){
	if(_iterator()>15)
		fail("Query limit reached")

	http_client_get2(api_url,{method:("GET"),headers:("Accept-Encoding: gzip, deflate")})!
	<%= variable %> = http_client_content()

	try
	{
		var json = JSON.parse(<%= variable %>)
		if(!json["trylater"])
			_break()
	}catch(e){}

	sleep(20000)!
})!  


http_client_set_fail_on_error(true)
_switch_http_client_main()