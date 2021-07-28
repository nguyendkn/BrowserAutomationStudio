_SMS.VakSmsApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "",
		"RU": "ru",
        "UA": "ua",
        "KZ": "kz",
        "GB": "gb",
        "DE": "de",
        "PL": "pl",
        "EE": "ee",
        "SE": "se",
        "LT": "lt",
        "NL": "nl",
        "LV": "lv",
        "ES": "es",
        "FR": "fr",
        "PT": "pt",
        "FI": "fi"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};