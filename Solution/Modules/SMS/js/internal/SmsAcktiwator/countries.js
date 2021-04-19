_SMS.SmsAcktiwatorApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "",
		"RU": "RU",
		"UA": "UA",
		"KZ": "KZ",
		"UZ": "UZ",
		"SE": "SE",
		"BY": "BL",
		"GB": "GB",
		"MD": "MD",
		"ID": "ID",
		"EE": "EE"
	};
	return _is_nilb(countries[country]) ? countries["Any"] : countries[country];
};