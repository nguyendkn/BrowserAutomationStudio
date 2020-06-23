<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({id:"Tags", description:tr("Tags"), default_selector: "string", disable_int:true, value_string:"Microsoft Windows,Chrome", variants: ["*", 'Desktop', 'Mobile', 'Microsoft Windows', 'Microsoft Windows Phone', 'Apple Mac', 'Android', 'Linux', 'iPad', 'iPhone', 'Edge', 'Chrome', 'Safari', 'Firefox', 'IE', 'YaBrowser', 'Windows 10', 'Windows 7', 'Windows 8'], help: 
		{
			description: tr("Select system and device for which you want to obtain fingerprint. Several tags may be combined together, in that case service will return only fingerprints, which matches all tags."), examples:
			[
				{
					code:"Chrome",description:tr("Select Chrome fingerprint for any platform")
				},
				{
					code:"Microsoft Windows,Chrome",description:tr("Select Chrome fingerprint for Windows. This is the only type of fingerprint which can be used for free.")
				},
				{
					code:tr("Empty string"),description:tr("Select any fingerprint")
				}
			]
		} }) %>
  <%= _.template($('#input_constructor').html())({id:"Key", description:tr("Service key. Can be empty"), default_selector: "string", disable_int:true, help: 
	{
		description: tr("Fingerprints are fetched from FingerprintSwitcher service, in order to use that service, you need to buy a key(see the link below). However, you may use it for free with Microsoft Windows,Chrome tags and with requests limits. In order to use free version, leave this field blank."), examples:
		[
			{
				code:"pGGeNdza2e0gIw48oa",description:tr("Key example")
			},
			{
				code:tr("Empty string"),description:tr("Use a free version")
			}
		]
	} }) %>
  <div style="margin-bottom:5px;margin-left:20px;font-size:small">
  	<span class="tr">This action works with</span> 
  	<a href="#"  onclick="BrowserAutomationStudio_OpenUrl('https://fingerprints.bablosoft.com'); return false;">
  		<span class="tr">Fingerprint switcher service</span></a>. 
  	<span class="tr">You can get a key there</span>. 
  </div>


  <div style="margin-left: 15px; background-color: #f1f1f1; padding: left:10px; padding-left: 10px; border-radius: 2px; margin-bottom: 3px; margin-right: 15px;">
  	<input type="checkbox" id="PerfectCanvasCheck" onchange="$('#PerfectCanvas').toggle()" style="margin-top: 6px;" /> 
  	<label for="PerfectCanvasCheck" class="tr" style="margin-bottom: 6px;width: calc(100% - 40px);cursor:pointer" >PerfectCanvas</label>
  </div>

  <span id="PerfectCanvas" style="display:none;margin-bottom:-4px;">
		<div style="margin-bottom:5px;margin-left:20px;font-size:small">
			<span class="tr">With the help of PerfectCanvas technology, canvas data is replaced in the most accurate way possible. Data is drawn on real devices.</span> 
			<a href="#" class="tr-en"  onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/doku.php?id=perfectcanvas'); return false;">
				<span class="tr">Learn more.</span>
			</a>
			<a href="#" class="tr-ru"  onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/doku.php?id=ru:perfectcanvas'); return false;">
				<span class="tr">Learn more.</span>
			</a>
			<span class="tr">If you want to use PerfectCanvas, you only need to fill this field:</span>
		</div>
		 <%= _.template($('#input_constructor').html())({id:"PerfectCanvasRequest", description:tr("PerfectCanvas request. Can be blank."), default_selector: "string", disable_int:true, disable_expression:true, value_string:"", use_textarea:true, disable_type_chooser:true,textarea_height:80,
		 help: 
		 {
			 description: tr("PerfectCanvas request contains all data required to render canvas on remote machine. In order to obtain request, use CanvasInspector application, see wiki for more information and download link. \"PerfectCanvas request\" data is obtained one time for site, not for each fingerprint request."), examples:
			 [
				 {
					code:tr("Empty string"),description:tr("Use standard fingerprint. Canvas data will be replaced, by adding noise.")
				 },
				 {
					code:tr("PerfectCanvas request"),description:tr("Use fingerprint with PerfectCanvas. All canvas data, which matches request will be replaced with images from real devices. Any other canvas data will be replaced by adding noise.")
				 }
			 ]
		 }
		  }) %>
		 <div style="margin-bottom:5px;margin-left:20px;font-size:small">
			<a href="#" class="tr-en"  onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/doku.php?id=perfectcanvas#how_to_obtain_perfectcanvas_request'); return false;">
				<span class="tr">How to get PerfectCanvas request?</span>
			</a>
			<a href="#" class="tr-ru"  onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/doku.php?id=ru:perfectcanvas#%D0%BA%D0%B0%D0%BA_%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81_perfectcanvas'); return false;">
				<span class="tr">How to get PerfectCanvas request?</span>
			</a>

			
		</div>

		<%= _.template($('#input_constructor').html())({id:"PerfectCanvasDebug", description:tr("PerfectCanvas logs"), default_selector: "string", disable_int:true, value_string: "false", variants: ["true", "false"],
		 help: 
		 {
			 description: tr("Is it necessary to add logs while obtaining fingerprint with PerfectCanvas."), examples:
			 [
				 {
					code:"true",description:tr("Add logs, may be useful for diagnostic.")
				 },
				 {
					code:"false",description:tr("Disable logs, fingerprint will be obtained without any messages.")
				 }
			 ]
		 } }) %>
		
		<div style="height:0px;clear: both;margin-bottom:-4px">&nbsp;</div>
  </span>

  

  <div style="margin-left: 15px; background-color: #f1f1f1; padding: left:10px; padding-left: 10px; border-radius: 2px; margin-top: 3px; margin-bottom: 4px; margin-right: 15px;">
  	<input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" style="margin-top: 6px;" /> 
  	<label for="AdvancedCheck" class="tr" style="margin-bottom: 6px;width: calc(100% - 40px);cursor:pointer" >Options</label>
  </div>

  <span id="Advanced" style="display:none;">
  		<%= _.template($('#input_constructor').html())({id:"AddedDate", description:tr("Minimum added date"), default_selector: "string", disable_int:true, value_string:"*", variants: ["*", '15 days', '30 days', '60 days'], help: 
		{
			description: tr("Select only fingerprints, which added date matches certain condition"), examples:
			[
				{
					code:"*",description:tr("Doesn't filter on added date")
				},
				{
					code:"15 days",description:tr("Select only fingerprints, which was added to database no more than 15 days ago")
				}
			]
		} }) %>
		<%= _.template($('#input_constructor').html())({id:"BrowserVersion", description:tr("Minimum browser version"), default_selector: "string", value_string:"*", variants: ["*", "75"], help: 
		{
			description: tr("Select only fingerprints, which has certain browser version. It is recommended to use this option together with explicitly specifying browser name. For example, you can select fingerprints for Chrome browser with version greater than 75."), examples:
			[
				{
					code:"*",description:tr("Doesn't filter on browser version")
				},
				{
					code:"75",description:tr("Browser version must be equal or greater than 75")
				}
			]
		} }) %>
		<%= _.template($('#input_constructor').html())({id:"MinimumWidth", description:tr("Minimum browser width"), default_selector: "string", value_string:"*", variants: ["*", "1600"], help: 
		{
			description: tr("Select only fingerprints, which has minimum browser width."), examples:
			[
				{
					code:"*",description:tr("Doesn't filter on browser width")
				},
				{
					code:"1600",description:tr("Browser width must be equal or greater than 1600")
				}
			]
		} }) %>
		<%= _.template($('#input_constructor').html())({id:"MinimumHeight", description:tr("Minimum browser height"), default_selector: "string", value_string:"*", variants: ["*", "900"], help: 
		{
			description: tr("Select only fingerprints, which has minimum browser height."), examples:
			[
				{
					code:"*",description:tr("Doesn't filter on browser height")
				},
				{
					code:"900",description:tr("Browser height must be equal or greater than 900")
				}
			]
		} }) %>

		<%= _.template($('#input_constructor').html())({id:"MaximumWidth", description:tr("Maximum browser width"), default_selector: "string", value_string:"*", variants: ["*", "2000"], help: 
		{
			description: tr("Select only fingerprints, which has maximum browser width."), examples:
			[
				{
					code:"*",description:tr("Doesn't filter on browser width")
				},
				{
					code:"2000",description:tr("Browser width must be equal or less than 2000")
				}
			]
		} }) %>
		<%= _.template($('#input_constructor').html())({id:"MaximumHeight", description:tr("Maximum browser height"), default_selector: "string", value_string:"*", variants: ["*", "1200"], help: 
		{
			description: tr("Select only fingerprints, which has maximum browser height."), examples:
			[
				{
					code:"*",description:tr("Doesn't filter on browser height")
				},
				{
					code:"1200",description:tr("Browser height must be equal or less than 1200")
				}
			]
		} }) %>
		
  </span>

  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "FINGERPRINT", help: 
	{
		description: tr("This variable will contain fingerprint string. Fingerprint string contains all data necessary to change fingerprint. It can be used immediately with 'Apply fingerprint' action. It also can be saved to a text file or database and reused later.")
	}}) %>

