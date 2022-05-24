_SMS.SmsAcktiwatorApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "",
		"RU": "RU",
		"KZ": "KZ",
		"UA": "UA",
		"ID": "ID",
		"PL": "PL",
		"GB": "GB",
		"EE": "EE",
		"DE": "DE",
		"SE": "SE",
		"NL": "NL",
		"LV": "LV",
		"ES": "ES",
		"RO": "RO",
		"CZ": "CZ",
		"MD": "MD",
		"US": "US",
		"UZ": "UZ",
		"BY": "BL"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};