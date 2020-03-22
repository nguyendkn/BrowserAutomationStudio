
;_BAS_HIDE(BrowserAutomationStudio_GeolocationRestore) = function()
{
	delete window.navigator.geolocation.getCurrentPosition
	delete window.navigator.geolocation.watchPosition
	delete window.navigator.permissions.query
}



;_BAS_HIDE(BrowserAutomationStudio_SetGeolocation) = function(Latitude,Longitude)
{

	;_BAS_HIDE(BrowserAutomationStudio_Location) = 
	{
		accuracy: 10000,
		altitude: 0,
		altitudeAccuracy: 0,
		latitude: parseFloat(Latitude),
		longitude: parseFloat(Longitude)
	};


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