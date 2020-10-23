function BrowserAutomationStudio_PerformanceFingerprint()
{
	FINGERPRINT_JSON = _arguments()
	if(!FINGERPRINT_JSON.time_deformation)
	{
		FINGERPRINT_JSON.time_deformation = Math.random() * (FINGERPRINT_JSON.time_deformation_to - FINGERPRINT_JSON.time_deformation_from) + FINGERPRINT_JSON.time_deformation_from
	}

	delete FINGERPRINT_JSON.time_deformation_to
	delete FINGERPRINT_JSON.time_deformation_from

	if(_get_profile().length > 0)
	{
	    native("filesystem", "writefile", JSON.stringify({path: _get_profile() + "/performance.json",value: JSON.stringify(FINGERPRINT_JSON),base64:false,append:false}))
	}

	_settings(
		{
			"Fingerprints.Performance.Precision": (FINGERPRINT_JSON.disable_performance_precision ? "Enable": "Disable"),
			"Fingerprints.Performance.TimeDeformation": (FINGERPRINT_JSON.time_deformation).toString(),
			"Fingerprints.Performance.MaxMeasurmentTime": (FINGERPRINT_JSON.max_measurement_time).toString()
		})!
}

function BrowserAutomationStudio_GetFingerprint()
{
	if(_arguments().length != 1)
		fail("Wrong number of input params")

	FINGERPRINT_JSON = _arguments()[0]

	var q = (FINGERPRINT_JSON.tags).split(",").map(function(el){return el.trim()})
	if(q.length == 0 || q.length == 1 && q[0] == "*")
	{
		q = ((FINGERPRINT_JSON.key).length > 0) ? ("?version=4&key=" + encodeURIComponent(FINGERPRINT_JSON.key)) : "?version=4"
		if(FINGERPRINT_JSON.perfectcanvas_request.length > 0)
		{
			q += "&tags=*"
		}
	}else
	{
    	q = "?version=4&tags=" + encodeURIComponent(q.join(",")) + (((FINGERPRINT_JSON.key).length > 0) ? ("&key=" + encodeURIComponent(FINGERPRINT_JSON.key)) : "")
	}

	if(FINGERPRINT_JSON.min_browser_version != "*")
		q += "&min_browser_version=" + parseInt(FINGERPRINT_JSON.min_browser_version)

	if(FINGERPRINT_JSON.min_width != "*")
		q += "&min_width=" + parseInt(FINGERPRINT_JSON.min_width)	

	if(FINGERPRINT_JSON.min_height != "*")
		q += "&min_height=" + parseInt(FINGERPRINT_JSON.min_height)	

	if(FINGERPRINT_JSON.max_width != "*")
		q += "&max_width=" + parseInt(FINGERPRINT_JSON.max_width)	

	if(FINGERPRINT_JSON.max_height != "*")
		q += "&max_height=" + parseInt(FINGERPRINT_JSON.max_height)

	if(FINGERPRINT_JSON.time_limit != "*")
		q += "&time_limit=" + encodeURIComponent(FINGERPRINT_JSON.time_limit)	

	var api_url;
	
	if(FINGERPRINT_JSON.perfectcanvas_request.length > 0)
	{
		api_url = "https://canvas.bablosoft.com/prepare"
	}else
	{
		api_url = "https://fingerprints.bablosoft.com/prepare"
	}

	api_url += q

	FINGERPRINT_JSON.perfectcanvas_logs = FINGERPRINT_JSON.perfectcanvas_logs == "true"


	_switch_http_client_internal()
	http_client_set_fail_on_error(false)

	_if_else(FINGERPRINT_JSON.perfectcanvas_request.length > 0, function(){
		if(FINGERPRINT_JSON.perfectcanvas_logs)
		{
			log("(PerfectCanvas) Start obtaining fingerprint")
		}
		_do(function(){
			http_client_post(api_url, ["data", FINGERPRINT_JSON.perfectcanvas_request], {"content-type":"custom/" + ("application/octet-stream"), "encoding":("UTF-8"), "method":("POST"),headers:("Accept-Encoding: gzip, deflate")})!

			var json = http_client_content()
	
			try
			{
				var json_parsed = JSON.parse(json)
				if(json_parsed.Status == "success")
				{
					FINGERPRINT_JSON.request_id = json_parsed.Data
					_break()
				}else if(json_parsed.Status == "error")
				{
					log_fail("(PerfectCanvas) " + json_parsed.Message)
					fail(json_parsed.Message)
				}else
				{
					if(FINGERPRINT_JSON.perfectcanvas_logs)
					{
						log("(PerfectCanvas) " + json_parsed.Message)
					}
				}
			}catch(e){}
	
			sleep(15000)!
		})!

		if(FINGERPRINT_JSON.perfectcanvas_logs)
		{
			log("(PerfectCanvas) Request id is " + FINGERPRINT_JSON.request_id)
		}

		sleep(5000)!

		_do(function(){
			http_client_get2("https://canvas.bablosoft.com/status/" + FINGERPRINT_JSON.request_id,{method:("GET"),headers:("Accept-Encoding: gzip, deflate")})!

			var json = http_client_content()
	
			try
			{
				var json_parsed = JSON.parse(json)
				if(json_parsed.Status == "success")
				{
					_set_result(json_parsed.Data)
					_break()
				}else if(json_parsed.Status == "error")
				{
					log_fail("(PerfectCanvas) " + json_parsed.Message)
					fail(json_parsed.Message)
				}else
				{
					if(FINGERPRINT_JSON.perfectcanvas_logs)
					{
						log("(PerfectCanvas) " + json_parsed.Message)
					}
				}
			}catch(e){}
	
			sleep(5000)!
		})!

		if(FINGERPRINT_JSON.perfectcanvas_logs)
		{
			log_success("(PerfectCanvas) Fingerprint has been obtained")
		}

	},function(){
		_do(function(){
			if(_iterator()>15)
				fail("Query limit reached")
	
			http_client_get2(api_url,{method:("GET"),headers:("Accept-Encoding: gzip, deflate")})!
			var json = http_client_content()
	
			try
			{
				var json_parsed = JSON.parse(json)
				if(!json_parsed["trylater"])
				{
					_set_result(json)
					_break()
				}
			}catch(e){}
	
			sleep(20000)!
		})!  
	})!

	
	delete FINGERPRINT_JSON


	http_client_set_fail_on_error(true)
	_switch_http_client_main()
}

