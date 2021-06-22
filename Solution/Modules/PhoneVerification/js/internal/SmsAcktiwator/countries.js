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
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};