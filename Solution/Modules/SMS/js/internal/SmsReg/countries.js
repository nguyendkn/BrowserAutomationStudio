_SMS.SmsRegApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "all",
		"RU": "ru",
		"UA": "ua",
		"KZ": "kz",
		"CN": "cn"
	};
	return _is_nilb(countries[country]) ? countries["Any"] : countries[country];
};