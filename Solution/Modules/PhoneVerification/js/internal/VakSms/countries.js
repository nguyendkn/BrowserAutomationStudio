_SMS.VakSmsApi.prototype.getRawCountry = function(country){
	var countries = {
		"Any": "",
		"RU": "ru",
        "KZ": "kz",
        "UA": "ua",
        "ID": "id",
        "PL": "pl",
        "GB": "gb",
        "EE": "ee",
        "DE": "de",
        "SE": "se",
        "NL": "nl",
        "LV": "lv",
        "ES": "es",
        "VN": "vn",
        "LT": "lt",
        "MX": "mx",
        "FR": "fr",
        "PT": "pt",
        "HK": "hk",
        "FI": "fi"
	};
	return countries.hasOwnProperty(country) ? countries[country] : countries["Any"];
};