</div>


<div class="tooltipinternal">
      <div class="tr tooltip-paragraph-first-fold">Get browser fingerprint, which contains: user agent, screen size, navigator, fonts and many more.</div>
	<div class="tr tooltip-paragraph-fold">After execution of this action will complete, [[FINGERPRINT]] variable will contain fingerprint string. Fingerprint string contains all data necessary to change fingerprint. It can be used immediately with 'Apply fingerprint' action. It also can be saved to a text file or database and reused later.</div>
      <div class="tr tooltip-paragraph-fold">Using this action is like user agent switcher on steroids. It changes not only user agent, but a lot of browser internals to make BAS actually look like firefox, chrome, safari, on desktop or on mobile.</div>
      <div class="tr tooltip-paragraph-fold">Several additional features may be used to make your browser less detectable. Apply proxy through 'Proxy' action. Change timezone with 'Set timezone and geolocation by ip' action. Use, store and reuse profiles, because starting browser on newly created profiles may be suspicious.</div>
      <div class="tooltip-paragraph-fold"><span class="tr">Fingerprints are fetched from</span> <a href="#"  onclick="BrowserAutomationStudio_OpenUrl('https://fingerprints.bablosoft.com'); return false;">
  		FingerprintSwitcher</a> <span class="tr">service, in order to use that service, you need to </span>
		<a href="#"  onclick="BrowserAutomationStudio_OpenUrl('https://bablosoft.com/shop/FingerprintSwitcher'); return false;" class="tr">buy a key</a>.
      </div>
      <div class="tr tooltip-paragraph-fold">However, you may get fingerprints for free with Microsoft Windows,Chrome tags and with requests limits. In order to run free version, leave 'Service key' field blank.</div>
      <div class="tr tooltip-paragraph-fold">Fingerprint service fetches data from a real browsers on real devices, so you may be sure, that fingerprints are always fresh - contain actual user agent, plugin versions, etc.</div>
      <div class="tr tooltip-paragraph-fold">Applying fingerprint doesn't require browser restart, so it won't reset your settings.</div>

	  <div class="tooltip-paragraph-fold"><span class="tr">By default FingerprintSwitcher adds noise to canvas data. If you want to have more accurate results, use PerfectCanvas technology. It renders canvas data on real device and then replaces canvas fingerprinting results inside your browser. In order to use it, some preparation must be made. You need to fill "PerfectCanvas request" field. Data for this field can be obtained by using CanvasInspector application. This application is free and easy to install, it allows to get PerfectCanvas request for site that you working with. More info and download link can be found</span> 
	  <a href="#" class="tr-en tr" onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/doku.php?id=perfectcanvas#how_to_obtain_perfectcanvas_request'); return false;">here</a>
	  <a href="#" class="tr-ru tr" onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/doku.php?id=ru:perfectcanvas#%D0%BA%D0%B0%D0%BA_%D0%BF%D0%BE%D0%BB%D1%83%D1%87%D0%B8%D1%82%D1%8C_%D0%B7%D0%B0%D0%BF%D1%80%D0%BE%D1%81_perfectcanvas'); return false;">here</a>.</div>

	  <div class="tr tooltip-paragraph-fold">In order to replace fingerprint with PerfectCanvas, it is sufficient to call this action with "PerfectCanvas request" field filled out, and then use fingerprint by calling "Apply fingerprint" action.</div>

	  <div class="tr tooltip-paragraph-fold">"PerfectCanvas request" data is obtained one time for site, not for each fingerprint request.</div>

	  <div class="tr tooltip-paragraph-fold">If you leave "PerfectCanvas request" field empty, this action will return standart fingerprint with noise canvas replacement.</div>
	  <div class="tr tooltip-paragraph-fold">Getting fingerprint with PerfectCanvas may require some time depending on request queue length and tag combination that you are using. If you are using combination of tags which are rare, this can be slow. Use * as input for "Tags" field to speed up process. Obtaining fingerprint for popular service may also be slow.</div>
	  <div class="tr tooltip-paragraph-fold">Getting fingerprint with PerfectCanvas can only performed in single thread, you can still use several threads, but rest of the threads will be waiting, while only one will work.</div>

	  <div class="tr tooltip-paragraph-fold">If you have "PerfectCanvas request" field prepared for "site A", and you visit "site B" then canvas data for "site B" will be replaced by adding noise. If you want canvas data to be replaced for both sites, you have to prepare request for both "site A" and "site B".</div>

	  

	  <div class="tr tooltip-paragraph-fold">In order to check if data for PerfectCanvas was actually replaced check log at BrowserAutomationStudio/apps/CURRENT_BAS_VERSION/s/PROCESS_ID.txt file.</div>



      <div class="tooltip-paragraph-last-fold"><span class="tr">You can find more information and get test fingerprints on following page</span> <a href="#"  onclick="BrowserAutomationStudio_OpenUrl('https://fingerprints.bablosoft.com'); return false;">
  		FingerprintSwitcher</a>.</div>
</div>


<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
