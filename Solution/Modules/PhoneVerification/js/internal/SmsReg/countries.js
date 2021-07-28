_SMS.SmsRegApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "all",
		"RU": "ru",
        "UA": "ua",
        "KZ": "kz",
        "CN": "cn"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};