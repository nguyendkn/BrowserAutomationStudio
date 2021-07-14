_SMS.SmsAcktiwatorApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "",
		"RU": "RU",
        "UA": "UA",
        "KZ": "KZ",
        "GB": "GB",
        "DE": "DE",
        "EE": "EE",
        "SE": "SE",
        "ID": "ID",
        "RO": "RO",
        "MD": "MD",
        "BY": "BL",
        "UZ": "UZ"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};