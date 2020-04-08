<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({id:"Latitude", description:tr("Latitude"), default_selector: "expression", disable_int:true, value_string: "51.4997398", help: 
		{
			description: tr("Exact coordinates, which identifies your position. This value will be returned by browser as a response on location request from site."), examples:
			[
				{
					code:"10.433"
				}
			]
		}
 	}) %>
  <%= _.template($('#input_constructor').html())({id:"Longitude", description:tr("Longitude"), default_selector: "expression", disable_int:true, value_string: "-0.0898039", help: 
		{
			description: tr("Exact coordinates, which identifies your position. This value will be returned by browser as a response on location request from site."), examples:
			[
				{
					code:"10.433"
				}
			]
		} }) %>
  
</div>

<div class="tooltipinternal">
      <div class="tr tooltip-paragraph-first-fold">Set browser location. Geolocation can be changed by "Proxy" action as well.</div>
      <div class="tooltip-paragraph-fold"><span class="tr">Site can obtain information about your position using </span><a href="#" class="tr" onclick="BrowserAutomationStudio_OpenUrl('https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API');return false">following api</a><span class="tr">. This action allows to spoof position returned by browser.</span></div>
      <div class="tr tooltip-paragraph-fold">Using this action is not necessary to hide your location, because coordintes can be obtained only after user accepts request from site in a special popup window. By default, if you don't use this action, this popup is rejected by BAS.</div>
      <div class="tr tooltip-paragraph-last-fold">It is recommended to use 'Proxy' action instead of this one, because it will set position automatically according to current proxy.</div>
</div>


<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>