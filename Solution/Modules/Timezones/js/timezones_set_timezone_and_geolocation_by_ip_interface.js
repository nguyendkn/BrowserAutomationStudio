<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({id:"Value", description:tr("Ip address"), default_selector: "string", disable_int:true, help: 
{
	description: tr("A string which contains ip address. Ipv6 string should be enclosed with square brackets. Timezone and geolocation will be extracted from selected ip and browser settings will be updated accordingly."), examples:
	[
		{
			code:"140.97.75.15",description:tr("Ipv4 example")
		},
		{
			code:"<s>140.97.75.15:8080</s>",description:tr("Not correct, ip string can't contain port.")
		},
		{
			code:"[2a03:2880:f11c:8083:face:b00c:0:25de]",description:tr("Ipv6 example")
		}
	]
}
}) %>
</div>
<div class="tooltipinternal">
      <div class="tr tooltip-paragraph-first-fold">Set browser timezone and position the same as timezone and position of selected ip.</div>
      <div class="tooltip-paragraph-fold"><span class="tr">Site can obtain information about system timezone and location using internal apis (</span><a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset');return false">example 1</a>, <a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API');return false">example 2</a><span class="tr">). This action allows to spoof timezone and location values returned by browser.</span></div>
      <div class="tooltip-paragraph-fold"><span class="tr">Full list of timezones can be found</span> <a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://en.wikipedia.org/wiki/List_of_UTC_time_offsets');return false">here</a>.</div>
      <div class="tr tooltip-paragraph-fold">To obtain ip information internal database is used, no network requests will be done.</div>
      <div class="tr tooltip-paragraph-last-fold">It is recommended to use 'Proxy' action instead of this one, because it will set timezone and geolocation automatically according to current proxy.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>

 