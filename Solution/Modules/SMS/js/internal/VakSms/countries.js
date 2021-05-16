_SMS.VakSmsApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "",
		"EE": "ee",
		"FI": "fi",
		"FR": "fr",
		"DE": "de",
		"KZ": "kz",
		"LV": "lv",
		"LT": "lt",
		"NL": "nl",
		"PL": "pl",
		"PT": "pt",
		"RU": "ru",
		"ES": "es",
		"SE": "se",
		"GB": "gb"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};