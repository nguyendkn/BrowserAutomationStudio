IP_INFO = JSON.parse(native("timezones", "ipinfo", <%= value %>));
if(!IP_INFO["valid"])
	fail("Failed to get ip info for " + <%= value %>);

_settings({"Timezone": (-parseInt(IP_INFO["offset"])).toString(),"TimezoneName":IP_INFO["timezone"]})!
geolocation(IP_INFO["latitude"],IP_INFO["longitude"])!