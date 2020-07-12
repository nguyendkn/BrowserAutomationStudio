
;_BAS_HIDE(BrowserAutomationStudio_GeolocationRestore) = function()
{
	delete window.navigator.geolocation.getCurrentPosition
	delete window.navigator.geolocation.watchPosition
	delete window.navigator.permissions.query
}

;_BAS_HIDE(BrowserAutomationStudio_SetGeolocationObject) = function(ObjectString)
{
	try
	{
		var NewObject = JSON.parse(ObjectString);
		delete NewObject["latitude"]
		delete NewObject["longitude"]
		Object.assign(_BAS_HIDE(BrowserAutomationStudio_Location), NewObject);
	}catch(e)
	{
		
	}
}


;_BAS_HIDE(BrowserAutomationStudio_SetGeolocation) = function(Latitude,Longitude)
{

	if(typeof(_BAS_HIDE(BrowserAutomationStudio_Location)) != "object")
	{
		;_BAS_HIDE(BrowserAutomationStudio_Location) = 
		{
			accuracy: 4413,
			altitude: null,
			altitudeAccuracy: null,
			heading: null,
			speed: null
		};
	}

	_BAS_HIDE(BrowserAutomationStudio_Location)["latitude"] = parseFloat(Latitude);
	_BAS_HIDE(BrowserAutomationStudio_Location)["longitude"] = parseFloat(Longitude);


	(function(query_original){

		delete window.navigator.permissions.query;

		Object.defineProperty(navigator.permissions, 'query', {
	        configurable: true, get: function() {
	             return function(descriptor){
	             	try
	             	{
	             		if(descriptor["name"] == "geolocation")
	             		{
							return new Promise(function(resolve, reject) {
								resolve({
									state: "granted",
									status: "granted",
									onchange: null
								});
							});

	             		}
	             	}catch(e)
	             	{
	             		
	             	}
	             	return query_original.call(navigator.permissions,descriptor)
	             };
	         }
	     });

	})(navigator.permissions.query);




	Object.defineProperty(window.navigator.geolocation, 'getCurrentPosition', {
	        configurable: true, get: function() {
	             return function(callback){
	             	callback({coords: _BAS_HIDE(BrowserAutomationStudio_Location), timestamp: Date.now()});
	             };
	         }
	     });

	Object.defineProperty(window.navigator.geolocation, 'watchPosition', {
	        configurable: true, get: function() {
	             return function(callback){
	             	callback({coords: _BAS_HIDE(BrowserAutomationStudio_Location), timestamp: Date.now()});
	             };
	         }
	     });
}