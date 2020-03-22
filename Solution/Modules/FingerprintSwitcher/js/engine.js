_L["Fingerprint switcher is not integrated with Multilogin yet."] = {"ru": "Сервис Fingerprint switcher пока не работает вместе с Multilogin"}
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
	}else
	{
		try{
			FINGERPRINT_JSON = JSON.parse(_arguments())
		}catch(e)
		{
			fail(e.message)
		}
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
				if(!Value)
					Value = ""
				Settings["Webgl." + Key] = Value
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

	if(FINGERPRINT_JSON["valid"] == false)
	{
		var error = "Unknown error"
		if(FINGERPRINT_JSON["message"])
			error = FINGERPRINT_JSON["message"]
		fail("Fingerprint error: \""+ error + "\"") 
	}

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
		resize(FINGERPRINT_WIDTH, FINGERPRINT_HEIGHT)!
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

	FINGEPRINT_SETTINGS["Fingerprints.FontList"] = FINGERPRINT_JSON["fonts"].join(";")

	_settings(FINGEPRINT_SETTINGS)!

	_if(FINGERPRINT_JSON["payload"].length > 0, function(){
		onloadjavascriptinternal(FINGERPRINT_JSON["payload"], "_fingerprint")!
	})!



}


