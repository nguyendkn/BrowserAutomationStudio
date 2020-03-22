<div class="container-fluid">

  <div class="col-xs-12">
    <form class="form-horizontal">
      <div class="form-group">
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Authentication</span></span>:
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <div class="tr" style="margin-left:15px;color:gray;font-size:small">You must fill login and password in order to use proxies. Your login and password can be found on <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/cp/api_example?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri');return false">following page</a> ( <a href="#" onclick="BrowserAutomationStudio_OpenUrl('http://wiki.bablosoft.com/lib/exe/fetch.php?cache=&media=luminatiloginandpassword.png');return false">screenshot</a> ).</div>

        
      </div>
    </form>
  </div>


<%= _.template($('#input_constructor').html())({id:"Zone", description:tr("Zone name"), default_selector: "string", disable_int:true, value_string:"", help: {description: tr("Zone name which you want to use. A 'zone' is Luminati's name for the specific set of parameters you've chosen to use for a set of proxy requests. Zone must be created before using proxies, you can do that on 'Zones' tab.")} }) %>
  <%= _.template($('#input_constructor').html())({id:"Login", description:tr("Account login"), default_selector: "string", disable_int:true, value_string:"", help: {description: tr("Your account id which you used to register in luminati.io.")} }) %>
  <%= _.template($('#input_constructor').html())({id:"Password", description:tr("Zone password"), default_selector: "string", disable_int:true, value_string:"", help: {description: tr("Password for selected zone. This is password for zone, not for your account. Can be found on 'Api and examples' tab or in zone settings.")} }) %>



  <div style="margin-left: 20px;">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" /> 
    <label for="AdvancedCheck" class="tr" >Advanced settings.</label>
  </div>
  <span id="Advanced" style="display:none">

  <div class="col-xs-12">
    <form class="form-horizontal">
      <div class="form-group">
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Proxy target</span></span>:
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <div class="tr" style="margin-left:15px;color:gray;font-size:small">Proxy can be applied either to browser or to http client.</div>
      </div>
    </form>
  </div>
  
  <%= _.template($('#input_constructor').html())({id:"Target", description:tr("Proxy target component"), default_selector: "string", disable_int:true, value_string:"Browser", variants: ["Browser", "HTTPClient"], help: {description: tr("For which BAS component proxy will be applied. It can be applied to http client or browser."),examples:[
  {code:tr("Browser"),description:tr("Apply proxy to browser")},
  {code:tr("HTTPClient"),description:tr("Apply proxy to http client")}
]} }) %>

  
  <div class="col-xs-12">
    <form class="form-horizontal">
      <div class="form-group">
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Proxy location</span></span>:
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <div class="tr" style="margin-left:15px;color:gray;font-size:small">By default random proxy will be selected. If you want to select proxy from specific country or city, change setting below. Everything except country settings requires special permission and may not work if this permission is not set. Proxies may be selected for AS (Autonomous System), which is a group of IP networks operated by one or more network operator. ASN is the unique global identifier (a number) that is associated with every AS. <a href="#" onclick="BrowserAutomationStudio_OpenUrl('http://bgp.potaroo.net/cidr/autnums.html');return false">ASN list</a></div>
      </div>
    </form>
  </div>

    <%= _.template($('#input_constructor').html())({id:"Country", description:tr("Country"), default_selector: "string", disable_int:true, value_string:""

        , variants: ["AM", "AR", "AT", "AU", "AZ", "BE", "BO", "BR", "BY", "CA", "CH", "CL", "CN", "CO", "CZ", "DE", "DK", "DO", "EC", "EE", "ES", "FI", "FR", "GB", "GE", "HK", "ID", "IE", "IL", "IN", "IT", "JM", "JP", "KG", "KH", "KR", "KZ", "LA", "LK", "LT", "LU", "LV", "MD", "MX", "MY", "NL", "NO", "NZ", "PE", "PH", "RU", "SE", "SG", "TH", "TJ", "TM", "TR", "TW", "UA", "US", "UZ", "VN"]
        
        , help: {description: tr("Select proxy from specific country. Leave empty string to use any country.")

    ,examples:[
      {code:tr("Empty string"),description:tr("Use proxies from any country")},
      {code:tr("US"),description:tr("Use proxies from United States")}
    ]} }) %>

    <%= _.template($('#input_constructor').html())({id:"City", description:tr("City"), default_selector: "string", disable_int:true, value_string:""

        , help: {description: tr("City string. Selecting the location of the IP at a city level is a premium feature.")

    ,examples:[
      {code:tr("Empty string"),description:tr("Use proxies from any city")},
      {code:tr("losangeles"),description:tr("Los Angeles")}
    ]} }) %>


    <%= _.template($('#input_constructor').html())({id:"ASN", description:tr("ASN"), default_selector: "string", disable_int:true, value_string:""

        , help: {description: tr("ASN. An AS (Autonomous System) is a group of IP networks operated by one or more network operator(s) that has an external routing policy. ASN is the unique global identifier (a number) that is associated with every AS.")

    ,examples:[
      {code:tr("Empty string"),description:tr("Use proxies from any AS")},
      {code:tr("1234"),description:tr("FORTUM-AS Fortum")}
    ]} }) %>


    <%= _.template($('#input_constructor').html())({id:"Carrier", description:tr("Carrier"), default_selector: "string", disable_int:true, value_string:"", variants: ["a1", "aircel", "airtel", "att", "celcom", "chinamobile", "claro", "comcast", "cox", "digi", "dt", "docomo", "dtac", "etisalat", "idea", "kyivstar", "meo", "megafon", "mtn", "mtnza", "mts", "optus", "orange", "qwest", "reliance_jio", "robi", "sprint", "telefonica", "telstra", "tmobile", "tigo", "tim", "verizon", "vimpelcom", "vodacomza", "vodafone", "vivo", "zain"]
        , help: {description: tr("Select proxy from specific carrier.")

    ,examples:[
      {code:tr("Empty string"),description:tr("Use proxies from any carrier")},
      {code:tr("dt"),description:tr("Select proxies from Deutsche Telekom")}
    ]} }) %>


    <div class="col-xs-12">
    <form class="form-horizontal">
      <div class="form-group">
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Reuse proxies</span></span>:
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <div class="tr" style="margin-left:15px;color:gray;font-size:small">This action will select new proxy every time it is called. If you want to select ip which you used before, fill settings below.</div>
      </div>
    </form>
  </div>

  <%= _.template($('#input_constructor').html())({id:"IP", description:tr("IP"), default_selector: "string", disable_int:true, value_string:""
        , help: {description: tr("Select specific IP. It could be IP, which was used before. Zone setting page has link 'Download IPs list' which points to file with IP list for current zone.")

    ,examples:[
      {code:tr("Empty string"),description:tr("Select random proxy")},

      {code:tr("111.111.111.111"),description:tr("Select 111.111.111.111 IP.")}
    ]} }) %>
    
   <%= _.template($('#input_constructor').html())({id:"gIP", description:tr("gIP"), default_selector: "string", disable_int:true, value_string:""
        , help: {description: tr("A gIP is a group of exclusive residential IPs. Each gIP contains between 3-30 IPs. All the IPs within a gIP are from the same country ASN and city (depending on the network you are using). Using gIPs ensures that nobody else uses the same IPs with the same target sites as you do. Luminati blocks several domains if you don't use gIPs. Contact your account manager for details.")

    ,examples:[
      {code:tr("5555"),description:tr("Use gIP with id 5555")}
    ]} }) %>


   <div class="col-xs-12">
    <form class="form-horizontal">
      <div class="form-group">
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Proxy type</span></span>:
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <div class="tr" style="margin-left:15px;color:gray;font-size:small">Select mobile IPs. Mobile IPs are IPs assigned to mobile devices by mobile internet carriers. When using mobile IPs you will see the internet the same way a user would when browsing the web through their mobile device.
          <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/mobileips?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri');return false">Learn more.</a>
          
        </div>
      </div>
    </form>
  </div>

  <%= _.template($('#input_constructor').html())({id:"Mobile", description:tr("Use mobile proxies"), default_selector: "string", disable_int:true, value_string:"false", variants: ["true", "false"]
        , help: {description: tr("Use IPs assigned to mobile defices.")

    ,examples:[
      {code:tr("true"),description:tr("Use mobile proxies.")},
      {code:tr("false"),description:tr("Don't use mobile proxies.")}
    ]} }) %>

    


    <div class="col-xs-12">
    <form class="form-horizontal">
      <div class="form-group">
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">DNS resolving location</span></span>:
        <hr style="margin-top:5px;margin-bottom:5px"/>
        <div class="tr" style="margin-left:15px;color:gray;font-size:small">Local resolve type is more faster but in that case proxy country and IP country may differ.</div>
      </div>
    </form>
  </div>
  
  <%= _.template($('#input_constructor').html())({id:"DNS", description:tr("DNS resolve"), default_selector: "string", disable_int:true, value_string:"remote", variants: ["local", "remote"], help: {description: tr("Local resolve type is more faster but in that case proxy country and IP country may differ. That may look suspicious."),examples:[
  {code:tr("local"),description:tr("Resolve domain names on Super Proxy.")},
  {code:tr("remote"),description:tr("Resolve domain on Proxy Peer.")}
]} }) %>
  <div class="col-xs-12">
        <form class="form-horizontal">
          <div class="form-group">
            <hr style="margin-top:5px;margin-bottom:5px"/>
          </div>
        </form>
    </div>

  </span>
    
  </div>


