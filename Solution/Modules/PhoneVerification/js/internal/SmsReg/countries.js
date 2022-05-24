_SMS.SmsRegApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "all",
		"RU": "ru",
		"KZ": "kz",
		"UA": "ua",
		"CN": "cn"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};