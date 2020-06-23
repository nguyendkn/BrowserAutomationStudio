<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({id:"Fingerprint", description:tr("Fingerprint"), default_selector: "string", disable_int:true, help: 
	{
		description: tr("This value must contain fingerprint string. Fingerprint string contains all data necessary to change fingerprint. It can be obtained as result of 'Get fingerprint' action. Note that this value may be reused - if you store it into file or database, and load on next BAS start, it will still work.")
	}}) %>

  <%= _.template($('#input_constructor').html())({id:"CanvasNoise", description:tr("Safe Canvas"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true", "false"], help: { description: tr("If this settings is set to true, canvas will be enabled and noise will be added to all data returned from canvas")}}) %>
  
  <%= _.template($('#input_constructor').html())({id:"PerfectCanvas", description:tr("Use PerfectCanvas"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true", "false"], help: { description: tr("If this settings is set to true, PerfectCanvas replacement will be enabled. Fingerprint must contain PerfectCanvas data in order to make it work. See \"Get fingerprint\" action for explanation.")}}) %>

  <%= _.template($('#input_constructor').html())({id:"WebglNoise", description:tr("Safe WebGL"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true", "false"], help: { description: tr("If this settings is set to true, WebGL will be enabled, noise will be added to WebGL canvas and your hardware properties, like video card vendor and renderer, will be changed")}}) %>

  <%= _.template($('#input_constructor').html())({id:"AudioNoise", description:tr("Safe Audio"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true", "false"], help: { description: tr("If this settings is set to true, audio will be enabled, noise will be added to sound and your hardware properties, like sample rate and naumber of channels, will be changed")}}) %>

  <%= _.template($('#input_constructor').html())({id:"SafeBattery", description:tr("Safe Battery"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true", "false"], help: { description: tr("If this settings is set to true battery API will show different values for each thread, this prevents sites for detecting your real identity. In case if device from which fingerprint was obtained doesn't have battery API, 100% charge level will always be returned.")}}) %>

  <%= _.template($('#input_constructor').html())({id:"SafeRectangles", description:tr("Safe Element Size"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true", "false"], help: { description: tr("If this settings is set to true, results of API which returns element coordinates will be updated to protect against 'client rects' fingerprinting.")}}) %>
</div>

<div class="tooltipinternal">
      <div class="tr tooltip-paragraph-first-fold">Change browser fingerprint, which contains: user agent, screen size, navigator, fonts and many more.</div>
	<div class="tr tooltip-paragraph-fold">'Fingerprint' input parameter must contain fingerprint string. Fingerprint string contains all data necessary to change fingerprint. It can be obtained as result of 'Get fingerprint' action. Note that this value may be reused - if you store it into file or database, and load on next BAS start, it will still work.</div>
      <div class="tr tooltip-paragraph-fold">Using this action is like user agent switcher on steroids. It changes not only user agent, but a lot of browser internals to make BAS actually look like firefox, chrome, safari, on desktop or on mobile.</div>
      <div class="tr tooltip-paragraph-fold">Several additional features may be used to make your browser less detectable. Apply proxy through 'Proxy' action. Change timezone with 'Set timezone and geolocation by ip' action. Use, store and reuse profiles, because starting browser on newly created profiles may be suspicious.</div>
      <div class="tr tooltip-paragraph-fold">Applying fingerprint doesn't require browser restart, so it won't reset your settings.</div>

      <div class="tooltip-paragraph-last-fold"><span class="tr">You can find more information and get test fingerprints on following page</span> <a href="#"  onclick="BrowserAutomationStudio_OpenUrl('https://fingerprints.bablosoft.com'); return false;">
  		FingerprintSwitcher</a>.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