<div class="tooltipinternal">

	<div class="tr tooltip-paragraph-first-fold">Use Luminati proxies inside BAS. <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri');return false" class="tr">Luminati</a> is world's largest
proxy network. It offers more than 30 millions of mobile, residental and datacenter IPs which can be filtered over countries, cities, ASN and carriers.</div>

  <div class="tr tooltip-paragraph-fold">To start using proxies, login to Luminati account, then go to <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/cp/zones?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri');return false" class="tr">Zones page</a>. A 'zone' is Luminati's name for the specific set of parameters you have chosen to use for a set of proxy requests. Read <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/faq?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri#start-zone');return false" class="tr">more about zones</a>.</div>
  
	<div class="tr tooltip-paragraph-fold">Then you need to visit <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/cp/api_example?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri');return false">API and examples</a> page and copy your login, zone password and zone name ( <a href="#" onclick="BrowserAutomationStudio_OpenUrl('http://wiki.bablosoft.com/lib/exe/fetch.php?cache=&media=luminatiloginandpassword.png');return false">screenshot</a> ).</div>
	<div class="tr tooltip-paragraph-fold">Put these values into 'Zone name', 'Account login' and 'Zone password' parameters of this action.</div>
	<div class="tr tooltip-paragraph-fold">Thats it, proxies are setup and you are ready to use them.</div>
	<div class="tr tooltip-paragraph-fold">If you use same proxy in different threads, then each thread will have different proxy.</div>
  <div class="tr tooltip-paragraph-fold">If you want to change proxy inside thread, just call this action again.</div>
  <div class="tr tooltip-paragraph-fold">By default this action will change proxy only for browser, if you want to change it for http client, open advanced settings and change 'Proxy target component' parameter.</div>
  <div class="tr tooltip-paragraph-fold">Advanced tab contains a lot of more setting, but it is not required to change anything there. List of settings: 'Proxy location', 'Reuse proxies', 'Mobile proxies', 'DNS resolver'. If you want more details, hover mouse on question mark near corresponding parameters.</div>
	<div class="tr tooltip-paragraph-last-fold">If you have any question regarding Luminati proxies, visit <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://luminati.io/faq?affiliate=ref_5b2a194821e9e462666c9e6f&cam=L_ofri');return false">FAQ</a> page.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>