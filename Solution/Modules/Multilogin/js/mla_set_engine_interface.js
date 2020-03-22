<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({id:"Value", description:tr("Browser type"), default_selector: "string", disable_int:true, value_string:"MLAMimic", variants: ["BASChrome", "MLAMimic"], help: {description: tr("Browser type. BASChrome is standart BAS browser and MLAMimic is safe Multilogin browser based on Chrome.")} }) %>
  <div style="margin-left: 20px;">
    <input type="checkbox" id="AdvancedCheck" onchange="$('#Advanced').toggle()" /> 
    <label for="AdvancedCheck" class="tr" >Advanced settings.</label>
  </div>
  <span id="Advanced" style="display:none">
  
    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Security settings</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
        </div>
      </form>
    </div>

    <%= _.template($('#input_constructor').html())({id:"DisablePlugins", description:tr("Disable plugins"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true","false"], help: {description: tr("Disable all browser plugins(not extensions), for example Chrome PDF Viewer. This option doesn't affect flash plugin.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"DisableFlashPlugins", description:tr("Disable flash plugins"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true","false"], help: {description: tr("Disable flash plugin.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"MaskFonts", description:tr("Mask fonts"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true","false"]}) %>
    <%= _.template($('#input_constructor').html())({id:"CanvasDefType", description:tr("Canvas defence type"), default_selector: "string", disable_int:true, value_string: "NOISE", variants: ["NOISE","BLOCK"], help: {description: tr("Noise option will add noise to canvas data rendered with browser. Block option will disable obtaining data from canvas.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"AudioNoise", description:tr("Audio noise"), default_selector: "string", disable_int:true, value_string:"true", variants: ["true","false"]}) %>

    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Proxy</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">Use <a href="#!/proxy">Proxy</a> action to change your ip.</div>
        </div>
      </form>
    </div>
    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span  style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Chrome extensions</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">To use extension, you must download it and specify full path. Find extension <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://chrome.google.com/webstore/category/extensions');return false">here</a>, and download it from <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://chrome-extension-downloader.com/');return false">here</a>.</div>

        </div>
      </form>
    </div>
    <%= _.template($('#input_constructor').html())({id:"Extensions", description:tr("Filepath to custom chrome extensions"), default_selector: "string", disable_int:true, disable_editor:true, disable_string:true, use_textarea:true, size: 8, disable_type_chooser:true,textarea_height:80, help: {description: tr("List of filepathes to custom Chrome extensions. Each line should contain one extension.")}}) %>
    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span  style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Profiles</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">You can use local profiles and online profiles. In case if local profile is used, browser fingerprint, cookies, localstorage, cache and other data will be located inside specified folder on PC where BAS is run. In case if online profile is used, all data will be stored on Multilogin server. Number of online profiles is limited, but local profiles are unlimited. By default BAS creates local profile inside temporary folder, but you can change this behavior. Use "Work with profiles" module to do that.</div>

        </div>
      </form>
    </div>

    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Browser settings</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">If you want to set user agent or browser language, use <a href="#!/setheader">Set Header</a> action.</div>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">You can leave following options with empty values, Multilogin will fill it with values from real browser.</div>
        </div>
      </form>
    </div>
    <%= _.template($('#input_constructor').html())({id:"Platform", description:tr("navigator.platform"), default_selector: "string", disable_int:true, value_string: "", variants: ["ARM","BlackBerry","Linux aarch64","Linux armv6l","Linux armv7l","Linux armv8l","Linux i686","Linux x86_64","MacIntel","Pike v7.8 release 517","Win32","Win64","Windows","iPad","iPhone","iPod touch"], help: {description: tr("navigator.platform javascript property")}}) %>
    <%= _.template($('#input_constructor').html())({id:"DoNotTrack", description:tr("Do not track"), default_selector: "string", disable_int:true, value_string: "", variants: ["1","0"]}) %>
    <%= _.template($('#input_constructor').html())({id:"HardwareConcurrency", description:tr("navigator.hardwareConcurrency"), default_selector: "string", disable_int:true, value_string: "", variants: ["0","1","2","3","4","5","6","8","10","12","14","16","24","32","40","48","56","64"], help: {description: tr("navigator.hardwareConcurrency javascript property")}}) %>
    <%= _.template($('#input_constructor').html())({id:"AppVersion", description:tr("navigator.appVersion"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("navigator.appVersion javascript property")}}) %>
    <%= _.template($('#input_constructor').html())({id:"BuildID", description:tr("navigator.buildID"), default_selector: "string", disable_int:true, variants: ["20100101","20110928134238","20120614114901","20130511120803","20130910160258","20130910201120","20140130133634","20140923175406","20141024163411","20150108202552","20150305021524","20150320202338","20150504194141","20150525141253","20150826185918","20150925121647","20151029151421","20151105173914","20151110114827","20151216175450","20160105164030","20160107230306","20160210153822","20160315153207","20160407164938","20160502172042","20160511224433","20160601155443","20160604131506","20160623154057","20160726073904","20160726133114","20160813173522","20160823121617","20160922113459","20160924143103","20161019084923","20161031133903","20161104212021","20161123182536","20161129173726","20161201160049","20161208153507","20170118123525","20170125094131","20170128130711","20170201175806","20170208135532","20170211095930","20170227080736","20170302120751","20170316213829","20170323105023","20170323110425","20170324081508","20170329151308","20170331185006","20170411115307","20170413192749","20170419042421","20170504000000","20170504105526","20170504112025","20170504210220","20170517122419","20170518000419","20170524074829","20170524095044","20170608105825","20170613225334","20170616092053","20170627155318","20170628075643","20170628221524","20170707010522","20170713130618","20170802111520","20170803103124","20170811091919","20170814072924","20170815231002","20170816210057","20170824053622","20170824053838","20170826053331","20170831165232","20170921064520","20170922113428","20170922214822","20170926190823","20170928210252","20170929141416","20171002220106","20171005074949","20171024165158","20171030111120","20171107091003","20171112125346","20171113102334","20171114144010","20171114144214","20171114145633","20171114221957","20171115002005","20171123171603","20171123171849","20171124063547","20171124072126","20171128222554","20171129020910","20171129230227","20171129230250","20171129230835","20171129231020","20171130142844","20171130143349","20171130143648","20171201080803","20171204150510","20171205144502","20171205182715","20171206074519","20171206101620","20171206182557","20171207170405","20171208112725","20171208114127","20171210100145","20171211020921","20171211145208","20171213100213","20171218174357","20171219100203","20171223095456","20171224121600","20171226003912","20171226083017","20171226085105","20180103230655","20180103231032","20180104072352","20180104101351","20180104101655","20180104101725","20180104113147","20180106205129","20180106213355","20180118122319","20180118215408","20180122122904","20180122225619","20180122225924","20180123215146","20180126021812","20180128191252","20180128191456","20180130111628","20180131005501","20180131010234","20180201171410","20180202202613","20180206200532","20180207210535","20180208173149","20180208175058","20180208181723","20180208193705","20180209193630","20180209195328","20180217100053","20180219114835","20180222170353","20180301022608","20180307131617","20180310025718","7501","7600"], help: {description: tr("navigator.buildID javascript property")}}) %>
    <%= _.template($('#input_constructor').html())({id:"MediaDevicesAudioInputs", description:tr("MediaDevices AudioInputs"), default_selector: "string", disable_int:true, value_string: "3", variants: ["1","2","3"], help: {description: tr("Data obtained with MediaDevices.enumerateDevices javascript function")}}) %>
    <%= _.template($('#input_constructor').html())({id:"MediaDevicesAudioOutputs", description:tr("MediaDevices AudioOutput"), default_selector: "string", disable_int:true, value_string: "2", variants: ["1","2","3"], help: {description: tr("Data obtained with MediaDevices.enumerateDevices javascript function")}}) %>
    <%= _.template($('#input_constructor').html())({id:"MediaDevicesVideoInputs", description:tr("MediaDevices VideoInputs"), default_selector: "string", disable_int:true, value_string: "1", variants: ["1","2","3"], help: {description: tr("Data obtained with MediaDevices.enumerateDevices javascript function")}}) %>
    
    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Custom dns</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">By default Multilogin will resolve domains with proxy server. If you want to specify dns, use this option.</div>

        </div>
      </form>
    </div>
    <%= _.template($('#input_constructor').html())({id:"Dns", description:tr("Dns ips"), default_selector: "string", disable_int:true, disable_editor:true, disable_string:true, use_textarea:true, size: 8, disable_type_chooser:true,textarea_height:80, help: {description: tr("List of dns ips. Each line should contain one ip.")}}) %>

    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span style="margin-left:15px;"><span class="tr" style="font-weight: bold;">Timezone settings</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">By default Multilogin will set timezone accordingly to your proxy settings, but you can set exact value with <a href="#!/timezones_set_timezone">Set timezone</a> action.</div>
        </div>
      </form>
    </div>
    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span style="margin-left:15px;"><span class="tr"  style="font-weight: bold;">Geolocation settings</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">By default Multilogin will set geolocation settings accordingly to your proxy settings, but you can set exact value with <a href="#!/timezones_set_geolocation">Set geolocation</a> action.</div>
        </div>
      </form>
    </div>
    <div class="col-xs-12">
     <form class="form-horizontal">
        <div class="form-group">
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span class="tr" style="margin-left:15px;"><span style="font-weight: bold;">Webgl</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
        </div>
      </form>
    </div>
    <%= _.template($('#input_constructor').html())({id:"WebglNoise", description:tr("Webgl noise"), default_selector: "string", disable_int:true, value_string: "true", variants: ["true","false"], help: {description: tr("Setting this option to true will change your webgl fingerprint by adding noise.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"WebglVendor", description:tr("Webgl vendor"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Your videocard vendor.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"WebglRenderer", description:tr("Webgl renderer"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Your videocard name.")}}) %>
    
    <div class="col-xs-12" >
     <form class="form-horizontal">
        <div class="form-group" >
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <span class="tr" style="margin-left:15px;"><span style="font-weight: bold;">Webrtc</span></span>:
          <hr style="margin-top:5px;margin-bottom:5px"/>
          <div class="tr" style="margin-left:15px;color:gray;font-size:small">Enabling webrtc may expose your real ip even if you are using proxies. Multilogin will replace ip returned by webrtc with public ip of your proxy by default. You can set custom ip with "Webrtc public ip" and "Webrtc local ips" options.</div>

        </div>
      </form>
    </div>
    <%= _.template($('#input_constructor').html())({id:"Webrtc", description:tr("Webrtc type"), default_selector: "string", disable_int:true, value_string: "FAKE", variants: ["FAKE","BLOCK"], help: {description: tr("FAKE option will replace your ip with specified in \"Webrtc public ip\" opition. If you leave \"Webrtc public ip\" option blank, than public ip of your proxy will be used. BLOCK will just block webrtc.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"WebrtcPublicIp", description:tr("Webrtc public ip"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Your public ip exposed by webrtc, better to leave that option blank, in that case ip of your proxy will be used.")}}) %>
    <%= _.template($('#input_constructor').html())({id:"WebrtcLocalIps", description:tr("Webrtc local ips"), default_selector: "string", disable_int:true, disable_editor:true, disable_string:true, use_textarea:true, size: 8, disable_type_chooser:true,textarea_height:80, help: {description: tr("List of local ips exposed by webrtc.")}}) %>
  </span>
    
  </div>


<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">This action tells BAS to use one of Multilogin browser engine. Whole script will be run with Multilogin browser instead of BAS default browser. Using this action will change browser fingerprint and increase anonymity. Check this <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://multilogin.com/');return false">link</a> to learn more about Multilogin.</div>
  <div class="tr tooltip-paragraph-fold">This module is still under development, so it may contain bugs or some functionality may be missing. To check if it support all you need, see this <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://docs.google.com/spreadsheets/d/1mE7ltBeUYKTi3Ot3yJJHknfN_8rZ0eXX0Sla22VOWiE/edit?usp=sharing');return false">table</a>.</div>
  <div class="tooltip-paragraph-fold"><span class="tr">Please contact Multilogin support to get key</span>(<a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://multilogin.com/contact-us/');return false" class="tr">contact</a>).</div>
	<div class="tr tooltip-paragraph-fold">Browser type parameter may have two values. BASChrome - is BAS standart browser, MLAMimic - is Mimic browser based on Chrome.</div>
	<div class="tr tooltip-paragraph-fold">Any Multilogin browser will take settings from BAS script, this includes proxy, headers, browser size, etc. All you need to do is to run your script with Multilogin is call this action at thread start.</div>
	<div class="tr tooltip-paragraph-fold">Some features is available only for Multilogin browser but not available for BAS browser, this is extension list and fingerprint specific options. To change them, please expand Advanced panel.</div>
	<div class="tr tooltip-paragraph-fold">You can change browser engine dynamically during thread run. To start using BAS browser again call this action with BASChrome parameter, but all settings like proxy, headers, etc will reset.</div>
	<div class="tr tooltip-paragraph-last-fold">You should use this action as soon as possible(at thread start). If you use it after page first load, than browser process will restart.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>