function BrowserAutomationStudio_ApplyFingerprint()
{
	if(!_is_bas_browser_real())
    {
    	fail(tr("Fingerprint switcher is not integrated with Multilogin yet."))
        return
    }
	if(_arguments().length == 0)
		fail("fingerprint is empty")

	FINGERPRINT_JSON = null
	FINGERPRINT_CANVAS = false
	FINGERPRINT_WEBGL = false
	FINGERPRINT_AUDIO = false
	FINGERPRINT_BATTERY = false
	FINGERPRINT_RECTANGLES = false
	FINGERPRINT_PERFECTCANVAS = true

	if(typeof(_arguments()) == "object")
	{
		try{
			FINGERPRINT_JSON = JSON.parse(_arguments()[0])
		}catch(e)
		{
			fail(e.message)
		}
		if(_arguments().length > 1 && FINGERPRINT_JSON["canvas"])
			FINGERPRINT_CANVAS = _arguments()[1]
		if(_arguments().length > 2 && FINGERPRINT_JSON["webgl"])
			FINGERPRINT_WEBGL = _arguments()[2]
		if(_arguments().length > 3 && FINGERPRINT_JSON["audio"])
			FINGERPRINT_AUDIO = _arguments()[3]
		if(_arguments().length > 4 && FINGERPRINT_JSON["battery"])
			FINGERPRINT_BATTERY = _arguments()[4]
		if(_arguments().length > 5 && FINGERPRINT_JSON["rectangles"])
			FINGERPRINT_RECTANGLES = _arguments()[5]
		if(_arguments().length > 6 && FINGERPRINT_JSON["perfectcanvas"])
			FINGERPRINT_PERFECTCANVAS = _arguments()[6]
			
	}else
	{
		try{
			FINGERPRINT_JSON = JSON.parse(_arguments())
		}catch(e)
		{
			fail(e.message)
		}
	}
	
	//Check fingerprint is valid
    if(FINGERPRINT_JSON["valid"] == false)
	{
		var error = "Unknown error"
		if(FINGERPRINT_JSON["message"])
			error = FINGERPRINT_JSON["message"]
		fail("Fingerprint error: \""+ error + "\"") 
	}

	//Save fingerprint to profile
	if(_get_profile().length > 0)
	{
		var value = {
	   		"canvas": FINGERPRINT_CANVAS,
	   		"webgl": FINGERPRINT_WEBGL,
	   		"audio": FINGERPRINT_AUDIO,
	   		"battery": FINGERPRINT_BATTERY,
	   		"rectangles": FINGERPRINT_RECTANGLES
	   	}
		if(typeof(_arguments()) == "object")
		{
			value["fingerprint"] = _arguments()[0]
		}else
		{
			value["fingerprint"] = _arguments()
		}

	   	value = JSON.stringify(value)
	    native("filesystem", "writefile", JSON.stringify({path: _get_profile() + "/fingerprint.json",value: value,base64:false,append:false}))
	}



	_if(FINGERPRINT_CANVAS || FINGERPRINT_WEBGL || FINGERPRINT_AUDIO || FINGERPRINT_BATTERY || FINGERPRINT_RECTANGLES, function(){
		var Settings = {}

		if(FINGERPRINT_RECTANGLES)
		{
			Settings["Fingerprints.RectanglesReplace"] = "true"
			Settings["Fingerprints.RectanglesFingerprint"] = FINGERPRINT_JSON["rectangles"]
		}else
		{
			Settings["Fingerprints.RectanglesReplace"] = "false"
			Settings["Fingerprints.RectanglesFingerprint"] = ""
		}

		if(FINGERPRINT_CANVAS)
		{
			Settings["Canvas"] = "noise"
			Settings["CanvasNoise"] = FINGERPRINT_JSON["canvas"]
		}

		if(FINGERPRINT_WEBGL)
		{
			Settings["Webgl"] = "noise"
			Settings["WebglNoise"] = FINGERPRINT_JSON["webgl"]
			var Keys = Object.keys(FINGERPRINT_JSON["webgl_properties"])
			for(var i = 0;i<Keys.length;i++)
			{
				var Key = Keys[i]
				var Value = FINGERPRINT_JSON["webgl_properties"][Key]
				if(typeof(Value) == "number")
				{
					Value = Value.toString()
				}
				if(!Value)
					Value = ""
				if(typeof(Value) == "object")
				{
					var ValueKeys = Object.keys(Value)
					for(var j = 0;j<ValueKeys.length;j++)
					{
						var Key2 = ValueKeys[j]
						Settings["Webgl." + Key + "." + Key2] = Value[Key2].toString()
					}
				}else
				{
					Settings["Webgl." + Key] = Value
				}
				
				
			}
		}

		if(FINGERPRINT_BATTERY)
		{
			Settings["Fingerprints.BatteryEnabled"] = "true"
			Settings["Fingerprints.HasBatteryAPI"] = (FINGERPRINT_JSON["has_battery_api"] == true) ? "true" : "false"
			Settings["Fingerprints.HasBatteryDevice"] = (FINGERPRINT_JSON["has_battery_device"] == true) ? "true" : "false"
			Settings["Fingerprints.BatteryFingerprint"] = FINGERPRINT_JSON["battery"]
		}else
		{
			Settings["Fingerprints.BatteryEnabled"] = "false"
		}

		if(FINGERPRINT_AUDIO)
		{
			Settings["Audio"] = "noise"
			Settings["AudioNoise"] = FINGERPRINT_JSON["audio"]
			if(FINGERPRINT_JSON["audio_properties"])
			{
				var Keys = Object.keys(FINGERPRINT_JSON["audio_properties"])
				for(var i = 0;i<Keys.length;i++)
				{
					var Key = Keys[i]
					var Value = FINGERPRINT_JSON["audio_properties"][Key]
					if(Value)
					{
						if(Key == "BaseAudioContextSampleRate")
							Key = "sampleRate"
						else if(Key == "AudioDestinationNodeMaxChannelCount")
							Key = "maxChannelCount"
						else if(Key == "AudioContextBaseLatency")
							Key = "baseLatency"
						else
							Key = ""
						if(Key.length > 0)
							Settings["Attribute." + Key] = Value.toString()
					}
				}
			}
		}
		_settings(Settings)!
	})!

	//Accept language pattern
	_if(FINGERPRINT_JSON["lang"], function(){
		_set_accept_language_pattern(FINGERPRINT_JSON["lang"])!
	})!
	
	//User agent
	try
	{
		FINGERPRINT_USERAGENT = FINGERPRINT_JSON["ua"] || ""
	}catch(e){FINGERPRINT_USERAGENT = ""}

	_if(FINGERPRINT_USERAGENT.length > 0, function(){
		header("User-Agent", FINGERPRINT_JSON["ua"])!
	})!
	

	// Screen size
	try
	{
		FINGERPRINT_WIDTH = parseInt(FINGERPRINT_JSON["width"])
		FINGERPRINT_HEIGHT = parseInt(FINGERPRINT_JSON["height"])
	}catch(e){FINGERPRINT_HEIGHT = -1;FINGERPRINT_WIDTH = -1}

	
	_if(FINGERPRINT_WIDTH > 0, function(){
		resize(FINGERPRINT_WIDTH, FINGERPRINT_HEIGHT - 32)!
	})!

	
	_if(FINGERPRINT_JSON["dnt"], function(){
		header("DNT","1")!
	})!

	//Headers 
	header_order(FINGERPRINT_JSON["headers"])!
	
	//Headers order and native code
	
	FINGEPRINT_SETTINGS = {"Fingerprints.HeadersOrder": FINGERPRINT_JSON["headers"].join(",")}
	if(FINGERPRINT_JSON["native_code"])
	{
		var split = FINGERPRINT_JSON["native_code"].split("Object")
		FINGEPRINT_SETTINGS["Fingerprints.NativeCodeAfter"] = base64_encode(split[split.length - 1])
		FINGEPRINT_SETTINGS["Fingerprints.NativeCodeBefore"] = base64_encode(split[0])
	}

	if(FINGERPRINT_JSON["plugins"] && FINGERPRINT_JSON["mimes"])
	{
		FINGEPRINT_SETTINGS["Fingerprints.Plugins"] = base64_encode(JSON.stringify(FINGERPRINT_JSON["plugins"]))
		FINGEPRINT_SETTINGS["Fingerprints.Mimes"] = base64_encode(JSON.stringify(FINGERPRINT_JSON["mimes"]))
	}

	_if(FINGERPRINT_JSON["attr"], function(){
		var Keys = Object.keys(FINGERPRINT_JSON["attr"])
		for(var i = 0;i<Keys.length;i++)
		{
			var Key = Keys[i]
			var Split = Key.split(".")
			var KeySettings = "Attribute." + Split[Split.length - 1]
			try
			{
				FINGEPRINT_SETTINGS[KeySettings] = FINGERPRINT_JSON["attr"][Key].toString()
			}catch(e)
			{
				FINGEPRINT_SETTINGS[KeySettings] = ""
			}
		}
	})!

	
	var BrowserMode = "desktop"
	try
	{
		if(parseInt(FINGERPRINT_JSON["attr"]["maxTouchPoints"]) > 0)
		{
			BrowserMode = "mobile"
		}
	}catch(e)
	{

	}

	_browser_mode(BrowserMode)!
	

	if(FINGERPRINT_JSON["connection"])
	{
		var NetInfoDownlinkMax = false
		var Keys = Object.keys(FINGERPRINT_JSON["connection"])
		var HasConnection = Keys.length > 0

		for(var i = 0;i<Keys.length;i++)
		{
			var Key = Keys[i]

			if(Key == "downlinkMax")
			{
				NetInfoDownlinkMax = true;
			}

			var KeySettings = "Attribute.Connection." + Key
			try
			{
				if(typeof(FINGERPRINT_JSON["connection"][Key]) == "boolean")
				{
					FINGEPRINT_SETTINGS[KeySettings] = (FINGERPRINT_JSON["connection"][Key]) ? "1" : "0";
				}else if(typeof(FINGERPRINT_JSON["connection"][Key]) == "object" && FINGERPRINT_JSON["connection"][Key] == null)
				{
					FINGEPRINT_SETTINGS[KeySettings] = "0";
				}else
				{
					FINGEPRINT_SETTINGS[KeySettings] = FINGERPRINT_JSON["connection"][Key].toString()
				}
			}catch(e)
			{
				FINGEPRINT_SETTINGS[KeySettings] = ""
			}
		}
		if(!HasConnection)
		{
			FINGEPRINT_SETTINGS["Fingerprints.Feature.FingerprintsConnection"] = "Disable"
		}

		if(NetInfoDownlinkMax)
		{
			FINGEPRINT_SETTINGS["Fingerprints.Feature.NetInfoDownlinkMax"] = "Enable"
		}
	}

	if(FINGERPRINT_JSON["orientation"])
	{
		var Keys = Object.keys(FINGERPRINT_JSON["orientation"])

		for(var i = 0;i<Keys.length;i++)
		{
			var Key = Keys[i]

			var KeySettings = "Attribute.Orientation." + Key
			try
			{
				FINGEPRINT_SETTINGS[KeySettings] = FINGERPRINT_JSON["orientation"][Key].toString()
			}catch(e)
			{
				FINGEPRINT_SETTINGS[KeySettings] = ""
			}
		}
	}

	if(typeof(FINGERPRINT_JSON["doNotTrack"]) == "string")
	{
		try
		{
			FINGEPRINT_SETTINGS["Attribute.doNotTrack"] = FINGERPRINT_JSON["doNotTrack"]
		}catch(e)
		{
			
		}
	}

	if(FINGERPRINT_JSON["css"])
	{
		var Keys = Object.keys(FINGERPRINT_JSON["css"])
		for(var i = 0;i<Keys.length;i++)
		{
			var Key = "css-" + Keys[i]
			Key = Key.split("-").map(function(word){
				if(!word)
					return word;
				return word.charAt(0).toUpperCase() + word.slice(1)
			}).join("")
			FINGEPRINT_SETTINGS["Fingerprints." + Key] = FINGERPRINT_JSON["css"][Keys[i]].toString()
		}
	}

	if(typeof(FINGERPRINT_JSON["keyboard"]) == "object" && typeof(FINGERPRINT_JSON["keyboard"].length) == "number")
	{
		FINGEPRINT_SETTINGS["Fingerprints.KeyboardLayout"] = base64_encode(JSON.stringify(FINGERPRINT_JSON["keyboard"]))
	}

	if(typeof(FINGERPRINT_JSON["media"]) == "object" && typeof(FINGERPRINT_JSON["media"]["devices"]) == "object" && typeof(FINGERPRINT_JSON["media"]["constraints"]) == "object")
	{
		try
		{
			var AllDevices = []
			for(var i = 0;i<FINGERPRINT_JSON["media"]["devices"].length;i++)
			{
				var Device = FINGERPRINT_JSON["media"]["devices"][i]
				if(typeof(Device) == "object" && typeof(Device.deviceId) == "string" && typeof(Device.kind) == "string" && typeof(Device.label) == "string" && typeof(Device.groupId) == "string")
				{
					AllDevices.push(Device.deviceId)
					AllDevices.push(Device.kind)
					AllDevices.push(Device.label)
					AllDevices.push(Device.groupId)
				}
			}
			FINGEPRINT_SETTINGS["Fingerprints.MediaDevices"] = base64_encode(JSON.stringify(AllDevices))

		}catch(e)
		{
		}

		try
		{
			var AllConstrains = Object.keys(FINGERPRINT_JSON["media"]["constraints"])
			var ActualConstrains = []
			for(var i = 0;i<AllConstrains.length;i++)
			{
				var Constrain = AllConstrains[i]
				if(typeof(FINGERPRINT_JSON["media"]["constraints"][Constrain]) == "boolean" && FINGERPRINT_JSON["media"]["constraints"][Constrain] === true)
				{
					ActualConstrains.push(Constrain)
				}
			}
			FINGEPRINT_SETTINGS["Fingerprints.MediaConstrains"] = base64_encode(JSON.stringify(ActualConstrains))
		}catch(e)
		{
		}
	}

	{
		var PerfectCanvasReplaceType = "Disable"
		if(FINGERPRINT_JSON["perfectcanvas"] && FINGERPRINT_PERFECTCANVAS)
		{
			
			var Keys = Object.keys(FINGERPRINT_JSON["perfectcanvas"])
			for(var i = 0;i<Keys.length;i++)
			{
				var Key = Keys[i]
				
				var Value = FINGERPRINT_JSON["perfectcanvas"][Key]
				FINGEPRINT_SETTINGS["Fingerprints.PerfectCanvasReplace." + Key] = Value
			}
			if(Keys.length > 0)
			{
				PerfectCanvasReplaceType = "Enable"
			}
		}

		FINGEPRINT_SETTINGS["Fingerprints.PerfectCanvasCapture"] = PerfectCanvasReplaceType
		FINGEPRINT_SETTINGS["Fingerprints.PerfectCanvasDoReplace"] = PerfectCanvasReplaceType
	}

	FINGEPRINT_SETTINGS["Fingerprints.FontList"] = FINGERPRINT_JSON["fonts"].join(";")
	
	try
	{
		FINGEPRINT_SETTINGS["Fingerprints.Tags"] = FINGERPRINT_JSON["tags"].join(",")
	}catch(e)
	{

	}

	try
	{
		if(FINGERPRINT_JSON["speech"])
			FINGEPRINT_SETTINGS["Fingerprints.Speech"] = base64_encode(JSON.stringify(FINGERPRINT_JSON["speech"]))
		else
			FINGEPRINT_SETTINGS["Fingerprints.Speech"] = base64_encode("[]")
	}catch(e)
	{
		FINGEPRINT_SETTINGS["Fingerprints.Speech"] = base64_encode("[]")
	}

	try
	{
		if(FINGERPRINT_JSON["heap"])
		{
			FINGEPRINT_SETTINGS["Fingerprints.Feature.FingerprintsMemory"] = "Enable"
			FINGEPRINT_SETTINGS["Fingerprints.Heap"] = FINGERPRINT_JSON["heap"]
		}
		else
		{
			FINGEPRINT_SETTINGS["Fingerprints.Feature.FingerprintsMemory"] = "Disable"
		}

	}catch(e)
	{
		FINGEPRINT_SETTINGS["Fingerprints.Feature.FingerprintsMemory"] = "Disable"
	}

	_settings(FINGEPRINT_SETTINGS)!

	PAYLOAD = ""

	if(typeof(FINGERPRINT_JSON["payload2"]) == "string")
	{
		PAYLOAD = FINGERPRINT_JSON["payload2"];
	}else if(typeof(FINGERPRINT_JSON["payload"]) == "string")
	{
		PAYLOAD = FINGERPRINT_JSON["payload"];
	}

	_if(PAYLOAD.length > 0, function(){
		onloadjavascriptinternal(PAYLOAD, "_fingerprint")!
	})!

	delete PAYLOAD

}


