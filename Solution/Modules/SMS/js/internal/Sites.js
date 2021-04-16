_SMS.base.prototype.getRawSite = function(site){
	var sites = {
		"Other": {
			"sms-activate.ru": "ot",
			"smshub.org": "ot",
			"5sim.net": "other",
			"getsms.online": "ot",
			"smsvk.net": "ot",
			"cheapsms.ru": "ot",
			"sms.kopeechka.store": "ot",
			"sms-reg.com": "other",
			"smspva.com": "opt19",
			"onlinesim.ru": "7",
			"sms-acktiwator.ru": "0",
			"vak-sms.com": "ot",
			"give-sms.com": "ot"
		},
		"VK": {
			"sms-activate.ru": "vk",
			"smshub.org": "vk",
			"5sim.net": "vkontakte",
			"getsms.online": "vk",
			"smsvk.net": "vk",
			"cheapsms.ru": "vk",
			"sms.kopeechka.store": "vk",
			"sms-reg.com": "vk",
			"smspva.com": "opt69",
			"onlinesim.ru": "vkcom",
			"sms-acktiwator.ru": "2",
			"vak-sms.com": "mr",
			"give-sms.com": "vk"
		},
		"Ok.ru": {
			"sms-activate.ru": "ok",
			"smshub.org": "ok",
			"5sim.net": "odnoklassniki",
			"getsms.online": "ok",
			"smsvk.net": "ok",
			"cheapsms.ru": "ok",
			"sms-reg.com": "classmates",
			"smspva.com": "opt5",
			"onlinesim.ru": "odklru",
			"sms-acktiwator.ru": "3",
			"give-sms.com": "ok"
		},
		"WhatsApp": {
			"sms-activate.ru": "wa",
			"smshub.org": "wa",
			"5sim.net": "whatsapp",
			"getsms.online": "wa",
			"smsvk.net": "wa",
			"cheapsms.ru": "wp",
			"sms.kopeechka.store": "wa",
			"sms-reg.com": "whatsapp",
			"smspva.com": "opt20",
			"onlinesim.ru": "whatsapp",
			"sms-acktiwator.ru": "7",
			"vak-sms.com": "wa",
			"give-sms.com": "wa"
		},
		"Viber": {
			"sms-activate.ru": "vi",
			"smshub.org": "vi",
			"5sim.net": "viber",
			"getsms.online": "vi",
			"smsvk.net": "vi",
			"cheapsms.ru": "vi",
			"sms.kopeechka.store": "vi",
			"sms-reg.com": "viber",
			"smspva.com": "opt11",
			"onlinesim.ru": "viber",
			"sms-acktiwator.ru": "5",
			"vak-sms.com": "vi",
			"give-sms.com": "vi"
		},
		"Telegram": {
			"sms-activate.ru": "tg",
			"smshub.org": "tg",
			"5sim.net": "telegram",
			"getsms.online": "tg",
			"smsvk.net": "tg",
			"cheapsms.ru": "tg",
			"sms.kopeechka.store": "tg",
			"sms-reg.com": "telegram",
			"smspva.com": "opt29",
			"onlinesim.ru": "telegram",
			"sms-acktiwator.ru": "6",
			"vak-sms.com": "tg",
			"give-sms.com": "tg"
		},
		"WeChat": {
			"sms-activate.ru": "wb",
			"smshub.org": "wb",
			"5sim.net": "wechat",
			"getsms.online": "wb",
			"smsvk.net": "wc",
			"cheapsms.ru": "wb",
			"sms.kopeechka.store": "wb",
			"sms-reg.com": "wechat",
			"smspva.com": "opt67",
			"onlinesim.ru": "wechat",
			"sms-acktiwator.ru": "8",
			"vak-sms.com": "wc",
			"give-sms.com": "wb"
		},
		"Google": {
			"sms-activate.ru": "go",
			"smshub.org": "go",
			"5sim.net": "google",
			"getsms.online": "go",
			"smsvk.net": "go",
			"cheapsms.ru": "go",
			"sms.kopeechka.store": "go",
			"sms-reg.com": "gmail",
			"smspva.com": "opt1",
			"onlinesim.ru": "google",
			"sms-acktiwator.ru": "9",
			"vak-sms.com": "gl",
			"give-sms.com": "go"
		},
		"Avito": {
			"sms-activate.ru": "av",
			"smshub.org": "av",
			"5sim.net": "avito",
			"getsms.online": "av",
			"smsvk.net": "av",
			"sms-reg.com": "avito",
			"smspva.com": "opt59",
			"onlinesim.ru": "avito",
			"sms-acktiwator.ru": "4",
			"vak-sms.com": "av",
			"give-sms.com": "av"
		},
		"Facebook": {
			"sms-activate.ru": "fb",
			"smshub.org": "fb",
			"5sim.net": "facebook",
			"getsms.online": "fb",
			"smsvk.net": "fb",
			"cheapsms.ru": "fb",
			"sms.kopeechka.store": "fb",
			"sms-reg.com": "facebook",
			"smspva.com": "opt2",
			"onlinesim.ru": "3223",
			"sms-acktiwator.ru": "13",
			"vak-sms.com": "fb",
			"give-sms.com": "fb"
		},
		"Twitter": {
			"sms-activate.ru": "tw",
			"smshub.org": "tw",
			"5sim.net": "twitter",
			"getsms.online": "tw",
			"smsvk.net": "tw",
			"cheapsms.ru": "tw",
			"sms-reg.com": "twitter",
			"smspva.com": "opt41",
			"onlinesim.ru": "twitter",
			"sms-acktiwator.ru": "23",
			"vak-sms.com": "tw",
			"give-sms.com": "tw"
		},
		"Uber": {
			"sms-activate.ru": "ub",
			"smshub.org": "ub",
			"5sim.net": "uber",
			"getsms.online": "ub",
			"smsvk.net": "ub",
			"cheapsms.ru": "ub",
			"sms-reg.com": "uber",
			"smspva.com": "opt72",
			"onlinesim.ru": "uber",
			"sms-acktiwator.ru": "25",
			"vak-sms.com": "ub",
			"give-sms.com": "ub"
		},
		"Qiwi": {
			"sms-activate.ru": "qw",
			"smshub.org": "qw",
			"5sim.net": "qiwiwallet",
			"smsvk.net": "qw",
			"cheapsms.ru": "qw",
			"smspva.com": "opt18",
			"sms-acktiwator.ru": "19",
			"vak-sms.com": "qw",
			"give-sms.com": "qw"
		},
		"Gett": {
			"sms-activate.ru": "gt",
			"smshub.org": "gt",
			"5sim.net": "gett",
			"smsvk.net": "gett",
			"cheapsms.ru": "gt",
			"smspva.com": "opt35",
			"onlinesim.ru": "gett",
			"sms-acktiwator.ru": "28",
			"give-sms.com": "gt"
		},
		"OLX": {
			"sms-activate.ru": "sn",
			"smshub.org": "sn",
			"5sim.net": "olx",
			"sms-reg.com": "olx",
			"smspva.com": "opt70",
			"onlinesim.ru": "olx",
			"sms-acktiwator.ru": "66"
		},
		"Instagram": {
			"sms-activate.ru": "ig",
			"smshub.org": "ig",
			"5sim.net": "instagram",
			"getsms.online": "ig",
			"smsvk.net": "ig",
			"cheapsms.ru": "ig",
			"sms.kopeechka.store": "ig",
			"sms-reg.com": "instagram",
			"smspva.com": "opt16",
			"onlinesim.ru": "instagram",
			"sms-acktiwator.ru": "16",
			"vak-sms.com": "ig",
			"give-sms.com": "ig"
		},
		"Hezzl": {
			"sms-activate.ru": "ss",
			"smshub.org": "ss",
			"5sim.net": "hezzl",
			"onlinesim.ru": "hezzl",
			"sms-acktiwator.ru": "223"
		},
		"Youla": {
			"sms-activate.ru": "ym",
			"smshub.org": "ym",
			"5sim.net": "youla",
			"getsms.online": "yl",
			"sms-reg.com": "youla",
			"onlinesim.ru": "youla",
			"sms-acktiwator.ru": "10",
			"give-sms.com": "ym"
		},
		"Mail.ru": {
			"sms-activate.ru": "ma",
			"smshub.org": "ma",
			"5sim.net": "mailru",
			"getsms.online": "ma",
			"smsvk.net": "ma",
			"cheapsms.ru": "ma",
			"sms.kopeechka.store": "ma",
			"sms-reg.com": "mailru",
			"smspva.com": "opt33",
			"onlinesim.ru": "mailru",
			"sms-acktiwator.ru": "24",
			"give-sms.com": "ma"
		},
		"Microsoft": {
			"sms-activate.ru": "mm",
			"smshub.org": "mm",
			"5sim.net": "microsoft",
			"getsms.online": "mm",
			"smsvk.net": "mm",
			"cheapsms.ru": "mm",
			"sms.kopeechka.store": "mm",
			"sms-reg.com": "microsoft",
			"smspva.com": "opt15",
			"onlinesim.ru": "microsoft",
			"sms-acktiwator.ru": "12",
			"vak-sms.com": "ms",
			"give-sms.com": "mm"
		},
		"Airbnb": {
			"sms-activate.ru": "uk",
			"smshub.org": "uk",
			"5sim.net": "airbnb",
			"smspva.com": "opt46",
			"onlinesim.ru": "airbnb",
			"sms-acktiwator.ru": "74",
			"vak-sms.com": "ab",
			"give-sms.com": "uk"
		},
		"LINE Messenger": {
			"sms-activate.ru": "me",
			"smshub.org": "me",
			"5sim.net": "line",
			"getsms.online": "me",
			"sms-reg.com": "lineme",
			"smspva.com": "opt37",
			"onlinesim.ru": "linemessenger",
			"sms-acktiwator.ru": "31",
			"vak-sms.com": "lm"
		},
		"Yahoo": {
			"sms-activate.ru": "mb",
			"smshub.org": "mb",
			"5sim.net": "yahoo",
			"getsms.online": "mb",
			"smsvk.net": "yh",
			"cheapsms.ru": "mb",
			"sms-reg.com": "yahoo",
			"smspva.com": "opt65",
			"onlinesim.ru": "yahoo",
			"sms-acktiwator.ru": "11",
			"vak-sms.com": "yh",
			"give-sms.com": "mb"
		},
		"DrugVokrug": {
			"sms-activate.ru": "we",
			"smshub.org": "we",
			"5sim.net": "drugvokrug",
			"cheapsms.ru": "we",
			"sms.kopeechka.store": "we",
			"sms-reg.com": "drugvokrug",
			"smspva.com": "opt31",
			"onlinesim.ru": "fastfriend",
			"sms-acktiwator.ru": "17",
			"vak-sms.com": "dv"
		},
		"5ka": {
			"sms-activate.ru": "bd",
			"smshub.org": "bd",
			"5sim.net": "pyaterochka",
			"getsms.online": "bd",
			"smsvk.net": "pt",
			"cheapsms.ru": "py",
			"onlinesim.ru": "pyaterochka",
			"sms-acktiwator.ru": "130",
			"vak-sms.com": "pt",
			"give-sms.com": "bd"
		},
		"HQ Trivia": {
			"sms-activate.ru": "kp",
			"smshub.org": "kp",
			"5sim.net": "hqtrivia",
			"getsms.online": "pm",
			"onlinesim.ru": "hqtrivia",
			"sms-acktiwator.ru": "225"
		},
		"Delivery Club": {
			"sms-activate.ru": "dt",
			"smshub.org": "dt",
			"5sim.net": "delivery",
			"cheapsms.ru": "dt",
			"onlinesim.ru": "deliveryclub",
			"sms-acktiwator.ru": "161",
			"give-sms.com": "dt"
		},
		"Yandex": {
			"sms-activate.ru": "ya",
			"smshub.org": "ya",
			"5sim.net": "yandex",
			"getsms.online": "ya",
			"cheapsms.ru": "ya",
			"sms.kopeechka.store": "ya",
			"smspva.com": "opt23",
			"onlinesim.ru": "yandex",
			"sms-acktiwator.ru": "15",
			"vak-sms.com": "ya",
			"give-sms.com": "ya"
		},
		"Steam": {
			"sms-activate.ru": "mt",
			"smshub.org": "mt",
			"5sim.net": "steam",
			"getsms.online": "sm",
			"cheapsms.ru": "mt",
			"sms-reg.com": "steam",
			"smspva.com": "opt58",
			"onlinesim.ru": "steam",
			"sms-acktiwator.ru": "46",
			"vak-sms.com": "st",
			"give-sms.com": "mt"
		},
		"Tinder": {
			"sms-activate.ru": "oi",
			"smshub.org": "oi",
			"5sim.net": "tinder",
			"cheapsms.ru": "oi",
			"sms.kopeechka.store": "oi",
			"sms-reg.com": "tinder",
			"smspva.com": "opt9",
			"onlinesim.ru": "tinder",
			"sms-acktiwator.ru": "146",
			"vak-sms.com": "td",
			"give-sms.com": "oi"
		},
		"Mamba": {
			"sms-activate.ru": "fd",
			"smshub.org": "fd",
			"5sim.net": "mamba",
			"smsvk.net": "mb",
			"cheapsms.ru": "fd",
			"sms.kopeechka.store": "fd",
			"sms-reg.com": "mamba",
			"smspva.com": "opt100",
			"onlinesim.ru": "mamba",
			"sms-acktiwator.ru": "18",
			"vak-sms.com": "mb",
			"give-sms.com": "fd"
		},
		"MeetMe": {
			"sms-activate.ru": "fd",
			"5sim.net": "meetme",
			"getsms.online": "uk",
			"sms.kopeechka.store": "fd",
			"sms-reg.com": "meetme",
			"smspva.com": "opt17",
			"onlinesim.ru": "meetme",
			"sms-acktiwator.ru": "30",
			"vak-sms.com": "mm"
		},
		"Dent": {
			"sms-activate.ru": "zz",
			"smshub.org": "zz",
			"5sim.net": "dent",
			"onlinesim.ru": "dent",
			"sms-acktiwator.ru": "170"
		},
		"KakaoTalk": {
			"sms-activate.ru": "kt",
			"smshub.org": "kt",
			"5sim.net": "kakaotalk",
			"getsms.online": "kt",
			"smsvk.net": "kt",
			"sms.kopeechka.store": "kt",
			"sms-reg.com": "kakaotalk",
			"smspva.com": "opt71",
			"onlinesim.ru": "kakaotalk",
			"sms-acktiwator.ru": "43",
			"vak-sms.com": "kt",
			"give-sms.com": "kt"
		},
		"Aol": {
			"sms-activate.ru": "pm",
			"smshub.org": "pm",
			"5sim.net": "aol",
			"getsms.online": "we",
			"smsvk.net": "al",
			"cheapsms.ru": "pm",
			"sms-reg.com": "aol",
			"smspva.com": "opt10",
			"onlinesim.ru": "aol",
			"sms-acktiwator.ru": "27",
			"vak-sms.com": "ao",
			"give-sms.com": "pm"
		},
		"LinkedIN": {
			"sms-activate.ru": "tn",
			"smshub.org": "tn",
			"5sim.net": "linkedin",
			"cheapsms.ru": "in",
			"smspva.com": "opt8",
			"onlinesim.ru": "linkedin",
			"sms-acktiwator.ru": "49",
			"vak-sms.com": "ln"
		},
		"Tencent QQ": {
			"sms-activate.ru": "qq",
			"smshub.org": "qq",
			"5sim.net": "tencentqq",
			"getsms.online": "qq",
			"smspva.com": "opt34",
			"onlinesim.ru": "tencentqq",
			"sms-acktiwator.ru": "32",
			"vak-sms.com": "qq",
			"give-sms.com": "qq"
		},
		"Magnit": {
			"sms-activate.ru": "mg",
			"smshub.org": "mg",
			"5sim.net": "magnit",
			"getsms.online": "mg",
			"cheapsms.ru": "mn",
			"smspva.com": "opt126",
			"onlinesim.ru": "magnit",
			"sms-acktiwator.ru": "212",
			"vak-sms.com": "mg"
		},
		"POF.com": {
			"sms-activate.ru": "pf",
			"smshub.org": "pf",
			"5sim.net": "pof",
			"smspva.com": "opt84",
			"onlinesim.ru": "pof_com",
			"sms-acktiwator.ru": "217"
		},
		"Yalla": {
			"sms-activate.ru": "yl",
			"smshub.org": "yl",
			"5sim.net": "yalla",
			"smspva.com": "opt88",
			"onlinesim.ru": "yalla",
			"sms-acktiwator.ru": "169",
			"vak-sms.com": "ll",
			"give-sms.com": "yl"
		},
		"Kolesa.kz": {
			"sms-activate.ru": "kl",
			"smshub.org": "kl",
			"onlinesim.ru": "kolesa_kz"
		},
		"Premium.one": {
			"sms-activate.ru": "po",
			"smshub.org": "po",
			"onlinesim.ru": "premium_one",
			"vak-sms.com": "ta",
			"give-sms.com": "po"
		},
		"Naver": {
			"sms-activate.ru": "nv",
			"smshub.org": "nv",
			"5sim.net": "naver",
			"getsms.online": "nv",
			"smsvk.net": "nv",
			"cheapsms.ru": "nv",
			"sms.kopeechka.store": "nv",
			"smspva.com": "opt73",
			"onlinesim.ru": "naver",
			"sms-acktiwator.ru": "215",
			"vak-sms.com": "nv",
			"give-sms.com": "nv"
		},
		"Netflix": {
			"sms-activate.ru": "nf",
			"smshub.org": "nf",
			"5sim.net": "netflix",
			"smsvk.net": "nf",
			"smspva.com": "opt101",
			"onlinesim.ru": "netflix",
			"sms-acktiwator.ru": "224",
			"vak-sms.com": "nf",
			"give-sms.com": "nf"
		},
		"ICQ": {
			"sms-activate.ru": "iq",
			"smshub.org": "iq",
			"5sim.net": "icq",
			"cheapsms.ru": "ic",
			"onlinesim.ru": "icq",
			"sms-acktiwator.ru": "151"
		},
		"Onliner.by": {
			"sms-activate.ru": "ob",
			"smshub.org": "ob",
			"onlinesim.ru": "onliner_by"
		},
		"Kufar.by": {
			"sms-activate.ru": "kb",
			"smshub.org": "kb",
			"5sim.net": "kufarby",
			"onlinesim.ru": "kufarby"
		},
		"Imo": {
			"sms-activate.ru": "im",
			"smshub.org": "im",
			"5sim.net": "imo",
			"smsvk.net": "im",
			"cheapsms.ru": "im",
			"sms.kopeechka.store": "im",
			"smspva.com": "opt111",
			"onlinesim.ru": "imo",
			"sms-acktiwator.ru": "115",
			"vak-sms.com": "im",
			"give-sms.com": "im"
		},
		"MiChat": {
			"sms-activate.ru": "mc",
			"smshub.org": "mc",
			"5sim.net": "michat",
			"smspva.com": "opt96",
			"onlinesim.ru": "michat",
			"sms-acktiwator.ru": "467"
		},
		"Discord": {
			"sms-activate.ru": "ds",
			"smshub.org": "ds",
			"5sim.net": "discord",
			"getsms.online": "ds",
			"cheapsms.ru": "dc",
			"smspva.com": "opt45",
			"onlinesim.ru": "discord",
			"sms-acktiwator.ru": "218",
			"vak-sms.com": "dc",
			"give-sms.com": "ds"
		},
		"SEOsprint": {
			"sms-activate.ru": "vv",
			"smshub.org": "vv",
			"5sim.net": "seosprint",
			"sms-reg.com": "seosprint",
			"onlinesim.ru": "seosprint",
			"sms-acktiwator.ru": "29"
		},
		"Monobank": {
			"sms-activate.ru": "ji",
			"smshub.org": "ji"
		},
		"TikTok": {
			"sms-activate.ru": "lf",
			"smshub.org": "lf",
			"5sim.net": "tiktok",
			"smsvk.net": "lf",
			"cheapsms.ru": "tt",
			"sms.kopeechka.store": "tt",
			"smspva.com": "opt104",
			"onlinesim.ru": "tiktok",
			"sms-acktiwator.ru": "209",
			"vak-sms.com": "tk",
			"give-sms.com": "lf"
		},
		"Douyin": {
			"sms-activate.ru": "lf",
			"smshub.org": "lf",
			"sms-acktiwator.ru": "209",
			"give-sms.com": "lf"
		},
		"Ukrnet": {
			"sms-activate.ru": "hu",
			"smshub.org": "hu",
			"onlinesim.ru": "ukrnet"
		},
		"Skout": {
			"sms-activate.ru": "wg",
			"smshub.org": "wg",
			"5sim.net": "skout",
			"getsms.online": "mt",
			"smsvk.net": "wg",
			"smspva.com": "opt49",
			"onlinesim.ru": "skout",
			"sms-acktiwator.ru": "39"
		},
		"EasyPay": {
			"sms-activate.ru": "rz",
			"smshub.org": "rz",
			"smspva.com": "opt21",
			"sms-acktiwator.ru": "67"
		},
		"Q12 Trivia": {
			"sms-activate.ru": "vf",
			"smshub.org": "vf",
			"onlinesim.ru": "q12_trivia"
		},
		"Pyro Music": {
			"sms-activate.ru": "ny",
			"smshub.org": "ny",
			"sms.kopeechka.store": "ny"
		},
		"Wolt": {
			"sms-activate.ru": "rr",
			"smshub.org": "rr",
			"sms.kopeechka.store": "rr",
			"onlinesim.ru": "wolt"
		},
		"CliQQ": {
			"sms-activate.ru": "fe",
			"smshub.org": "fe",
			"onlinesim.ru": "cliqq",
			"sms-acktiwator.ru": "468"
		},
		"SSOid.net": {
			"sms-activate.ru": "la",
			"smshub.org": "la",
			"onlinesim.ru": "ssoidnet"
		},
		"Zoho": {
			"sms-activate.ru": "zh",
			"smshub.org": "zh",
			"5sim.net": "zoho",
			"sms.kopeechka.store": "zh",
			"smspva.com": "opt93",
			"onlinesim.ru": "zoho"
		},
		"Ticketmaster": {
			"sms-activate.ru": "gp",
			"smshub.org": "gp",
			"smspva.com": "opt52",
			"onlinesim.ru": "ticketmaster"
		},
		"Amazon": {
			"sms-activate.ru": "am",
			"smshub.org": "am",
			"5sim.net": "amazon",
			"cheapsms.ru": "am",
			"smspva.com": "opt44",
			"onlinesim.ru": "amazon",
			"sms-acktiwator.ru": "45",
			"vak-sms.com": "am",
			"give-sms.com": "am"
		},
		"Olacabs": {
			"sms-activate.ru": "ly",
			"smshub.org": "ly",
			"onlinesim.ru": "olacabs"
		},
		"Rambler": {
			"sms-activate.ru": "tc",
			"smshub.org": "tc",
			"sms.kopeechka.store": "tc",
			"onlinesim.ru": "rambler_ru",
			"sms-acktiwator.ru": "14",
			"vak-sms.com": "rm"
		},
		"ProtonMail": {
			"sms-activate.ru": "dp",
			"smshub.org": "dp",
			"5sim.net": "proton",
			"smsvk.net": "dp",
			"sms.kopeechka.store": "dp",
			"smspva.com": "opt57",
			"onlinesim.ru": "proton",
			"sms-acktiwator.ru": "159",
			"vak-sms.com": "pm",
			"give-sms.com": "dp"
		},
		"NRJ Music Awards": {
			"sms-activate.ru": "pg",
			"smshub.org": "pg"
		},
		"CityMobil": {
			"sms-activate.ru": "yf",
			"smshub.org": "yf",
			"5sim.net": "citymobil",
			"smsvk.net": "ct",
			"cheapsms.ru": "cm",
			"smspva.com": "opt76",
			"onlinesim.ru": "citymobil",
			"sms-acktiwator.ru": "139",
			"give-sms.com": "yf"
		},
		"Miratorg": {
			"sms-activate.ru": "op",
			"smshub.org": "op",
			"5sim.net": "miratorg",
			"onlinesim.ru": "miratorg",
			"vak-sms.com": "mt"
		},
		"PGbonus": {
			"sms-activate.ru": "fx",
			"smshub.org": "fx",
			"cheapsms.ru": "pg",
			"onlinesim.ru": "pgbonus",
			"give-sms.com": "fx"
		},
		"MEGA": {
			"sms-activate.ru": "qr",
			"smshub.org": "qr",
			"5sim.net": "mega",
			"onlinesim.ru": "mega",
			"give-sms.com": "qr"
		},
		"SportMaster": {
			"sms-activate.ru": "yk",
			"smshub.org": "yk",
			"cheapsms.ru": "sp",
			"onlinesim.ru": "sportmaster",
			"sms-acktiwator.ru": "226",
			"vak-sms.com": "sa",
			"give-sms.com": "yk"
		},
		"Careem": {
			"sms-activate.ru": "ls",
			"smshub.org": "ls",
			"5sim.net": "careem",
			"smspva.com": "opt89",
			"onlinesim.ru": "careem",
			"sms-acktiwator.ru": "102",
			"give-sms.com": "ls"
		},
		"BIGO LIVE": {
			"sms-activate.ru": "bl",
			"smshub.org": "bl",
			"5sim.net": "bigolive",
			"sms.kopeechka.store": "bg",
			"onlinesim.ru": "bigo_live",
			"give-sms.com": "bl"
		},
		"MyMusicTaste": {
			"sms-activate.ru": "mu",
			"smshub.org": "mu",
			"onlinesim.ru": "mymusictaste"
		},
		"Snapchat": {
			"sms-activate.ru": "fu",
			"smshub.org": "fu",
			"5sim.net": "snapchat",
			"smspva.com": "opt90",
			"onlinesim.ru": "snapchat",
			"sms-acktiwator.ru": "42",
			"give-sms.com": "fu"
		},
		"Keybase": {
			"sms-activate.ru": "bf",
			"smshub.org": "bf",
			"5sim.net": "keybase",
			"onlinesim.ru": "keybase"
		},
		"OZON": {
			"sms-activate.ru": "sg",
			"smshub.org": "sg",
			"5sim.net": "ozon",
			"cheapsms.ru": "oz",
			"sms.kopeechka.store": "sg",
			"onlinesim.ru": "ozon",
			"sms-acktiwator.ru": "210",
			"vak-sms.com": "oz",
			"give-sms.com": "sg"
		},
		"Wildberries": {
			"sms-activate.ru": "uu",
			"smshub.org": "uu",
			"cheapsms.ru": "wl",
			"onlinesim.ru": "wildberries",
			"vak-sms.com": "wb",
			"give-sms.com": "uu"
		},
		"BlaBlaCar": {
			"sms-activate.ru": "ua",
			"smshub.org": "ua",
			"5sim.net": "blablacar",
			"getsms.online": "bc",
			"cheapsms.ru": "bb",
			"onlinesim.ru": "blablacar",
			"sms-acktiwator.ru": "54",
			"vak-sms.com": "bb",
			"give-sms.com": "ua"
		},
		"Alibaba": {
			"sms-activate.ru": "ab",
			"smshub.org": "ab",
			"5sim.net": "alibaba",
			"smsvk.net": "ab",
			"cheapsms.ru": "ab",
			"sms.kopeechka.store": "ab",
			"smspva.com": "opt61",
			"onlinesim.ru": "alibaba",
			"sms-acktiwator.ru": "78",
			"give-sms.com": "ab"
		},
		"InboxLv": {
			"sms-activate.ru": "iv",
			"smshub.org": "iv",
			"sms.kopeechka.store": "iv",
			"onlinesim.ru": "inboxlv"
		},
		"NTT Game": {
			"sms-activate.ru": "zy",
			"smshub.org": "zy",
			"5sim.net": "nttgame",
			"onlinesim.ru": "nttgame"
		},
		"Surveytime": {
			"sms-activate.ru": "gd",
			"smshub.org": "gd",
			"onlinesim.ru": "surveytime"
		},
		"MyLove": {
			"sms-activate.ru": "fy",
			"smshub.org": "fy",
			"sms.kopeechka.store": "fy",
			"onlinesim.ru": "mylove"
		},
		"Mos.ru": {
			"sms-activate.ru": "ce",
			"smshub.org": "ce"
		},
		"Truecaller": {
			"sms-activate.ru": "tl",
			"smshub.org": "tl",
			"5sim.net": "truecaller",
			"onlinesim.ru": "truecaller"
		},
		"Globus": {
			"sms-activate.ru": "hm",
			"smshub.org": "hm",
			"5sim.net": "globus",
			"cheapsms.ru": "gl",
			"onlinesim.ru": "globus"
		},
		"Bolt": {
			"sms-activate.ru": "tx",
			"smshub.org": "tx",
			"sms.kopeechka.store": "tx",
			"smspva.com": "opt81",
			"onlinesim.ru": "bolt",
			"sms-acktiwator.ru": "452",
			"give-sms.com": "tx"
		},
		"Shopee": {
			"sms-activate.ru": "ka",
			"smshub.org": "ka",
			"5sim.net": "shopee",
			"smspva.com": "opt48",
			"onlinesim.ru": "shopee",
			"sms-acktiwator.ru": "228"
		},
		"Perekrestok": {
			"sms-activate.ru": "pl",
			"smshub.org": "pl",
			"5sim.net": "perekrestok",
			"cheapsms.ru": "pk",
			"onlinesim.ru": "perekrestok",
			"sms-acktiwator.ru": "85",
			"vak-sms.com": "pk",
			"give-sms.com": "pl"
		},
		"Burger King": {
			"sms-activate.ru": "ip",
			"smshub.org": "ip",
			"5sim.net": "burgerking",
			"smspva.com": "opt3",
			"onlinesim.ru": "burgerking",
			"sms-acktiwator.ru": "129",
			"vak-sms.com": "bk"
		},
		"Prom.ua": {
			"sms-activate.ru": "cm",
			"smshub.org": "cm",
			"smspva.com": "opt107",
			"onlinesim.ru": "prom_ua",
			"sms-acktiwator.ru": "82"
		},
		"AliPay": {
			"sms-activate.ru": "hw",
			"smshub.org": "hw",
			"5sim.net": "alipay",
			"getsms.online": "ap",
			"onlinesim.ru": "alipay",
			"sms-acktiwator.ru": "119",
			"give-sms.com": "hw"
		},
		"Karusel": {
			"sms-activate.ru": "de",
			"smshub.org": "de",
			"onlinesim.ru": "karusel",
			"give-sms.com": "de"
		},
		"IVI": {
			"sms-activate.ru": "jc",
			"smshub.org": "jc",
			"onlinesim.ru": "ivi"
		},
		"inDriver": {
			"sms-activate.ru": "rl",
			"smshub.org": "rl",
			"sms.kopeechka.store": "rl",
			"onlinesim.ru": "indriver",
			"sms-acktiwator.ru": "203",
			"give-sms.com": "rl"
		},
		"Happn": {
			"sms-activate.ru": "df",
			"smshub.org": "df",
			"sms.kopeechka.store": "df",
			"give-sms.com": "df"
		},
		"RuTube": {
			"sms-activate.ru": "ui",
			"smshub.org": "ui",
			"sms.kopeechka.store": "ui",
			"onlinesim.ru": "rutube"
		},
		"Magnolia": {
			"sms-activate.ru": "up",
			"smshub.org": "up",
			"5sim.net": "magnolia",
			"cheapsms.ru": "mg",
			"vak-sms.com": "mn"
		},
		"FoodPanda": {
			"sms-activate.ru": "nz",
			"smshub.org": "nz",
			"5sim.net": "foodpanda",
			"cheapsms.ru": "fp",
			"onlinesim.ru": "foodpanda",
			"sms-acktiwator.ru": "214",
			"give-sms.com": "nz"
		},
		"Weibo": {
			"sms-activate.ru": "kf",
			"smshub.org": "kf",
			"5sim.net": "weibo",
			"onlinesim.ru": "weibo",
			"sms-acktiwator.ru": "141"
		},
		"BillMill": {
			"sms-activate.ru": "ri",
			"smshub.org": "ri"
		},
		"Quipp": {
			"sms-activate.ru": "cc",
			"smshub.org": "cc",
			"5sim.net": "quipp"
		},
		"Okta": {
			"sms-activate.ru": "lr",
			"smshub.org": "lr"
		},
		"JD.com": {
			"sms-activate.ru": "za",
			"smshub.org": "za",
			"5sim.net": "jd",
			"smspva.com": "opt94",
			"sms-acktiwator.ru": "164",
			"give-sms.com": "za"
		},
		"MTS CashBack": {
			"sms-activate.ru": "da",
			"smshub.org": "da",
			"5sim.net": "mtscashback",
			"give-sms.com": "da"
		},
		"Fiqsy": {
			"sms-activate.ru": "ug",
			"smshub.org": "ug"
		},
		"KuCoinPlay": {
			"sms-activate.ru": "sq",
			"smshub.org": "sq",
			"onlinesim.ru": "kucoinplay"
		},
		"Papara": {
			"sms-activate.ru": "zr",
			"smshub.org": "zr",
			"5sim.net": "papara",
			"sms.kopeechka.store": "zr",
			"onlinesim.ru": "papara",
			"sms-acktiwator.ru": "180",
			"vak-sms.com": "pr"
		},
		"Wish": {
			"sms-activate.ru": "xv",
			"smshub.org": "xv",
			"5sim.net": "wish"
		},
		"Icrypex": {
			"sms-activate.ru": "cx",
			"smshub.org": "cx"
		},
		"PaddyPower": {
			"sms-activate.ru": "cw",
			"smshub.org": "cw",
			"smspva.com": "opt109",
			"sms-acktiwator.ru": "219"
		},
		"Baidu": {
			"sms-activate.ru": "li",
			"smshub.org": "li",
			"onlinesim.ru": "baidu"
		},
		"Dominos Pizza": {
			"sms-activate.ru": "dz",
			"smshub.org": "dz"
		},
		"Paycell": {
			"sms-activate.ru": "xz",
			"smshub.org": "xz",
			"5sim.net": "paycell"
		},
		"Lenta": {
			"sms-activate.ru": "rd",
			"smshub.org": "rd",
			"5sim.net": "lenta",
			"cheapsms.ru": "ln",
			"onlinesim.ru": "lenta",
			"vak-sms.com": "lt"
		},
		"Payberry": {
			"sms-activate.ru": "qb",
			"smshub.org": "qb"
		},
		"Drom.ru": {
			"sms-activate.ru": "hz",
			"smshub.org": "hz",
			"5sim.net": "drom",
			"smsvk.net": "dr",
			"smspva.com": "opt32",
			"onlinesim.ru": "dromru",
			"sms-acktiwator.ru": "37",
			"vak-sms.com": "dr"
		},
		"GlobalTel": {
			"sms-activate.ru": "gl",
			"smshub.org": "gl"
		},
		"Deliveroo": {
			"sms-activate.ru": "zk",
			"smshub.org": "zk",
			"5sim.net": "deliveroo",
			"smspva.com": "opt53",
			"vak-sms.com": "do"
		},
		"Socios": {
			"sms-activate.ru": "ia",
			"smshub.org": "ia"
		},
		"Wmaraci": {
			"sms-activate.ru": "xl",
			"smshub.org": "xl"
		},
		"Yemeksepeti": {
			"sms-activate.ru": "yi",
			"smshub.org": "yi",
			"5sim.net": "yemeksepeti"
		},
		"Nike": {
			"sms-activate.ru": "ew",
			"smshub.org": "ew",
			"5sim.net": "nike",
			"cheapsms.ru": "nk",
			"smspva.com": "opt86",
			"onlinesim.ru": "nike",
			"sms-acktiwator.ru": "211",
			"vak-sms.com": "nk",
			"give-sms.com": "ew"
		},
		"myGLO": {
			"sms-activate.ru": "ae",
			"smshub.org": "ae"
		},
		"YouStar": {
			"sms-activate.ru": "gb",
			"smshub.org": "gb",
			"give-sms.com": "gb"
		},
		"РСА": {
			"sms-activate.ru": "cy",
			"smshub.org": "cy",
			"cheapsms.ru": "pc",
			"sms-acktiwator.ru": "153",
			"give-sms.com": "cy"
		},
		"RosaKhutor": {
			"sms-activate.ru": "qm",
			"smshub.org": "qm"
		},
		"eBay": {
			"sms-activate.ru": "dh",
			"smshub.org": "dh",
			"5sim.net": "ebay",
			"smspva.com": "opt83",
			"onlinesim.ru": "ebay",
			"sms-acktiwator.ru": "220",
			"vak-sms.com": "eb"
		},
		"Kvartplata+": {
			"sms-activate.ru": "yb",
			"smshub.org": "yb"
		},
		"GG": {
			"sms-activate.ru": "qe",
			"smshub.org": "qe"
		},
		"Grindr": {
			"sms-activate.ru": "yw",
			"smshub.org": "yw",
			"5sim.net": "grindr",
			"cheapsms.ru": "gr",
			"sms.kopeechka.store": "gr",
			"smspva.com": "opt110",
			"onlinesim.ru": "grindr",
			"sms-acktiwator.ru": "208",
			"vak-sms.com": "gi",
			"give-sms.com": "yw"
		},
		"OffGamers": {
			"sms-activate.ru": "uz",
			"smshub.org": "uz"
		},
		"Hepsiburada.com": {
			"sms-activate.ru": "gx",
			"smshub.org": "gx"
		},
		"CoinBase": {
			"sms-activate.ru": "re",
			"smshub.org": "re",
			"5sim.net": "coinbase",
			"smspva.com": "opt112",
			"sms-acktiwator.ru": "450",
			"vak-sms.com": "cb"
		},
		"dbrUA": {
			"sms-activate.ru": "tj",
			"smshub.org": "tj"
		},
		"PayPal": {
			"sms-activate.ru": "ts",
			"smshub.org": "ts",
			"5sim.net": "paypal",
			"sms.kopeechka.store": "pl",
			"smspva.com": "opt83",
			"sms-acktiwator.ru": "206",
			"vak-sms.com": "pp"
		},
		"Hily": {
			"sms-activate.ru": "rt",
			"smshub.org": "rt"
		},
		"SneakersnStuff": {
			"sms-activate.ru": "sf",
			"smshub.org": "sf",
			"smspva.com": "opt119"
		},
		"Dostavista": {
			"sms-activate.ru": "sv",
			"smshub.org": "sv",
			"5sim.net": "dostavista",
			"onlinesim.ru": "dostavista"
		},
		"32red": {
			"sms-activate.ru": "qi",
			"smspva.com": "opt97",
			"vak-sms.com": "rd"
		},
		"Blizzard": {
			"sms-activate.ru": "bz",
			"smshub.org": "bz",
			"5sim.net": "blizzard",
			"smspva.com": "opt78",
			"onlinesim.ru": "battle_net",
			"give-sms.com": "bz"
		},
		"ezBuy": {
			"sms-activate.ru": "db",
			"smshub.org": "db"
		},
		"CoinField": {
			"sms-activate.ru": "vw",
			"smshub.org": "vw"
		},
		"Airtel": {
			"sms-activate.ru": "zl",
			"smshub.org": "zl"
		},
		"YandexGo": {
			"sms-activate.ru": "wf",
			"smshub.org": "wf",
			"smsvk.net": "yt",
			"cheapsms.ru": "yg",
			"sms-acktiwator.ru": "56"
		},
		"MrGreen": {
			"sms-activate.ru": "lw",
			"smshub.org": "lw"
		},
		"Rediffmail": {
			"sms-activate.ru": "co",
			"smshub.org": "co",
			"sms-acktiwator.ru": "155"
		},
		"Miloan": {
			"sms-activate.ru": "ey",
			"smshub.org": "ey",
			"sms-acktiwator.ru": "89"
		},
		"Paytm": {
			"sms-activate.ru": "ge",
			"smshub.org": "ge"
		},
		"Dhani": {
			"sms-activate.ru": "os",
			"smshub.org": "os"
		},
		"CMTcuzdan": {
			"sms-activate.ru": "ql",
			"smshub.org": "ql"
		},
		"Mercado": {
			"sms-activate.ru": "cq",
			"smshub.org": "cq",
			"5sim.net": "mercado"
		},
		"DiDi": {
			"sms-activate.ru": "xk",
			"smshub.org": "xk",
			"5sim.net": "didi",
			"cheapsms.ru": "di",
			"smspva.com": "opt92",
			"onlinesim.ru": "didi",
			"sms-acktiwator.ru": "229",
			"give-sms.com": "xk"
		},
		"Monese": {
			"sms-activate.ru": "py",
			"smshub.org": "py",
			"smspva.com": "opt121",
			"vak-sms.com": "me"
		},
		"Kotak811": {
			"sms-activate.ru": "rv",
			"smshub.org": "rv",
			"5sim.net": "kotak811"
		},
		"Hopi": {
			"sms-activate.ru": "jl",
			"smshub.org": "jl",
			"5sim.net": "hopi"
		},
		"Trendyol": {
			"sms-activate.ru": "pr",
			"smshub.org": "pr",
			"5sim.net": "trendyol"
		},
		"JustDating": {
			"sms-activate.ru": "pu",
			"smshub.org": "pu",
			"5sim.net": "justdating",
			"onlinesim.ru": "justdating"
		},
		"Pairs": {
			"sms-activate.ru": "dk",
			"smshub.org": "dk",
			"5sim.net": "pairs"
		},
		"Touchance": {
			"sms-activate.ru": "fm",
			"smshub.org": "fm",
			"5sim.net": "touchance"
		},
		"SnappFood": {
			"sms-activate.ru": "ph",
			"smshub.org": "ph"
		},
		"NCsoft": {
			"sms-activate.ru": "sw",
			"smshub.org": "sw"
		},
		"Tosla": {
			"sms-activate.ru": "nr",
			"smshub.org": "nr",
			"5sim.net": "tosla"
		},
		"Ininal": {
			"sms-activate.ru": "hy",
			"smshub.org": "hy",
			"5sim.net": "ininal"
		},
		"Paysend": {
			"sms-activate.ru": "tr",
			"smshub.org": "tr"
		},
		"CDKeys": {
			"sms-activate.ru": "pq",
			"smshub.org": "pq",
			"5sim.net": "cdkeys"
		},
		"AVON": {
			"sms-activate.ru": "ff",
			"smshub.org": "ff",
			"onlinesim.ru": "avon",
			"sms-acktiwator.ru": "167"
		},
		"DodoPizza": {
			"sms-activate.ru": "sd",
			"smshub.org": "sd",
			"5sim.net": "dodopizza",
			"cheapsms.ru": "dd",
			"smspva.com": "opt27",
			"onlinesim.ru": "dodopizza"
		},
		"McDonalds": {
			"sms-activate.ru": "ry",
			"smshub.org": "ry",
			"5sim.net": "mcdonalds",
			"cheapsms.ru": "md",
			"onlinesim.ru": "mcdonalds",
			"sms-acktiwator.ru": "205",
			"vak-sms.com": "md",
			"give-sms.com": "ry"
		},
		"E bike Gewinnspiel": {
			"sms-activate.ru": "le",
			"smshub.org": "le"
		},
		"JKF": {
			"sms-activate.ru": "hr",
			"smshub.org": "hr"
		},
		"MyFishka": {
			"sms-activate.ru": "qa",
			"smshub.org": "qa",
			"sms-acktiwator.ru": "463"
		},
		"Craigslist": {
			"sms-activate.ru": "wc",
			"smshub.org": "wc",
			"5sim.net": "craigslist",
			"smspva.com": "opt26"
		},
		"Foody": {
			"sms-activate.ru": "kw",
			"smshub.org": "kw",
			"5sim.net": "foody"
		},
		"Grab": {
			"sms-activate.ru": "jg",
			"smshub.org": "jg",
			"5sim.net": "grabtaxi",
			"smspva.com": "opt30",
			"onlinesim.ru": "grab",
			"sms-acktiwator.ru": "227"
		},
		"Zalo": {
			"sms-activate.ru": "mj",
			"smshub.org": "mj",
			"5sim.net": "zalo",
			"onlinesim.ru": "zalo"
		},
		"LiveScore": {
			"sms-activate.ru": "eu",
			"smshub.org": "eu",
			"5sim.net": "livescore",
			"smspva.com": "opt42",
			"onlinesim.ru": "livescore"
		},
		"888casino": {
			"sms-activate.ru": "ll",
			"smshub.org": "ll",
			"smspva.com": "opt22",
			"sms-acktiwator.ru": "216"
		},
		"Gamer": {
			"sms-activate.ru": "ed",
			"smshub.org": "ed"
		},
		"Huya": {
			"sms-activate.ru": "pp",
			"smshub.org": "pp"
		},
		"WestStein": {
			"sms-activate.ru": "th",
			"smshub.org": "th",
			"smspva.com": "opt80",
			"sms-acktiwator.ru": "222"
		},
		"Tango": {
			"sms-activate.ru": "xr",
			"smshub.org": "xr",
			"5sim.net": "tango",
			"smspva.com": "opt82",
			"give-sms.com": "xr"
		},
		"Global24": {
			"sms-activate.ru": "iz",
			"smshub.org": "iz",
			"sms-acktiwator.ru": "461"
		},
		"MVideo": {
			"sms-activate.ru": "tk",
			"smshub.org": "tk",
			"onlinesim.ru": "m_video",
			"sms-acktiwator.ru": "62",
			"vak-sms.com": "mv",
			"give-sms.com": "tk"
		},
		"SheerID": {
			"sms-activate.ru": "rx",
			"smshub.org": "rx",
			"5sim.net": "sheerid"
		},
		"99app": {
			"sms-activate.ru": "ki",
			"smshub.org": "ki"
		},
		"CAIXA": {
			"sms-activate.ru": "my",
			"smshub.org": "my"
		},
		"OfferUp": {
			"sms-activate.ru": "zm",
			"smshub.org": "zm",
			"5sim.net": "offerup",
			"smspva.com": "opt113"
		},
		"Swvl": {
			"sms-activate.ru": "tq",
			"smshub.org": "tq",
			"5sim.net": "swvl"
		},
		"Haraj": {
			"sms-activate.ru": "au",
			"smshub.org": "au",
			"5sim.net": "haraj"
		},
		"Taksheel": {
			"sms-activate.ru": "ei",
			"smshub.org": "ei",
			"5sim.net": "taksheel"
		},
		"hamrahaval": {
			"sms-activate.ru": "rp",
			"smshub.org": "rp"
		},
		"Gamekit": {
			"sms-activate.ru": "pa",
			"smshub.org": "pa"
		},
		"Şikayet var": {
			"sms-activate.ru": "fs",
			"smshub.org": "fs",
			"5sim.net": "sikayetvar"
		},
		"Getir": {
			"sms-activate.ru": "ul",
			"smshub.org": "ul",
			"5sim.net": "getir"
		},
		"irancell": {
			"sms-activate.ru": "cf",
			"smshub.org": "cf"
		},
		"Alfa": {
			"sms-activate.ru": "bt",
			"smshub.org": "bt"
		},
		"Disney Hotstar": {
			"sms-activate.ru": "ud",
			"smshub.org": "ud"
		},
		"Agroinform": {
			"sms-activate.ru": "qu",
			"smshub.org": "qu"
		},
		"HumbleBundle": {
			"sms-activate.ru": "un",
			"smshub.org": "un"
		},
		"Faberlic": {
			"sms-activate.ru": "rm",
			"smshub.org": "rm",
			"onlinesim.ru": "faberlic",
			"sms-acktiwator.ru": "77"
		},
		"CafeBazaar": {
			"sms-activate.ru": "uo",
			"smshub.org": "uo"
		},
		"cryptocom": {
			"sms-activate.ru": "ti",
			"smshub.org": "ti"
		},
		"Gittigidiyor": {
			"sms-activate.ru": "nk",
			"smshub.org": "nk"
		},
		"mzadqatar": {
			"sms-activate.ru": "jm",
			"smshub.org": "jm"
		},
		"Algida": {
			"sms-activate.ru": "lp",
			"smshub.org": "lp"
		},
		"Cita Previa": {
			"sms-activate.ru": "si",
			"smshub.org": "si",
			"vak-sms.com": "ca"
		},
		"Potato Chat": {
			"sms-activate.ru": "fj",
			"smshub.org": "fj",
			"5sim.net": "potato",
			"sms-acktiwator.ru": "472"
		},
		"Bitaqaty": {
			"sms-activate.ru": "pt",
			"smshub.org": "pt"
		},
		"Primaries 2020": {
			"sms-activate.ru": "qc",
			"smshub.org": "qc"
		},
		"Amasia": {
			"sms-activate.ru": "yo",
			"smshub.org": "yo",
			"5sim.net": "amasia",
			"sms-acktiwator.ru": "221"
		},
		"Dream11": {
			"sms-activate.ru": "ve",
			"smshub.org": "ve"
		},
		"Oriflame": {
			"sms-activate.ru": "qh",
			"smshub.org": "qh",
			"onlinesim.ru": "oriflame"
		},
		"Bykea": {
			"sms-activate.ru": "iu",
			"smshub.org": "iu"
		},
		"Immowelt": {
			"sms-activate.ru": "ib",
			"smshub.org": "ib"
		},
		"Digikala": {
			"sms-activate.ru": "zv",
			"smshub.org": "zv"
		},
		"Wing Money": {
			"sms-activate.ru": "jb",
			"smshub.org": "jb",
			"smspva.com": "opt106"
		},
		"Yaay": {
			"sms-activate.ru": "vn",
			"smshub.org": "vn"
		},
		"GameArena": {
			"sms-activate.ru": "wn",
			"smshub.org": "wn"
		},
		"VitaExpress": {
			"sms-activate.ru": "bj",
			"smshub.org": "bj"
		},
		"Auchan": {
			"sms-activate.ru": "st",
			"smshub.org": "st",
			"onlinesim.ru": "auchan"
		},
		"Picpay": {
			"sms-activate.ru": "ev",
			"smshub.org": "ev"
		},
		"Blued": {
			"sms-activate.ru": "qn",
			"smshub.org": "qn"
		},
		"SpotHit": {
			"sms-activate.ru": "cd",
			"smshub.org": "cd"
		},
		"Brand20.ua": {
			"sms-activate.ru": "vo",
			"smshub.org": "vo"
		},
		"IQOS": {
			"sms-activate.ru": "il",
			"smshub.org": "il",
			"onlinesim.ru": "iqos",
			"sms-acktiwator.ru": "140"
		},
		"Powerkredite": {
			"sms-activate.ru": "dx",
			"smshub.org": "dx"
		},
		"Bisu": {
			"sms-activate.ru": "el",
			"smshub.org": "el"
		},
		"Paxful": {
			"sms-activate.ru": "dn",
			"smshub.org": "dn",
			"onlinesim.ru": "paxful"
		},
		"PurePlatfrom": {
			"sms-activate.ru": "lk",
			"smshub.org": "lk"
		},
		"Banqi": {
			"sms-activate.ru": "vc",
			"smshub.org": "vc"
		},
		"1xBet": {
			"sms-activate.ru": "wj",
			"smshub.org": "wj",
			"5sim.net": "1xbet",
			"onlinesim.ru": "1xbet"
		},
		"Mobile01": {
			"sms-activate.ru": "wk",
			"smshub.org": "wk"
		},
		"Aitu": {
			"sms-activate.ru": "jj",
			"smshub.org": "jj",
			"give-sms.com": "jj"
		},
		"Adidas": {
			"sms-activate.ru": "an",
			"smshub.org": "an",
			"5sim.net": "adidas",
			"cheapsms.ru": "ad",
			"smspva.com": "opt86",
			"onlinesim.ru": "adidas",
			"sms-acktiwator.ru": "454",
			"give-sms.com": "an"
		},
		"Samokat": {
			"sms-activate.ru": "jr",
			"smshub.org": "jr",
			"5sim.net": "samokat",
			"cheapsms.ru": "sa",
			"onlinesim.ru": "smart_space",
			"sms-acktiwator.ru": "202",
			"vak-sms.com": "sk",
			"give-sms.com": "jr"
		},
		"Vernyi": {
			"sms-activate.ru": "nb",
			"smshub.org": "nb",
			"5sim.net": "vernyi",
			"onlinesim.ru": "vernyi",
			"sms-acktiwator.ru": "176",
			"vak-sms.com": "vn",
			"give-sms.com": "nb"
		},
		"Humta": {
			"sms-activate.ru": "gv",
			"smshub.org": "gv"
		},
		"Divar": {
			"sms-activate.ru": "dw",
			"smshub.org": "dw"
		},
		"Carousell": {
			"sms-activate.ru": "gj",
			"smshub.org": "gj"
		},
		"MOMO": {
			"sms-activate.ru": "hc",
			"smshub.org": "hc",
			"smspva.com": "opt99",
			"onlinesim.ru": "momo"
		},
		"Eneba": {
			"sms-activate.ru": "uf",
			"smshub.org": "uf",
			"onlinesim.ru": "eneba_com"
		},
		"Verse": {
			"sms-activate.ru": "kn",
			"smshub.org": "kn",
			"smspva.com": "opt39"
		},
		"Taobao": {
			"sms-activate.ru": "qd",
			"smshub.org": "qd",
			"5sim.net": "taobao",
			"getsms.online": "ap",
			"smspva.com": "opt61",
			"onlinesim.ru": "taobao",
			"sms-acktiwator.ru": "230"
		},
		"1688": {
			"sms-activate.ru": "hn",
			"smshub.org": "hn",
			"5sim.net": "1688",
			"smspva.com": "opt28"
		},
		"OnTaxi": {
			"sms-activate.ru": "zf",
			"smshub.org": "zf",
			"onlinesim.ru": "ontaxi"
		},
		"Hotline": {
			"sms-activate.ru": "gi",
			"smshub.org": "gi",
			"sms-acktiwator.ru": "462"
		},
		"Tatneft": {
			"sms-activate.ru": "uc",
			"smshub.org": "uc",
			"onlinesim.ru": "tatneft"
		},
		"RRSA": {
			"sms-activate.ru": "mn",
			"smshub.org": "mn"
		},
		"Douyu": {
			"sms-activate.ru": "ak",
			"smshub.org": "ak",
			"5sim.net": "douyu",
			"onlinesim.ru": "douyu"
		},
		"Uklon": {
			"sms-activate.ru": "cp",
			"smshub.org": "cp",
			"onlinesim.ru": "uklon",
			"sms-acktiwator.ru": "460"
		},
		"MoneyLion": {
			"sms-activate.ru": "qo",
			"smshub.org": "qo",
			"smspva.com": "opt47"
		},
		"Apple": {
			"sms-activate.ru": "wx",
			"smshub.org": "wx",
			"sms.kopeechka.store": "ap",
			"onlinesim.ru": "apple",
			"sms-acktiwator.ru": "459"
		},
		"Clubhouse": {
			"sms-activate.ru": "et",
			"smshub.org": "et",
			"onlinesim.ru": "clubhouse",
			"sms-acktiwator.ru": "471",
			"vak-sms.com": "ch"
		},
		"Nifty": {
			"sms-activate.ru": "px",
			"smshub.org": "px",
			"5sim.net": "nifty"
		},
		"PingPong": {
			"sms-activate.ru": "jh",
			"smshub.org": "jh",
			"smsvk.net": "jh",
			"sms.kopeechka.store": "pi"
		},
		"Mail.ru Group": {
			"sms-activate.ru": "lb",
			"smspva.com": "opt4",
			"vak-sms.com": "mr"
		},
		"Banks": {
			"sms-activate.ru": "md",
			"smshub.org": "md"
		},
		"BitClout": {
			"sms-activate.ru": "lt",
			"smshub.org": "lt",
			"5sim.net": "bitclout",
			"sms-acktiwator.ru": "466"
		},
		"Skroutz": {
			"sms-activate.ru": "sk",
			"smshub.org": "sk"
		},
		"MapleSEA": {
			"sms-activate.ru": "oh",
			"smshub.org": "oh",
			"onlinesim.ru": "maplesea",
			"sms-acktiwator.ru": "473"
		},
		"Rozetka": {
			"sms-activate.ru": "km",
			"smshub.org": "km",
			"sms-acktiwator.ru": "457"
		},
		"GalaxyWin": {
			"sms-activate.ru": "af",
			"smshub.org": "af"
		},
		"Ziglu": {
			"sms-activate.ru": "tt",
			"smshub.org": "tt"
		},
		"Likee": {
			"sms-activate.ru": "jf",
			"smshub.org": "jf",
			"onlinesim.ru": "likee"
		},
		"CityBase": {
			"sms-activate.ru": "az",
			"smshub.org": "az",
			"sms-acktiwator.ru": "464"
		},
		"Allegro": {
			"sms-activate.ru": "yn",
			"smshub.org": "yn"
		},
		"YouGotaGift": {
			"sms-activate.ru": "wl",
			"smshub.org": "wl",
			"sms-acktiwator.ru": "465"
		},
		"Lazada": {
			"sms-activate.ru": "dl",
			"smshub.org": "dl",
			"5sim.net": "lazada",
			"smspva.com": "opt60",
			"sms-acktiwator.ru": "470"
		},
		"TradingView": {
			"sms-activate.ru": "gc",
			"smshub.org": "gc",
			"cheapsms.ru": "tv",
			"onlinesim.ru": "tradingview",
			"vak-sms.com": "tv"
		},
		"Fiverr": {
			"sms-activate.ru": "cn",
			"smshub.org": "cn",
			"5sim.net": "fiverr",
			"smspva.com": "opt6"
		},
		"Gabi": {
			"sms-activate.ru": "ou",
			"smshub.org": "ou"
		},
		"Kwai": {
			"sms-activate.ru": "vp",
			"smshub.org": "vp",
			"5sim.net": "kwai",
			"smsvk.net": "kw",
			"onlinesim.ru": "kwai"
		},
		"Детский мир": {
			"sms-activate.ru": "rj",
			"smshub.org": "rj",
			"cheapsms.ru": "dm"
		},
		"Yubo": {
			"sms-activate.ru": "uh",
			"smshub.org": "uh"
		},
		"iQIYI": {
			"sms-activate.ru": "es",
			"smshub.org": "es"
		},
		"23red": {
			"smshub.org": "qi",
			"5sim.net": "23red"
		},
		"PaySend": {
			"5sim.net": "paysend"
		},
		"Aliexpress": {
			"5sim.net": "aliexpress",
			"onlinesim.ru": "aliexpress",
			"sms-acktiwator.ru": "78",
			"vak-sms.com": "ai"
		},
		"Airtel (wf)": {
			"5sim.net": "airtel"
		},
		"Akelni": {
			"5sim.net": "akelni",
			"onlinesim.ru": "akelni"
		},
		"Azino": {
			"5sim.net": "azino"
		},
		"BitTube": {
			"5sim.net": "bittube",
			"sms-acktiwator.ru": "152"
		},
		"Blockchain": {
			"5sim.net": "blockchain",
			"onlinesim.ru": "blockchain",
			"sms-acktiwator.ru": "156",
			"vak-sms.com": "bc"
		},
		"Cekkazan": {
			"5sim.net": "cekkazan"
		},
		"Dixy": {
			"5sim.net": "dixy",
			"cheapsms.ru": "ds",
			"onlinesim.ru": "dixi"
		},
		"Domdara": {
			"5sim.net": "domdara",
			"sms.kopeechka.store": "dd"
		},
		"Dukascopy": {
			"5sim.net": "dukascopy",
			"onlinesim.ru": "dukascopy"
		},
		"Edgeless": {
			"5sim.net": "edgeless"
		},
		"Electroneum": {
			"5sim.net": "electroneum",
			"onlinesim.ru": "electroneum"
		},
		"Forwarding": {
			"5sim.net": "forwarding"
		},
		"GameFlip": {
			"5sim.net": "gameflip",
			"smspva.com": "opt77",
			"onlinesim.ru": "gameflip",
			"sms-acktiwator.ru": "150"
		},
		"Gcash": {
			"5sim.net": "gcash",
			"onlinesim.ru": "gcash"
		},
		"Get": {
			"5sim.net": "get"
		},
		"Glovo": {
			"5sim.net": "glovo",
			"smspva.com": "opt108",
			"onlinesim.ru": "glovo"
		},
		"Green": {
			"5sim.net": "green"
		},
		"iCard": {
			"5sim.net": "icard",
			"smspva.com": "opt103",
			"sms-acktiwator.ru": "144"
		},
		"IOST": {
			"5sim.net": "iost",
			"onlinesim.ru": "iost",
			"sms-acktiwator.ru": "114"
		},
		"KomandaCard": {
			"5sim.net": "komandacard",
			"sms-acktiwator.ru": "145"
		},
		"LBRY": {
			"5sim.net": "lbry"
		},
		"Lianxin": {
			"5sim.net": "lianxin"
		},
		"Nimses": {
			"5sim.net": "nimses",
			"sms-reg.com": "nimses",
			"onlinesim.ru": "nimses",
			"sms-acktiwator.ru": "40"
		},
		"OkCupid": {
			"5sim.net": "okcupid"
		},
		"Okey": {
			"5sim.net": "okey",
			"cheapsms.ru": "oy",
			"onlinesim.ru": "okey",
			"sms-acktiwator.ru": "103"
		},
		"OpenPoint": {
			"5sim.net": "openpoint"
		},
		"Oracle": {
			"5sim.net": "oraclecloud",
			"smspva.com": "opt115",
			"onlinesim.ru": "oracle"
		},
		"PayMaya": {
			"5sim.net": "paymaya"
		},
		"Pokec": {
			"5sim.net": "pokec"
		},
		"PokerMaster": {
			"5sim.net": "pokermaster"
		},
		"PUBG": {
			"5sim.net": "pubg",
			"onlinesim.ru": "pubg"
		},
		"Reuse": {
			"5sim.net": "reuse"
		},
		"Ripkord": {
			"5sim.net": "ripkord"
		},
		"Signal": {
			"5sim.net": "signal",
			"smspva.com": "opt127",
			"onlinesim.ru": "signal",
			"vak-sms.com": "sg"
		},
		"TanTan": {
			"5sim.net": "tantan",
			"sms.kopeechka.store": "ta",
			"onlinesim.ru": "tantan"
		},
		"Totalcoin": {
			"5sim.net": "totalcoin"
		},
		"Uploaded": {
			"5sim.net": "uploaded"
		},
		"Voopee": {
			"5sim.net": "voopee"
		},
		"WEKU": {
			"5sim.net": "weku"
		},
		"Winston": {
			"5sim.net": "winston",
			"onlinesim.ru": "winston"
		},
		"YouDo": {
			"5sim.net": "youdo",
			"onlinesim.ru": "youdo",
			"sms-acktiwator.ru": "75"
		},
		"Ace2Three": {
			"5sim.net": "ace2three"
		},
		"B4U Cabs": {
			"5sim.net": "b4ucabs"
		},
		"Bigcash": {
			"5sim.net": "bigcash"
		},
		"Click Entregas": {
			"5sim.net": "clickentregas"
		},
		"eZWay": {
			"5sim.net": "ezway"
		},
		"Flipkart": {
			"5sim.net": "flipkart"
		},
		"Galaxy": {
			"5sim.net": "galaxy"
		},
		"Nana": {
			"5sim.net": "nana"
		},
		"NHSEVEN": {
			"5sim.net": "nhseven"
		},
		"People.com": {
			"5sim.net": "peoplecom"
		},
		"Protp": {
			"5sim.net": "protp"
		},
		"Quioo": {
			"5sim.net": "quioo"
		},
		"Zomato": {
			"5sim.net": "zomato"
		},
		"Pandao": {
			"getsms.online": "nd",
			"cheapsms.ru": "pd",
			"onlinesim.ru": "pandao"
		},
		"TaxiMaxim": {
			"smsvk.net": "mx",
			"smspva.com": "opt74",
			"onlinesim.ru": "taximaxim",
			"sms-acktiwator.ru": "38"
		},
		"Goods": {
			"smsvk.net": "gd",
			"smspva.com": "opt70",
			"onlinesim.ru": "goods_ru",
			"sms-acktiwator.ru": "154"
		},
		"2Cupis": {
			"cheapsms.ru": "qc"
		},
		"1Cupis": {
			"cheapsms.ru": "1c",
			"onlinesim.ru": "1cupis_ru",
			"vak-sms.com": "cp"
		},
		"1Xstavka": {
			"cheapsms.ru": "ox"
		},
		"Beget": {
			"cheapsms.ru": "bt",
			"onlinesim.ru": "beget",
			"sms-acktiwator.ru": "133",
			"vak-sms.com": "bg"
		},
		"Benzuber": {
			"cheapsms.ru": "bz"
		},
		"CreditPlus": {
			"cheapsms.ru": "cp"
		},
		"FACEIT": {
			"cheapsms.ru": "fc",
			"onlinesim.ru": "faceit"
		},
		"Farfor": {
			"cheapsms.ru": "fr"
		},
		"GPNbonus": {
			"cheapsms.ru": "gp"
		},
		"Guideh": {
			"cheapsms.ru": "gd",
			"onlinesim.ru": "guideh"
		},
		"Kontur": {
			"cheapsms.ru": "kt"
		},
		"MegafonTV": {
			"cheapsms.ru": "me"
		},
		"Okko": {
			"cheapsms.ru": "ko",
			"onlinesim.ru": "okko"
		},
		"RESO": {
			"cheapsms.ru": "rs"
		},
		"RocketBank": {
			"cheapsms.ru": "rb"
		},
		"SeoSprint": {
			"cheapsms.ru": "ss"
		},
		"Steemit": {
			"cheapsms.ru": "sm",
			"onlinesim.ru": "steemit",
			"sms-acktiwator.ru": "57"
		},
		"T7 TAXI": {
			"cheapsms.ru": "st",
			"onlinesim.ru": "t7-taxi"
		},
		"TamTam": {
			"cheapsms.ru": "ta",
			"onlinesim.ru": "tamtam"
		},
		"Tinkoff": {
			"cheapsms.ru": "tf",
			"sms-acktiwator.ru": "58"
		},
		"Vkusvill": {
			"cheapsms.ru": "vv",
			"onlinesim.ru": "vkusvill",
			"vak-sms.com": "vv"
		},
		"WebMoney": {
			"cheapsms.ru": "wm",
			"smspva.com": "opt24",
			"sms-acktiwator.ru": "20",
			"vak-sms.com": "wm"
		},
		"Worki": {
			"cheapsms.ru": "wo"
		},
		"YooMoney": {
			"cheapsms.ru": "yo",
			"sms-acktiwator.ru": "453",
			"vak-sms.com": "ym"
		},
		"Zaymer": {
			"cheapsms.ru": "zy"
		},
		"ВеликиеИмена.рф": {
			"cheapsms.ru": "vm"
		},
		"Виктория.рф": {
			"cheapsms.ru": "vt"
		},
		"Gorzdrav": {
			"cheapsms.ru": "gz",
			"onlinesim.ru": "gorzdrav",
			"sms-acktiwator.ru": "168"
		},
		"ZdravCity": {
			"cheapsms.ru": "zc",
			"onlinesim.ru": "zdravcity",
			"sms-acktiwator.ru": "175",
			"vak-sms.com": "zc"
		},
		"НашЛюбимыйВрач.рф": {
			"cheapsms.ru": "vr"
		},
		"Почта России": {
			"cheapsms.ru": "pr"
		},
		"Fotostrana": {
			"cheapsms.ru": "fs",
			"sms-reg.com": "fotostrana",
			"smspva.com": "opt13",
			"onlinesim.ru": "fotostrana",
			"sms-acktiwator.ru": "21"
		},
		"PP.UA": {
			"sms.kopeechka.store": "pp",
			"onlinesim.ru": "ppua"
		},
		"Zoosk": {
			"sms.kopeechka.store": "zo"
		},
		"ServerSpace": {
			"sms.kopeechka.store": "sp"
		},
		"Apc": {
			"sms.kopeechka.store": "apc"
		},
		"Pikabu": {
			"sms.kopeechka.store": "pk",
			"onlinesim.ru": "pikabu"
		},
		"Band": {
			"sms.kopeechka.store": "pk"
		},
		"Up-x.net": {
			"sms.kopeechka.store": "up"
		},
		"FetLife": {
			"sms.kopeechka.store": "fe",
			"onlinesim.ru": "fetlife"
		},
		"Badoo": {
			"sms-reg.com": "badoo",
			"smspva.com": "opt56",
			"onlinesim.ru": "badoo",
			"vak-sms.com": "bd"
		},
		"BetFair": {
			"smspva.com": "opt25"
		},
		"CashWalk": {
			"smspva.com": "opt122"
		},
		"CONTACT": {
			"smspva.com": "opt51"
		},
		"Credit Karma": {
			"smspva.com": "opt124"
		},
		"Dabbl": {
			"smspva.com": "opt123"
		},
		"PapaJohns": {
			"smspva.com": "opt27",
			"onlinesim.ru": "papajohns"
		},
		"DoorDash": {
			"smspva.com": "opt40"
		},
		"FastMail": {
			"smspva.com": "opt43"
		},
		"G2A": {
			"smspva.com": "opt68",
			"onlinesim.ru": "g2a"
		},
		"Raketa": {
			"smspva.com": "opt108",
			"sms-acktiwator.ru": "163"
		},
		"Grailed": {
			"smspva.com": "opt420"
		},
		"Hinge": {
			"smspva.com": "opt120"
		},
		"Inboxdollars": {
			"smspva.com": "opt118"
		},
		"LocalBitcoins": {
			"smspva.com": "opt105",
			"onlinesim.ru": "localbitcoins"
		},
		"Locanto.com": {
			"smspva.com": "opt114"
		},
		"Lyft": {
			"smspva.com": "opt75",
			"onlinesim.ru": "lyft"
		},
		"LYKA": {
			"smspva.com": "opt38",
			"onlinesim.ru": "lyka"
		},
		"MS Office 365": {
			"smspva.com": "opt7"
		},
		"NetBet": {
			"smspva.com": "opt95"
		},
		"Neteller": {
			"smspva.com": "opt116"
		},
		"Postmates": {
			"smspva.com": "opt91"
		},
		"Skrill": {
			"smspva.com": "opt117"
		},
		"Streetbees": {
			"smspva.com": "opt98"
		},
		"Swagbucks": {
			"smspva.com": "opt125"
		},
		"TAN (micropayment)": {
			"smspva.com": "opt55"
		},
		"The Insiders": {
			"smspva.com": "opt14"
		},
		"Twilio": {
			"smspva.com": "opt66"
		},
		"Venmo": {
			"smspva.com": "opt85"
		},
		"E-NUM": {
			"smspva.com": "opt24",
			"onlinesim.ru": "e-num"
		},
		"Weebly": {
			"smspva.com": "opt54"
		},
		"lino_network": {
			"onlinesim.ru": "lino_network"
		},
		"Azino777": {
			"onlinesim.ru": "azino777",
			"sms-acktiwator.ru": "147"
		},
		"appbonus": {
			"onlinesim.ru": "appbonus",
			"sms-acktiwator.ru": "148"
		},
		"galaktika": {
			"onlinesim.ru": "galaktika"
		},
		"Hey_plus": {
			"onlinesim.ru": "hey_plus"
		},
		"Pokermaster": {
			"onlinesim.ru": "pokermaster"
		},
		"WRIGGLE": {
			"onlinesim.ru": "wriggle"
		},
		"Quidol": {
			"onlinesim.ru": "quidol"
		},
		"WhatsAround": {
			"onlinesim.ru": "whatsaround"
		},
		"PlanetaKino": {
			"onlinesim.ru": "planetakino"
		},
		"Sipnet": {
			"onlinesim.ru": "sipnet"
		},
		"ucoz": {
			"onlinesim.ru": "ucoz"
		},
		"1xStavka": {
			"onlinesim.ru": "1xstavka"
		},
		"HeadHunter": {
			"onlinesim.ru": "headhunter"
		},
		"OLIMP": {
			"onlinesim.ru": "olimp"
		},
		"WOG.ua": {
			"onlinesim.ru": "wog_ua",
			"sms-acktiwator.ru": "117"
		},
		"Adjarabet": {
			"onlinesim.ru": "adjarabet"
		},
		"HOMEAWAY": {
			"onlinesim.ru": "homeaway"
		},
		"Jollychic": {
			"onlinesim.ru": "jollychic"
		},
		"Zadarma": {
			"onlinesim.ru": "zadarma",
			"sms-acktiwator.ru": "138"
		},
		"GoJoy": {
			"onlinesim.ru": "gojoy"
		},
		"wanmei": {
			"onlinesim.ru": "wanmei"
		},
		"baihe": {
			"onlinesim.ru": "baihe"
		},
		"jiayuan": {
			"onlinesim.ru": "jiayuan"
		},
		"zhenai": {
			"onlinesim.ru": "zhenai"
		},
		"bbs_gfan_com": {
			"onlinesim.ru": "bbs_gfan_com"
		},
		"zhiji": {
			"onlinesim.ru": "zhiji"
		},
		"MiLiao": {
			"onlinesim.ru": "miliao"
		},
		"Soul": {
			"onlinesim.ru": "soul"
		},
		"paopao": {
			"onlinesim.ru": "paopao"
		},
		"lianxin": {
			"onlinesim.ru": "lianxin"
		},
		"plenty_of_fish": {
			"onlinesim.ru": "plenty_of_fish"
		},
		"Skype": {
			"onlinesim.ru": "skype",
			"sms-acktiwator.ru": "61"
		},
		"Douban": {
			"onlinesim.ru": "douban"
		},
		"Seagm": {
			"onlinesim.ru": "seagm"
		},
		"SuYue": {
			"onlinesim.ru": "suyue"
		},
		"Fordeal": {
			"onlinesim.ru": "fordeal"
		},
		"Kufar": {
			"onlinesim.ru": "kufar"
		},
		"Onliner": {
			"onlinesim.ru": "onliner"
		},
		"zenly": {
			"onlinesim.ru": "zenly"
		},
		"Аптека 36.6": {
			"onlinesim.ru": "apteka_36_6"
		},
		"kuchenland": {
			"onlinesim.ru": "kuchenland"
		},
		"Pyr_Music": {
			"onlinesim.ru": "pyr_music"
		},
		"Auto.ru": {
			"onlinesim.ru": "auto_ru",
			"sms-acktiwator.ru": "44"
		},
		"Webtransfer": {
			"onlinesim.ru": "webtransfer"
		},
		"OpenI": {
			"onlinesim.ru": "openi"
		},
		"LINE": {
			"onlinesim.ru": "line"
		},
		"GetResponse": {
			"onlinesim.ru": "getresponse",
			"sms-acktiwator.ru": "41"
		},
		"Spaces": {
			"onlinesim.ru": "spaces",
			"sms-acktiwator.ru": "33",
			"vak-sms.com": "si"
		},
		"RadugaVkusa": {
			"onlinesim.ru": "radugavkusa"
		},
		"brokerby": {
			"onlinesim.ru": "brokerby"
		},
		"Qrooto": {
			"onlinesim.ru": "qrooto",
			"sms-acktiwator.ru": "50"
		},
		"masterkey": {
			"onlinesim.ru": "masterkey"
		},
		"ElasticHosts": {
			"onlinesim.ru": "elastichosts"
		},
		"VEON": {
			"onlinesim.ru": "veon"
		},
		"Kaspersky": {
			"onlinesim.ru": "kaspersky"
		},
		"fex_net": {
			"onlinesim.ru": "fex_net"
		},
		"arumcapital": {
			"onlinesim.ru": "arumcapital"
		},
		"checktrust": {
			"onlinesim.ru": "checktrust"
		},
		"reshigo": {
			"onlinesim.ru": "reshigo"
		},
		"VSK": {
			"onlinesim.ru": "vsk"
		},
		"mql5": {
			"onlinesim.ru": "mql5"
		},
		"Huggies": {
			"onlinesim.ru": "huggies"
		},
		"7588": {
			"onlinesim.ru": "7588"
		},
		"zbt": {
			"onlinesim.ru": "zbt"
		},
		"CK_MAKC": {
			"onlinesim.ru": "ck_makc"
		},
		"WinLine": {
			"onlinesim.ru": "winline"
		},
		"ENNERGIIA": {
			"onlinesim.ru": "ennergiia"
		},
		"Wargaming": {
			"onlinesim.ru": "wargaming"
		},
		"eToro": {
			"onlinesim.ru": "etoro"
		},
		"NearKitchen": {
			"onlinesim.ru": "nearkitchen"
		},
		"periscope": {
			"onlinesim.ru": "periscope"
		},
		"bitrue": {
			"onlinesim.ru": "bitrue"
		},
		"CoinNess": {
			"onlinesim.ru": "coinness"
		},
		"homeaway.nl": {
			"onlinesim.ru": "homeaway_nl"
		},
		"tanuki": {
			"onlinesim.ru": "tanuki"
		},
		"Xiaomi": {
			"onlinesim.ru": "xiaomi"
		},
		"Stoloto": {
			"onlinesim.ru": "stoloto"
		},
		"Netease": {
			"onlinesim.ru": "netease"
		},
		"RUBIKE": {
			"onlinesim.ru": "rubike"
		},
		"TBankrot": {
			"onlinesim.ru": "tbankrot"
		},
		"BitForex": {
			"onlinesim.ru": "bitforex"
		},
		"Ojooo": {
			"onlinesim.ru": "ojooo"
		},
		"iHerb": {
			"onlinesim.ru": "iherb",
			"vak-sms.com": "ih"
		},
		"hotmail": {
			"onlinesim.ru": "hotmail"
		},
		"Ceresit": {
			"onlinesim.ru": "ceresit"
		},
		"MyACUVUE": {
			"onlinesim.ru": "myacuvue"
		},
		"TvoyaApteka": {
			"onlinesim.ru": "tvoyaapteka"
		},
		"Wink": {
			"onlinesim.ru": "wink"
		},
		"GRADUATE": {
			"onlinesim.ru": "graduate"
		},
		"GinzaGO": {
			"onlinesim.ru": "ginzago"
		},
		"Technopark": {
			"onlinesim.ru": "technopark"
		},
		"Sephora": {
			"onlinesim.ru": "sephora"
		},
		"Flowwow": {
			"onlinesim.ru": "flowwow"
		},
		"kinoteatr.ru": {
			"onlinesim.ru": "kinoteatr_ru"
		},
		"OKEx": {
			"onlinesim.ru": "okex"
		},
		"Sunlight": {
			"onlinesim.ru": "sunlight",
			"sms-acktiwator.ru": "131"
		},
		"Таксовичкоф": {
			"onlinesim.ru": "taxovichkof"
		},
		"Outbox": {
			"onlinesim.ru": "outbox"
		},
		"ch1": {
			"onlinesim.ru": "ch1"
		},
		"PageTester": {
			"onlinesim.ru": "pagetester"
		},
		"SMS": {
			"onlinesim.ru": "sms"
		},
		"SMS4TEST": {
			"onlinesim.ru": "sms4test"
		},
		"SMSINFO": {
			"onlinesim.ru": "smsinfo"
		},
		"SMSC.RU": {
			"onlinesim.ru": "smsc_ru"
		},
		"Verify": {
			"onlinesim.ru": "verify"
		},
		"NXSMS": {
			"onlinesim.ru": "nxsms"
		},
		"AGENT": {
			"onlinesim.ru": "agent"
		},
		"Info": {
			"onlinesim.ru": "info"
		},
		"PINCD": {
			"onlinesim.ru": "pincd"
		},
		"MSG": {
			"onlinesim.ru": "msg"
		},
		"InfoSMS": {
			"onlinesim.ru": "infosms"
		},
		"NemoTV": {
			"onlinesim.ru": "nemotv"
		},
		"TeleVerify": {
			"onlinesim.ru": "televerify"
		},
		"MZ_Real": {
			"onlinesim.ru": "mz_real"
		},
		"Infospika": {
			"onlinesim.ru": "infospika"
		},
		"1GB": {
			"onlinesim.ru": "1gb"
		},
		"MyArena": {
			"onlinesim.ru": "myarena"
		},
		"secure_otp": {
			"onlinesim.ru": "secure_otp"
		},
		"Maxim": {
			"onlinesim.ru": "maxim"
		},
		"NEXMOSMS": {
			"onlinesim.ru": "nexmosms"
		},
		"TeleMSG": {
			"onlinesim.ru": "telemsg"
		},
		"MoiKontent": {
			"onlinesim.ru": "moikontent"
		},
		"INGOSSTRAKH": {
			"onlinesim.ru": "ingosstrakh"
		},
		"tabor.ru": {
			"onlinesim.ru": "tabor_ru",
			"sms-acktiwator.ru": "35"
		},
		"LDinfo": {
			"onlinesim.ru": "ldinfo",
			"sms-acktiwator.ru": "22"
		},
		"Matroskin": {
			"onlinesim.ru": "matroskin"
		},
		"NEXMO_SMS": {
			"onlinesim.ru": "nexmo_sms"
		},
		"CNET": {
			"onlinesim.ru": "cnet"
		},
		"APPCENT": {
			"onlinesim.ru": "appcent"
		},
		"INFORM": {
			"onlinesim.ru": "inform"
		},
		"4game": {
			"onlinesim.ru": "4game",
			"sms-acktiwator.ru": "34"
		},
		"NexmoVerify": {
			"onlinesim.ru": "nexmoverify"
		},
		"BrEx": {
			"onlinesim.ru": "brex"
		},
		"SMS.RU": {
			"onlinesim.ru": "sms_ru"
		},
		"Dating": {
			"onlinesim.ru": "dating"
		},
		"UltraVDS": {
			"onlinesim.ru": "ultravds"
		},
		"kontur": {
			"onlinesim.ru": "kontur"
		},
		"Chpoking": {
			"onlinesim.ru": "chpoking"
		},
		"Yandex.Eda": {
			"onlinesim.ru": "yandex_eda",
			"sms-acktiwator.ru": "121"
		},
		"YouDo.com": {
			"onlinesim.ru": "youdo_com"
		},
		"1965": {
			"onlinesim.ru": "1965"
		},
		"like4u": {
			"onlinesim.ru": "like4u"
		},
		"www.reso.ru": {
			"onlinesim.ru": "www_reso_ru"
		},
		"SOGAZ": {
			"onlinesim.ru": "sogaz"
		},
		"RabotaVGor": {
			"onlinesim.ru": "rabotavgor"
		},
		"vkserfing": {
			"onlinesim.ru": "vkserfing"
		},
		"Yaplakal": {
			"onlinesim.ru": "yaplakal"
		},
		"QIP": {
			"onlinesim.ru": "qip",
			"sms-acktiwator.ru": "26"
		},
		"Loveplanet": {
			"onlinesim.ru": "loveplanet",
			"sms-acktiwator.ru": "36"
		},
		"Rutaxi.ru": {
			"onlinesim.ru": "rutaxi_ru"
		},
		"ULMART": {
			"onlinesim.ru": "ulmart"
		},
		"securegroup": {
			"onlinesim.ru": "securegroup"
		},
		"Topface": {
			"onlinesim.ru": "topface"
		},
		"AlfaStrah": {
			"onlinesim.ru": "alfastrah"
		},
		"Workle": {
			"onlinesim.ru": "workle"
		},
		"Nexmo": {
			"onlinesim.ru": "nexmo"
		},
		"Wheely": {
			"onlinesim.ru": "wheely"
		},
		"HookM": {
			"onlinesim.ru": "hookm"
		},
		"6996": {
			"onlinesim.ru": "6996"
		},
		"FreelanceRu": {
			"onlinesim.ru": "freelanceru"
		},
		"ihorru": {
			"onlinesim.ru": "ihorru"
		},
		"Taxi2412.ru": {
			"onlinesim.ru": "taxi2412_ru"
		},
		"SMSNotify": {
			"onlinesim.ru": "smsnotify"
		},
		"YaDlyaVas": {
			"onlinesim.ru": "yadlyavas"
		},
		"BEBOO": {
			"onlinesim.ru": "beboo"
		},
		"BIGLION": {
			"onlinesim.ru": "biglion"
		},
		"рса": {
			"onlinesim.ru": "pca"
		},
		"av100.ru": {
			"onlinesim.ru": "av100_ru"
		},
		"Rus-Telecom": {
			"onlinesim.ru": "rus-telecom"
		},
		"Code": {
			"onlinesim.ru": "code"
		},
		"Maxim.": {
			"onlinesim.ru": "maxim_"
		},
		"MTService": {
			"onlinesim.ru": "mtservice"
		},
		"100641": {
			"onlinesim.ru": "100641"
		},
		"Usend": {
			"onlinesim.ru": "usend"
		},
		"PetrI": {
			"onlinesim.ru": "petri"
		},
		"SMSCRU": {
			"onlinesim.ru": "smscru"
		},
		"Tiu.ru": {
			"onlinesim.ru": "tiu_ru"
		},
		"2838": {
			"onlinesim.ru": "2838"
		},
		"DTINFO": {
			"onlinesim.ru": "dtinfo"
		},
		"WMRFast": {
			"onlinesim.ru": "wmrfast"
		},
		"Gem4me": {
			"onlinesim.ru": "gem4me",
			"sms-acktiwator.ru": "48"
		},
		"ProDoctorov": {
			"onlinesim.ru": "prodoctorov",
			"sms-acktiwator.ru": "64"
		},
		"DIT_EMP": {
			"onlinesim.ru": "dit_emp"
		},
		"KFC": {
			"onlinesim.ru": "kfc"
		},
		"taborru": {
			"onlinesim.ru": "taborru"
		},
		"Advance-RP": {
			"onlinesim.ru": "advance-rp"
		},
		"SMEXPRESS": {
			"onlinesim.ru": "smexpress"
		},
		"MediaMarkt": {
			"onlinesim.ru": "mediamarkt"
		},
		"OTTService": {
			"onlinesim.ru": "ottservice"
		},
		"Glamour": {
			"onlinesim.ru": "glamour"
		},
		"Navigator": {
			"onlinesim.ru": "navigator"
		},
		"CIAN.RU": {
			"onlinesim.ru": "cian_ru"
		},
		"MESSAGE": {
			"onlinesim.ru": "message"
		},
		"5296": {
			"onlinesim.ru": "5296"
		},
		"FISHKA_KFC": {
			"onlinesim.ru": "fishka_kfc"
		},
		"IRR.RU": {
			"onlinesim.ru": "irr_ru"
		},
		"NSMS": {
			"onlinesim.ru": "nsms"
		},
		"GoAppCash": {
			"onlinesim.ru": "goappcash"
		},
		"AUTHMSG": {
			"onlinesim.ru": "authmsg"
		},
		"Spaces.ru": {
			"onlinesim.ru": "spaces_ru"
		},
		"Camel": {
			"onlinesim.ru": "camel"
		},
		"GroupPrice": {
			"onlinesim.ru": "groupprice"
		},
		"ELDORADO": {
			"onlinesim.ru": "eldorado",
			"sms-acktiwator.ru": "162"
		},
		"Consultant": {
			"onlinesim.ru": "consultant"
		},
		"wwwdom2ru": {
			"onlinesim.ru": "wwwdom2ru"
		},
		"PechkaYktRu": {
			"onlinesim.ru": "pechkayktru"
		},
		"Ollis": {
			"onlinesim.ru": "ollis"
		},
		"DDirect_log": {
			"onlinesim.ru": "ddirect_log"
		},
		"VIRTA": {
			"onlinesim.ru": "virta"
		},
		"MS_Verify": {
			"onlinesim.ru": "ms_verify"
		},
		"InternetSMS": {
			"onlinesim.ru": "internetsms"
		},
		"Spacesru": {
			"onlinesim.ru": "spacesru"
		},
		"BILLmanager": {
			"onlinesim.ru": "billmanager"
		},
		"notify": {
			"onlinesim.ru": "notify"
		},
		"awmproxy": {
			"onlinesim.ru": "awmproxy"
		},
		"TelecomInfo": {
			"onlinesim.ru": "telecominfo"
		},
		"KonturFocus": {
			"onlinesim.ru": "konturfocus"
		},
		"FarPost": {
			"onlinesim.ru": "farpost",
			"sms-acktiwator.ru": "124",
			"vak-sms.com": "fp"
		},
		"teleservice": {
			"onlinesim.ru": "teleservice"
		},
		"WORKZILLA": {
			"onlinesim.ru": "workzilla"
		},
		"PLIVO": {
			"onlinesim.ru": "plivo"
		},
		"2domains": {
			"onlinesim.ru": "2domains"
		},
		"ACTION-MCFR": {
			"onlinesim.ru": "action-mcfr"
		},
		"7764": {
			"onlinesim.ru": "7764"
		},
		"FEBO": {
			"onlinesim.ru": "febo"
		},
		"SMSService": {
			"onlinesim.ru": "smsservice"
		},
		"SMC": {
			"onlinesim.ru": "smc"
		},
		"itunes": {
			"onlinesim.ru": "itunes"
		},
		"Transfer": {
			"onlinesim.ru": "transfer"
		},
		"1gl": {
			"onlinesim.ru": "1gl"
		},
		"mirznkomstv": {
			"onlinesim.ru": "mirznkomstv"
		},
		"ABC_Center": {
			"onlinesim.ru": "abc_center"
		},
		"MCA": {
			"onlinesim.ru": "mca"
		},
		"FirstVDS": {
			"onlinesim.ru": "firstvds"
		},
		"NCC-SMS": {
			"onlinesim.ru": "ncc-sms"
		},
		"chatvdvoem": {
			"onlinesim.ru": "chatvdvoem"
		},
		"More": {
			"onlinesim.ru": "more"
		},
		"taxify": {
			"onlinesim.ru": "taxify",
			"sms-acktiwator.ru": "69"
		},
		"STERH": {
			"onlinesim.ru": "sterh"
		},
		"Mediatech": {
			"onlinesim.ru": "mediatech"
		},
		"AdvertApp": {
			"onlinesim.ru": "advertapp",
			"sms-acktiwator.ru": "87"
		},
		"EUROINS": {
			"onlinesim.ru": "euroins"
		},
		"Golos25": {
			"onlinesim.ru": "golos25"
		},
		"Weblancer": {
			"onlinesim.ru": "weblancer"
		},
		"MirTesen": {
			"onlinesim.ru": "mirtesen"
		},
		"hostinger": {
			"onlinesim.ru": "hostinger"
		},
		"MZReal": {
			"onlinesim.ru": "mzreal"
		},
		"TAXI777": {
			"onlinesim.ru": "taxi777"
		},
		"WS-MESSAGE": {
			"onlinesim.ru": "ws-message"
		},
		"TS_verify": {
			"onlinesim.ru": "ts_verify"
		},
		"Timeweb": {
			"onlinesim.ru": "timeweb"
		},
		"McHost": {
			"onlinesim.ru": "mchost"
		},
		"REG.RU": {
			"onlinesim.ru": "reg_ru"
		},
		"AtomPark": {
			"onlinesim.ru": "atompark"
		},
		"ihc.ru": {
			"onlinesim.ru": "wwwihcru",
			"sms-acktiwator.ru": "135"
		},
		"Teamo.ru": {
			"onlinesim.ru": "teamo_ru"
		},
		"Sprinthost": {
			"onlinesim.ru": "sprinthost",
			"sms-acktiwator.ru": "79"
		},
		"ForexTrend": {
			"onlinesim.ru": "forextrend"
		},
		"admiral-xxx": {
			"onlinesim.ru": "admiral-xxx"
		},
		"FASTEN": {
			"onlinesim.ru": "fasten"
		},
		"MCHS_112": {
			"onlinesim.ru": "mchs_112"
		},
		"100640": {
			"onlinesim.ru": "100640"
		},
		"Banki.ru": {
			"onlinesim.ru": "banki_ru"
		},
		"Rostelecom": {
			"onlinesim.ru": "rostelecom"
		},
		"internet": {
			"onlinesim.ru": "internet"
		},
		"PersOffice": {
			"onlinesim.ru": "persoffice"
		},
		"FORUMHOUSE": {
			"onlinesim.ru": "forumhouse"
		},
		"Rutaxiru": {
			"onlinesim.ru": "rutaxiru"
		},
		"MC.KHL.RU": {
			"onlinesim.ru": "mc_khl_ru"
		},
		"VULKAN.OR": {
			"onlinesim.ru": "vulkan_or"
		},
		"ramblermail": {
			"onlinesim.ru": "ramblermail"
		},
		"isms": {
			"onlinesim.ru": "isms"
		},
		"ATinbox": {
			"onlinesim.ru": "atinbox"
		},
		"ClientMedia": {
			"onlinesim.ru": "clientmedia"
		},
		"Cenoboy": {
			"onlinesim.ru": "cenoboy"
		},
		"AGAVA": {
			"onlinesim.ru": "agava"
		},
		"EKSMO": {
			"onlinesim.ru": "eksmo"
		},
		"webhost1": {
			"onlinesim.ru": "webhost1"
		},
		"ad1": {
			"onlinesim.ru": "ad1"
		},
		"Zenit": {
			"onlinesim.ru": "zenit"
		},
		"100642": {
			"onlinesim.ru": "100642"
		},
		"Zetta": {
			"onlinesim.ru": "zetta"
		},
		"BAT_Info": {
			"onlinesim.ru": "bat_info"
		},
		"Sravni.ru": {
			"onlinesim.ru": "sravni_ru"
		},
		"dwar.ru": {
			"onlinesim.ru": "dwar_ru"
		},
		"ugoria": {
			"onlinesim.ru": "ugoria"
		},
		"chatroulete": {
			"onlinesim.ru": "chatroulete"
		},
		"SPAR": {
			"onlinesim.ru": "spar"
		},
		"FRENDI": {
			"onlinesim.ru": "frendi"
		},
		"gamekit": {
			"onlinesim.ru": "gamekit"
		},
		"PizzaHut": {
			"onlinesim.ru": "pizzahut"
		},
		"DNS-SHOP": {
			"onlinesim.ru": "dns-shop"
		},
		"Jino": {
			"onlinesim.ru": "jino"
		},
		"CoinsUp": {
			"onlinesim.ru": "coinsup"
		},
		"679": {
			"onlinesim.ru": "679"
		},
		"Mevius": {
			"onlinesim.ru": "mevius"
		},
		"CloudLite": {
			"onlinesim.ru": "cloudlite"
		},
		"NETGAME": {
			"onlinesim.ru": "netgame"
		},
		"2keys": {
			"onlinesim.ru": "2keys"
		},
		"AKBARS": {
			"onlinesim.ru": "akbars",
			"sms-acktiwator.ru": "113"
		},
		"TAXI": {
			"onlinesim.ru": "taxi"
		},
		"SERVICE": {
			"onlinesim.ru": "service"
		},
		"JTI": {
			"onlinesim.ru": "jti"
		},
		"VernaGroup": {
			"onlinesim.ru": "vernagroup"
		},
		"IITrust": {
			"onlinesim.ru": "iitrust"
		},
		"Vscale": {
			"onlinesim.ru": "vscale"
		},
		"1jur": {
			"onlinesim.ru": "1jur"
		},
		"CLUB-LUKOIL": {
			"onlinesim.ru": "club-lukoil"
		},
		"SendPulse": {
			"onlinesim.ru": "sendpulse"
		},
		"NOTICE": {
			"onlinesim.ru": "notice"
		},
		"renins.com": {
			"onlinesim.ru": "renins_com"
		},
		"NAVERLINE": {
			"onlinesim.ru": "naverline"
		},
		"svyaznoy": {
			"onlinesim.ru": "svyaznoy"
		},
		"VULKANOR": {
			"onlinesim.ru": "vulkanor"
		},
		"Phone_Code": {
			"onlinesim.ru": "phone_code"
		},
		"Nethouse": {
			"onlinesim.ru": "nethouse"
		},
		"notify_fb": {
			"onlinesim.ru": "notify_fb"
		},
		"Garant": {
			"onlinesim.ru": "garant"
		},
		"Утконос": {
			"onlinesim.ru": "utkonos"
		},
		"Freelance": {
			"onlinesim.ru": "freelance"
		},
		"admitad": {
			"onlinesim.ru": "admitad"
		},
		"100601": {
			"onlinesim.ru": "100601"
		},
		"Sobranie": {
			"onlinesim.ru": "sobranie"
		},
		"SMSINFORM": {
			"onlinesim.ru": "smsinform"
		},
		"Binomo": {
			"onlinesim.ru": "binomo"
		},
		"FINAM": {
			"onlinesim.ru": "finam"
		},
		"Real": {
			"onlinesim.ru": "real"
		},
		"instaforex": {
			"onlinesim.ru": "instaforex"
		},
		"Atlas-2": {
			"onlinesim.ru": "atlas-2"
		},
		"THT-CLUB": {
			"onlinesim.ru": "tht-club"
		},
		"Russianpost": {
			"onlinesim.ru": "russianpost"
		},
		"QGUYS": {
			"onlinesim.ru": "qguys"
		},
		"Matbeacom": {
			"onlinesim.ru": "matbeacom"
		},
		"RouteePin": {
			"onlinesim.ru": "routeepin"
		},
		"DOTT": {
			"onlinesim.ru": "dott"
		},
		"2320": {
			"onlinesim.ru": "2320"
		},
		"SLOTOKING": {
			"onlinesim.ru": "slotoking"
		},
		"Ticketland": {
			"onlinesim.ru": "ticketland"
		},
		"Shikari": {
			"onlinesim.ru": "shikari"
		},
		"eTXTru": {
			"onlinesim.ru": "etxtru"
		},
		"Zolushka": {
			"onlinesim.ru": "zolushka"
		},
		"NIVEAMEN": {
			"onlinesim.ru": "niveamen"
		},
		"sony": {
			"onlinesim.ru": "sony"
		},
		"PMSM": {
			"onlinesim.ru": "pmsm",
			"sms-acktiwator.ru": "53"
		},
		"e1.ru": {
			"onlinesim.ru": "e1_ru"
		},
		"UBU": {
			"onlinesim.ru": "ubu"
		},
		"Proverka": {
			"onlinesim.ru": "proverka"
		},
		"Hostline": {
			"onlinesim.ru": "hostline"
		},
		"ngs.ru": {
			"onlinesim.ru": "ngs_ru"
		},
		"Equifax": {
			"onlinesim.ru": "equifax"
		},
		"Doctor": {
			"onlinesim.ru": "doctor"
		},
		"Rusinfo": {
			"onlinesim.ru": "rusinfo"
		},
		"QQTube": {
			"onlinesim.ru": "qqtube"
		},
		"8080": {
			"onlinesim.ru": "8080"
		},
		"Secure_STMS": {
			"onlinesim.ru": "secure_stms"
		},
		"TAXI434343": {
			"onlinesim.ru": "taxi434343"
		},
		"0674": {
			"onlinesim.ru": "0674"
		},
		"RusTelecom": {
			"onlinesim.ru": "rustelecom"
		},
		"VPSua": {
			"onlinesim.ru": "vpsua"
		},
		"AVTO-PROFFI": {
			"onlinesim.ru": "avto-proffi"
		},
		"BIGD.HOST": {
			"onlinesim.ru": "bigd_host"
		},
		"SurfEarner": {
			"onlinesim.ru": "surfearner"
		},
		"ISNEXT.RU": {
			"onlinesim.ru": "isnext_ru"
		},
		"WWW.IHC.RU": {
			"onlinesim.ru": "www_ihc_ru"
		},
		"Otzovik": {
			"onlinesim.ru": "otzovik"
		},
		"SmartApe": {
			"onlinesim.ru": "smartape"
		},
		"HGCLUB.RU": {
			"onlinesim.ru": "hgclub_ru"
		},
		"InfoER": {
			"onlinesim.ru": "infoer"
		},
		"GameNet": {
			"onlinesim.ru": "gamenet"
		},
		"DIAMOND_RP": {
			"onlinesim.ru": "diamond_rp"
		},
		"Taxi2412ru": {
			"onlinesim.ru": "taxi2412ru"
		},
		"3339": {
			"onlinesim.ru": "3339"
		},
		"PROMODJ": {
			"onlinesim.ru": "promodj"
		},
		"INFASEM": {
			"onlinesim.ru": "infasem"
		},
		"SlotV": {
			"onlinesim.ru": "slotv"
		},
		"AzbukaVkusa": {
			"onlinesim.ru": "azbukavkusa"
		},
		"FL.ru": {
			"onlinesim.ru": "fl_ru"
		},
		"likestru": {
			"onlinesim.ru": "likestru"
		},
		"CarPrice.ru": {
			"onlinesim.ru": "carprice_ru"
		},
		"ImpulsTV": {
			"onlinesim.ru": "impulstv"
		},
		"GSK_UGORIA": {
			"onlinesim.ru": "gsk_ugoria"
		},
		".Maxim.": {
			"onlinesim.ru": "_maxim_"
		},
		"Taxi-Inform": {
			"onlinesim.ru": "taxi-inform"
		},
		"e-garant": {
			"onlinesim.ru": "e-garant"
		},
		"MTT": {
			"onlinesim.ru": "mtt"
		},
		"feedgee": {
			"onlinesim.ru": "feedgee"
		},
		"TestDrive": {
			"onlinesim.ru": "testdrive"
		},
		"frelanchunt": {
			"onlinesim.ru": "frelanchunt"
		},
		"Starbucks": {
			"onlinesim.ru": "starbucks"
		},
		"ValveVerify": {
			"onlinesim.ru": "valveverify"
		},
		"BKAPMAHE": {
			"onlinesim.ru": "bkapmahe"
		},
		"CITILINK": {
			"onlinesim.ru": "citilink"
		},
		"Frank": {
			"onlinesim.ru": "frank"
		},
		"RGS": {
			"onlinesim.ru": "rgs"
		},
		"ProtonSMS": {
			"onlinesim.ru": "protonsms"
		},
		"Casebook.ru": {
			"onlinesim.ru": "casebook_ru"
		},
		"SK_Chulpan": {
			"onlinesim.ru": "sk_chulpan"
		},
		"informer": {
			"onlinesim.ru": "informer"
		},
		"INFOTEXT": {
			"onlinesim.ru": "infotext"
		},
		"TeleTrade": {
			"onlinesim.ru": "teletrade"
		},
		"firstbyte": {
			"onlinesim.ru": "firstbyte"
		},
		"MEDIASERVIS": {
			"onlinesim.ru": "mediaservis"
		},
		"Gelios": {
			"onlinesim.ru": "gelios"
		},
		"AVTOPROFFI": {
			"onlinesim.ru": "avtoproffi"
		},
		"menimobi": {
			"onlinesim.ru": "menimobi"
		},
		"Interfax": {
			"onlinesim.ru": "interfax"
		},
		"appflow": {
			"onlinesim.ru": "appflow"
		},
		"REGRU": {
			"onlinesim.ru": "regru"
		},
		"Ringcaptcha": {
			"onlinesim.ru": "ringcaptcha"
		},
		"Taxik": {
			"onlinesim.ru": "taxik"
		},
		"Author24": {
			"onlinesim.ru": "author24"
		},
		"ZOON.RU": {
			"onlinesim.ru": "zoon_ru"
		},
		"Azino888": {
			"onlinesim.ru": "azino888"
		},
		"OOOPSA": {
			"onlinesim.ru": "ooopsa"
		},
		"TaxSee": {
			"onlinesim.ru": "taxsee"
		},
		"Frim": {
			"onlinesim.ru": "frim"
		},
		"Drive2": {
			"onlinesim.ru": "drive2_ru",
			"vak-sms.com": "de"
		},
		"Komandir": {
			"onlinesim.ru": "komandir"
		},
		"glasnru": {
			"onlinesim.ru": "glasnru"
		},
		"RINGCV": {
			"onlinesim.ru": "ringcv"
		},
		"TheHost": {
			"onlinesim.ru": "thehost"
		},
		"SalesProces": {
			"onlinesim.ru": "salesproces"
		},
		"LiveStatus": {
			"onlinesim.ru": "livestatus"
		},
		"EPA": {
			"onlinesim.ru": "epa"
		},
		"STEEM": {
			"onlinesim.ru": "steem"
		},
		"AKVAMARIN": {
			"onlinesim.ru": "akvamarin"
		},
		"Vashgolos": {
			"onlinesim.ru": "vashgolos"
		},
		"HOSTING": {
			"onlinesim.ru": "hosting"
		},
		"Action": {
			"onlinesim.ru": "action"
		},
		"MakeMyBet": {
			"onlinesim.ru": "makemybet"
		},
		"PrivateFX": {
			"onlinesim.ru": "privatefx"
		},
		"OPTIMARED": {
			"onlinesim.ru": "optimared"
		},
		"DANYCC": {
			"onlinesim.ru": "danycc"
		},
		"Foodfox": {
			"onlinesim.ru": "foodfox"
		},
		"100643": {
			"onlinesim.ru": "100643"
		},
		"MARLBORO": {
			"onlinesim.ru": "marlboro"
		},
		"XOCKA": {
			"onlinesim.ru": "xocka"
		},
		"Tiuru": {
			"onlinesim.ru": "tiuru"
		},
		"Revo": {
			"onlinesim.ru": "revo"
		},
		"GEM": {
			"onlinesim.ru": "gem"
		},
		"ProstoR": {
			"onlinesim.ru": "prostor"
		},
		"Minitax.ru": {
			"onlinesim.ru": "minitax_ru"
		},
		"MOAB": {
			"onlinesim.ru": "moab"
		},
		"Proberry": {
			"onlinesim.ru": "proberry"
		},
		"PlatformOFD": {
			"onlinesim.ru": "platformofd"
		},
		"LogIn": {
			"onlinesim.ru": "login"
		},
		"GROUPON": {
			"onlinesim.ru": "groupon"
		},
		"nlstar.com": {
			"onlinesim.ru": "nlstar_com"
		},
		"100602": {
			"onlinesim.ru": "100602"
		},
		"Exist.RU": {
			"onlinesim.ru": "exist_ru"
		},
		"ITIL_Armeec": {
			"onlinesim.ru": "itil_armeec"
		},
		"EuroHoster": {
			"onlinesim.ru": "eurohoster"
		},
		"Aeroflot": {
			"onlinesim.ru": "aeroflot"
		},
		"YouMagic": {
			"onlinesim.ru": "youmagic"
		},
		"EtoDlyaVas": {
			"onlinesim.ru": "etodlyavas"
		},
		"riotech": {
			"onlinesim.ru": "riotech"
		},
		"ABSOLUTINS": {
			"onlinesim.ru": "absolutins"
		},
		"ERGO": {
			"onlinesim.ru": "ergo"
		},
		"ServerDale": {
			"onlinesim.ru": "serverdale"
		},
		"FastProm": {
			"onlinesim.ru": "fastprom"
		},
		"CardsMobile": {
			"onlinesim.ru": "cardsmobile"
		},
		"RedStar": {
			"onlinesim.ru": "redstar"
		},
		"boi.pass": {
			"onlinesim.ru": "boi_pass"
		},
		"Balance": {
			"onlinesim.ru": "balance"
		},
		"PremiaRu": {
			"onlinesim.ru": "premiaru"
		},
		"STU": {
			"onlinesim.ru": "stu"
		},
		"clubrs": {
			"onlinesim.ru": "clubrs"
		},
		"RUSONYX": {
			"onlinesim.ru": "rusonyx"
		},
		"4938": {
			"onlinesim.ru": "4938"
		},
		"open_i": {
			"onlinesim.ru": "open_i"
		},
		"MGER": {
			"onlinesim.ru": "mger"
		},
		"Poehali": {
			"onlinesim.ru": "poehali"
		},
		"OPORA_SK": {
			"onlinesim.ru": "opora_sk"
		},
		"DIT_InfoSMS": {
			"onlinesim.ru": "dit_infosms"
		},
		"RELEVATERU": {
			"onlinesim.ru": "relevateru"
		},
		"mainbox.com": {
			"onlinesim.ru": "mainbox_com"
		},
		"9230": {
			"onlinesim.ru": "9230"
		},
		"Qsms": {
			"onlinesim.ru": "qsms"
		},
		"1950": {
			"onlinesim.ru": "1950"
		},
		"enforta": {
			"onlinesim.ru": "enforta"
		},
		"MediaGramma": {
			"onlinesim.ru": "mediagramma"
		},
		"VERA": {
			"onlinesim.ru": "vera"
		},
		"Rusalgrants": {
			"onlinesim.ru": "rusalgrants"
		},
		"Media_Tele": {
			"onlinesim.ru": "media_tele"
		},
		"Clientogram": {
			"onlinesim.ru": "clientogram"
		},
		"VAMSMS": {
			"onlinesim.ru": "vamsms"
		},
		"iNEWS": {
			"onlinesim.ru": "inews"
		},
		"umama": {
			"onlinesim.ru": "umama"
		},
		"Plazius": {
			"onlinesim.ru": "plazius"
		},
		"AKI": {
			"onlinesim.ru": "aki"
		},
		"fhunt": {
			"onlinesim.ru": "fhunt"
		},
		"PROFI.RU": {
			"onlinesim.ru": "profi_ru"
		},
		".DS.": {
			"onlinesim.ru": "_ds_"
		},
		"OTP": {
			"onlinesim.ru": "otp"
		},
		"M1service": {
			"onlinesim.ru": "m1service"
		},
		"OTP_tlsgn": {
			"onlinesim.ru": "otp_tlsgn"
		},
		"OTPSMS": {
			"onlinesim.ru": "otpsms"
		},
		"Ptester": {
			"onlinesim.ru": "ptester"
		},
		"MCHS": {
			"onlinesim.ru": "mchs"
		},
		"Investing": {
			"onlinesim.ru": "investing"
		},
		"olymptrade": {
			"onlinesim.ru": "olymptrade"
		},
		"Onlinetrade": {
			"onlinesim.ru": "onlinetrade"
		},
		"MediaCenter": {
			"onlinesim.ru": "mediacenter"
		},
		"slot78": {
			"onlinesim.ru": "slot78"
		},
		"SHCLWH": {
			"onlinesim.ru": "shclwh"
		},
		"Selectel": {
			"onlinesim.ru": "selectel"
		},
		"VPlatinum": {
			"onlinesim.ru": "vplatinum"
		},
		"didgital-gc": {
			"onlinesim.ru": "didgital-gc"
		},
		"apteka.ru": {
			"onlinesim.ru": "apteka_ru"
		},
		"site": {
			"onlinesim.ru": "site"
		},
		"Smart.Space": {
			"onlinesim.ru": "smart_space"
		},
		"crushball": {
			"onlinesim.ru": "crushball"
		},
		"parimatchru": {
			"onlinesim.ru": "parimatchru"
		},
		"sob.ru": {
			"onlinesim.ru": "sob_ru"
		},
		"iatsms": {
			"onlinesim.ru": "iatsms"
		},
		"fixmobile": {
			"onlinesim.ru": "fixmobile"
		},
		"nxverify": {
			"onlinesim.ru": "nxverify"
		},
		"mostbet.com": {
			"onlinesim.ru": "mostbet_com"
		},
		"belkacar": {
			"onlinesim.ru": "belkacar"
		},
		"taovip": {
			"onlinesim.ru": "taovip"
		},
		"matbea.com": {
			"onlinesim.ru": "matbea_com"
		},
		"authentify": {
			"onlinesim.ru": "authentify"
		},
		"pass.media": {
			"onlinesim.ru": "pass_media"
		},
		"4767": {
			"onlinesim.ru": "4767"
		},
		"qcloud": {
			"onlinesim.ru": "qcloud"
		},
		"digital": {
			"onlinesim.ru": "digital"
		},
		"renins.ru": {
			"onlinesim.ru": "renins_ru"
		},
		"7522": {
			"onlinesim.ru": "7522"
		},
		"acko": {
			"onlinesim.ru": "acko"
		},
		"znakomstva": {
			"onlinesim.ru": "znakomstva"
		},
		"melbet": {
			"onlinesim.ru": "melbet"
		},
		"letoile": {
			"onlinesim.ru": "letoile"
		},
		"ligastavok": {
			"onlinesim.ru": "ligastavok"
		},
		"parimatch": {
			"onlinesim.ru": "parimatch",
			"sms-acktiwator.ru": "181"
		},
		"vrussia": {
			"onlinesim.ru": "vrussia"
		},
		"aptotsklada": {
			"onlinesim.ru": "aptotsklada"
		},
		"udg": {
			"onlinesim.ru": "udg"
		},
		"freelansim": {
			"onlinesim.ru": "freelansim"
		},
		"liga.pro": {
			"onlinesim.ru": "liga_pro"
		},
		"alyans_pin": {
			"onlinesim.ru": "alyans_pin"
		},
		"msgbrd": {
			"onlinesim.ru": "msgbrd"
		},
		"libertyinfo": {
			"onlinesim.ru": "libertyinfo"
		},
		"picasso": {
			"onlinesim.ru": "picasso"
		},
		"armeec": {
			"onlinesim.ru": "armeec"
		},
		"twitch": {
			"onlinesim.ru": "twitch"
		},
		"signalapp": {
			"onlinesim.ru": "signalapp"
		},
		"olimp.bet": {
			"onlinesim.ru": "olimp_bet"
		},
		"sfurf.ru": {
			"onlinesim.ru": "sfurf_ru"
		},
		"uniqlo": {
			"onlinesim.ru": "uniqlo"
		},
		"socialcraft": {
			"onlinesim.ru": "socialcraft"
		},
		"kackad": {
			"onlinesim.ru": "kackad"
		},
		"wifire": {
			"onlinesim.ru": "wifire"
		},
		"doctu.ru": {
			"onlinesim.ru": "doctu_ru"
		},
		"Studwork": {
			"onlinesim.ru": "studwork",
			"sms-acktiwator.ru": "136"
		},
		"ya888ya": {
			"onlinesim.ru": "ya888ya"
		},
		"list": {
			"onlinesim.ru": "list"
		},
		"sonline": {
			"onlinesim.ru": "sonline"
		},
		"smotreshka": {
			"onlinesim.ru": "smotreshka"
		},
		"eapteka": {
			"onlinesim.ru": "eapteka"
		},
		"1399": {
			"onlinesim.ru": "1399"
		},
		"smsforall": {
			"onlinesim.ru": "smsforall"
		},
		"gusli": {
			"onlinesim.ru": "gusli"
		},
		"officehq": {
			"onlinesim.ru": "officehq"
		},
		"sistema": {
			"onlinesim.ru": "sistema"
		},
		"myglo": {
			"onlinesim.ru": "myglo"
		},
		"sberfood": {
			"onlinesim.ru": "sberfood"
		},
		"kwork": {
			"onlinesim.ru": "kwork"
		},
		"ips": {
			"onlinesim.ru": "ips"
		},
		"kartavkusa": {
			"onlinesim.ru": "kartavkusa"
		},
		"netpeaksoft": {
			"onlinesim.ru": "netpeaksoft"
		},
		"rgs.ru": {
			"onlinesim.ru": "rgs_ru"
		},
		"lamoda": {
			"onlinesim.ru": "lamoda"
		},
		"24h.tv": {
			"onlinesim.ru": "24h_tv"
		},
		"sushimarket": {
			"onlinesim.ru": "sushimarket"
		},
		"superbro": {
			"onlinesim.ru": "superbro"
		},
		"tatinet.ru": {
			"onlinesim.ru": "tatinet_ru"
		},
		"fastvps": {
			"onlinesim.ru": "fastvps"
		},
		"mylove.ru": {
			"onlinesim.ru": "mylove_ru"
		},
		"kkt.nalog": {
			"onlinesim.ru": "kkt_nalog"
		},
		"youdrive": {
			"onlinesim.ru": "youdrive"
		},
		"ikeafamily": {
			"onlinesim.ru": "ikeafamily"
		},
		"taptaxi": {
			"onlinesim.ru": "taptaxi"
		},
		"serpstat": {
			"onlinesim.ru": "serpstat"
		},
		"alpari": {
			"onlinesim.ru": "alpari"
		},
		"delimobil": {
			"onlinesim.ru": "delimobil"
		},
		"riobet": {
			"onlinesim.ru": "riobet"
		},
		"finspin": {
			"onlinesim.ru": "finspin"
		},
		"limetaxi": {
			"onlinesim.ru": "limetaxi"
		},
		"openbroker": {
			"onlinesim.ru": "openbroker"
		},
		"appcode": {
			"onlinesim.ru": "appcode"
		},
		"propellerad": {
			"onlinesim.ru": "propellerad"
		},
		"glavfinans": {
			"onlinesim.ru": "glavfinans"
		},
		"1cloud": {
			"onlinesim.ru": "1cloud"
		},
		"aviso": {
			"onlinesim.ru": "aviso"
		},
		"tilda": {
			"onlinesim.ru": "tilda"
		},
		"letyshops": {
			"onlinesim.ru": "letyshops"
		},
		"vprognoze": {
			"onlinesim.ru": "vprognoze"
		},
		"startline": {
			"onlinesim.ru": "startline"
		},
		"centrsoobsh": {
			"onlinesim.ru": "centrsoobsh"
		},
		"smsverify": {
			"onlinesim.ru": "smsverify"
		},
		"sessupport": {
			"onlinesim.ru": "sessupport"
		},
		"done_media": {
			"onlinesim.ru": "done_media"
		},
		"megogo": {
			"onlinesim.ru": "megogo"
		},
		"mottor": {
			"onlinesim.ru": "mottor"
		},
		"bytedance": {
			"onlinesim.ru": "bytedance"
		},
		"smsaero.ru": {
			"onlinesim.ru": "smsaero_ru"
		},
		"ao_ock": {
			"onlinesim.ru": "ao_ock"
		},
		"adm.tools": {
			"onlinesim.ru": "adm_tools"
		},
		"5115": {
			"onlinesim.ru": "5115"
		},
		"pechkaykt": {
			"onlinesim.ru": "pechkaykt"
		},
		"epochtasms": {
			"onlinesim.ru": "epochtasms"
		},
		"bcs": {
			"onlinesim.ru": "bcs"
		},
		"888.ru": {
			"onlinesim.ru": "888.ru"
		},
		"2-berega": {
			"onlinesim.ru": "2-berega"
		},
		"seldon": {
			"onlinesim.ru": "seldon"
		},
		"docdoc": {
			"onlinesim.ru": "docdoc"
		},
		"mmt": {
			"onlinesim.ru": "mmt"
		},
		"getcourse": {
			"onlinesim.ru": "getcourse"
		},
		"pinsms": {
			"onlinesim.ru": "pinsms"
		},
		"superjob": {
			"onlinesim.ru": "superjob"
		},
		"adonis": {
			"onlinesim.ru": "adonis"
		},
		"sutochno.ru": {
			"onlinesim.ru": "sutochno_ru"
		},
		"avtor24": {
			"onlinesim.ru": "avtor24"
		},
		"cis": {
			"onlinesim.ru": "cis"
		},
		"flowwow.com": {
			"onlinesim.ru": "flowwow_com"
		},
		"unit": {
			"onlinesim.ru": "unit"
		},
		"yango": {
			"onlinesim.ru": "yango"
		},
		"pmgroup": {
			"onlinesim.ru": "pmgroup"
		},
		"Getcontact": {
			"onlinesim.ru": "getcontact",
			"vak-sms.com": "gt"
		},
		"roboforex": {
			"onlinesim.ru": "roboforex"
		},
		"okcoin": {
			"onlinesim.ru": "okcoin"
		},
		"gpnbonus.ru": {
			"onlinesim.ru": "gpnbonus_ru"
		},
		"detskiymir": {
			"onlinesim.ru": "detskiymir"
		},
		"hunter": {
			"onlinesim.ru": "hunter"
		},
		"brandshop": {
			"onlinesim.ru": "brandshop"
		},
		"mts.invest": {
			"onlinesim.ru": "mts_invest"
		},
		"sms_aero": {
			"onlinesim.ru": "sms_aero"
		},
		"nextmobile": {
			"onlinesim.ru": "nextmobile"
		},
		"taxcom": {
			"onlinesim.ru": "taxcom"
		},
		"bigo": {
			"onlinesim.ru": "bigo"
		},
		"amway": {
			"onlinesim.ru": "amway"
		},
		"otus": {
			"onlinesim.ru": "otus"
		},
		"sonetl": {
			"onlinesim.ru": "sonetl"
		},
		"hh.ru": {
			"onlinesim.ru": "hh_ru"
		},
		"24open.ru": {
			"onlinesim.ru": "24open_ru"
		},
		"like": {
			"onlinesim.ru": "like"
		},
		"8769": {
			"onlinesim.ru": "8769"
		},
		"love.ru": {
			"onlinesim.ru": "love_ru"
		},
		"telepizza": {
			"onlinesim.ru": "telepizza"
		},
		"bhteam": {
			"onlinesim.ru": "bhteam"
		},
		"elclub": {
			"onlinesim.ru": "elclub"
		},
		"pd": {
			"onlinesim.ru": "pd"
		},
		"huawei": {
			"onlinesim.ru": "huawei"
		},
		"whoosh": {
			"onlinesim.ru": "whoosh"
		},
		"pickpoint": {
			"onlinesim.ru": "pickpoint"
		},
		"x-project": {
			"onlinesim.ru": "x-project"
		},
		"swissborg": {
			"onlinesim.ru": "swissborg"
		},
		"binotrade": {
			"onlinesim.ru": "binotrade"
		},
		"t-business": {
			"onlinesim.ru": "t-business"
		},
		"urentbike": {
			"onlinesim.ru": "urentbike"
		},
		"esportal": {
			"onlinesim.ru": "esportal"
		},
		"coolclever": {
			"onlinesim.ru": "coolclever"
		},
		"nn-card.ru": {
			"onlinesim.ru": "nn-card_ru"
		},
		"localbit": {
			"onlinesim.ru": "localbit"
		},
		"pd39.ru": {
			"onlinesim.ru": "pd39_ru"
		},
		"foodband.ru": {
			"onlinesim.ru": "foodband_ru"
		},
		"Хмельная миля": {
			"onlinesim.ru": "xmelnay_mily"
		},
		"Kantar": {
			"onlinesim.ru": "kantar"
		},
		"babochka": {
			"onlinesim.ru": "babochka"
		},
		"Eleven": {
			"onlinesim.ru": "eleven"
		},
		"Deal.by": {
			"onlinesim.ru": "deal_by"
		},
		"Guodulink": {
			"onlinesim.ru": "guodulink"
		},
		"Технопоинт": {
			"onlinesim.ru": "technopoint"
		},
		"iGooods.ru": {
			"onlinesim.ru": "igooods_ru"
		},
		"Ankama": {
			"onlinesim.ru": "ankama"
		},
		"METRO": {
			"onlinesim.ru": "metro",
			"vak-sms.com": "eo"
		},
		"CloudFox": {
			"onlinesim.ru": "cloudfox"
		},
		"benzuber": {
			"onlinesim.ru": "benzuber"
		},
		"DeluxePizza": {
			"onlinesim.ru": "deluxepizza"
		},
		"CityPizza": {
			"onlinesim.ru": "citypizza"
		},
		"Sushkof": {
			"onlinesim.ru": "sushkof"
		},
		"888casino.com": {
			"onlinesim.ru": "888casino_com"
		},
		"RESO-MED": {
			"onlinesim.ru": "reso-med"
		},
		"FindClone": {
			"onlinesim.ru": "findclone"
		},
		"Depend": {
			"onlinesim.ru": "depend"
		},
		"DochkiSin": {
			"onlinesim.ru": "dochkisin"
		},
		"RBCN": {
			"onlinesim.ru": "rbcn"
		},
		"teender": {
			"onlinesim.ru": "teender"
		},
		"CHAMPION": {
			"onlinesim.ru": "champion"
		},
		"RBT.ru": {
			"onlinesim.ru": "rbt_ru"
		},
		"lifeair.org": {
			"onlinesim.ru": "lifeair_org"
		},
		"OSTIN": {
			"onlinesim.ru": "ostin"
		},
		"neftm": {
			"onlinesim.ru": "neftm"
		},
		"Defile": {
			"onlinesim.ru": "defile"
		},
		"Meshok.ru": {
			"onlinesim.ru": "meshok_ru"
		},
		"Rukodelie": {
			"onlinesim.ru": "rukodelie"
		},
		"GETIR": {
			"onlinesim.ru": "getir"
		},
		"Bookmate": {
			"onlinesim.ru": "bookmate"
		},
		"NapishemCom": {
			"onlinesim.ru": "napishemcom"
		},
		"Farmlend.ru": {
			"onlinesim.ru": "farmlend_ru "
		},
		"VYGODA": {
			"onlinesim.ru": "vygoda"
		},
		"4lapy": {
			"onlinesim.ru": "4lapy"
		},
		"ALLES Bonus": {
			"onlinesim.ru": "alles_bonus",
			"vak-sms.com": "sb"
		},
		"AZS BNP": {
			"onlinesim.ru": "azsbnp"
		},
		"CrazyCashTV": {
			"onlinesim.ru": "crazycashtv"
		},
		"UralAvia": {
			"onlinesim.ru": "uralavia"
		},
		"MOLNIA": {
			"onlinesim.ru": "molnia"
		},
		"Достаевский": {
			"onlinesim.ru": "dostaevsky"
		},
		"TILine": {
			"onlinesim.ru": "tiline"
		},
		"Discoverglo": {
			"onlinesim.ru": "discoverglo"
		},
		"Nsh-L-Vrach": {
			"onlinesim.ru": "nshlvrach"
		},
		"Switips": {
			"onlinesim.ru": "switips"
		},
		"Доставим": {
			"onlinesim.ru": "dostavim"
		},
		"DDoS-GUARD": {
			"onlinesim.ru": "ddosguard"
		},
		"broniboy": {
			"onlinesim.ru": "broniboy"
		},
		"Bumble": {
			"onlinesim.ru": "bumble"
		},
		"Bethowen": {
			"onlinesim.ru": "bethowen"
		},
		"LEYKA": {
			"onlinesim.ru": "leyka"
		},
		"YAMAGUCHI": {
			"onlinesim.ru": "yamaguchi"
		},
		"BondStreet": {
			"onlinesim.ru": "bondstreet"
		},
		"Lite": {
			"onlinesim.ru": "lite"
		},
		"TNT-PREMIERE": {
			"onlinesim.ru": "tnt-premiere"
		},
		"STAYINTOUCH": {
			"onlinesim.ru": "stayintouch"
		},
		"Dating4you": {
			"onlinesim.ru": "dating4you"
		},
		"PMclub": {
			"onlinesim.ru": "pmclub"
		},
		"5eplay": {
			"onlinesim.ru": "5eplay"
		},
		"OSON": {
			"onlinesim.ru": "oson"
		},
		"TAXI_rus": {
			"onlinesim.ru": "taxi_rus"
		},
		"SaveTime": {
			"onlinesim.ru": "savetime"
		},
		"TaxiNonStop": {
			"onlinesim.ru": "taxinonstop"
		},
		"SOKOLOV": {
			"onlinesim.ru": "sokolov"
		},
		"Petshop": {
			"onlinesim.ru": "petshop"
		},
		"FREEDOM": {
			"onlinesim.ru": "smstraffic"
		},
		"maxi_retail": {
			"onlinesim.ru": "maxi_retail"
		},
		"STOLICHKI": {
			"onlinesim.ru": "stolichki"
		},
		"Dikidi": {
			"onlinesim.ru": "dikidi"
		},
		"grani_moscow": {
			"onlinesim.ru": "grani_moscow"
		},
		"zoopt": {
			"onlinesim.ru": "zoopt"
		},
		"RResearch": {
			"onlinesim.ru": "rresearch"
		},
		"Eldfun": {
			"onlinesim.ru": "eldfun"
		},
		"Almatel": {
			"onlinesim.ru": "almatel"
		},
		"BETCITY": {
			"onlinesim.ru": "betcity"
		},
		"ArenaPlay": {
			"onlinesim.ru": "arenaplay"
		},
		"TOMATO": {
			"onlinesim.ru": "tomato"
		},
		"SMOTRIM": {
			"onlinesim.ru": "smotrim"
		},
		"pomogatel": {
			"onlinesim.ru": "pomogatel"
		},
		"PIRATPIZZA": {
			"onlinesim.ru": "piratpizza"
		},
		"Level Kitchen": {
			"onlinesim.ru": "lvlkitchen"
		},
		"mfood": {
			"onlinesim.ru": "mfood"
		},
		"UmnayaMoyka": {
			"onlinesim.ru": "umnayamoyka"
		},
		"Denim": {
			"onlinesim.ru": "denim"
		},
		"MARKETPLACE": {
			"onlinesim.ru": "marketplace"
		},
		"Pin_up": {
			"onlinesim.ru": "pin_up"
		},
		"Sneakerandstuff": {
			"onlinesim.ru": "sneakerandstuff"
		},
		"Upwork": {
			"onlinesim.ru": "upwork"
		},
		"Passcode": {
			"onlinesim.ru": "passcode"
		},
		"Haraba": {
			"onlinesim.ru": "haraba"
		},
		"BetBoom": {
			"onlinesim.ru": "betboom"
		},
		"Scaleway": {
			"onlinesim.ru": "scaleway"
		},
		"ChopChop": {
			"onlinesim.ru": "chopchop"
		},
		"PolisPrice": {
			"onlinesim.ru": "polisprice"
		},
		"GoGo": {
			"onlinesim.ru": "gogo",
			"sms-acktiwator.ru": "86"
		},
		"LivU": {
			"onlinesim.ru": "livu"
		},
		"Alfred.repair": {
			"onlinesim.ru": "alfred"
		},
		"Luxmarket.in.ua": {
			"onlinesim.ru": "luxmarket"
		},
		"Citrus": {
			"onlinesim.ru": "citrus"
		},
		"Vinted": {
			"onlinesim.ru": "vinted"
		},
		"nado info": {
			"onlinesim.ru": "nadoinfo"
		},
		"vybeerai": {
			"onlinesim.ru": "vybeerai"
		},
		"PivnoyDvor": {
			"onlinesim.ru": "pivnoydvor"
		},
		"PmarketinG": {
			"onlinesim.ru": "pmarketing"
		},
		"senordoner": {
			"onlinesim.ru": "senordoner"
		},
		"ECCO": {
			"onlinesim.ru": "ecco"
		},
		"SushiBox": {
			"onlinesim.ru": "sushibox"
		},
		"VRF": {
			"onlinesim.ru": "vrf"
		},
		"Dobrininski": {
			"onlinesim.ru": "dobrininski"
		},
		"KRUASSANfam": {
			"onlinesim.ru": "kruassanfam"
		},
		"alivewater": {
			"onlinesim.ru": "alivewater"
		},
		"Suare": {
			"onlinesim.ru": "suare "
		},
		"YCLIENTS": {
			"onlinesim.ru": "yclients"
		},
		"CenterRu": {
			"onlinesim.ru": "centerru"
		},
		"5POST": {
			"onlinesim.ru": "5post"
		},
		"AliSMS": {
			"onlinesim.ru": "alisms"
		},
		"": {
			"onlinesim.ru": "tindar_ru"
		},
		"Strana2020": {
			"onlinesim.ru": "strana2020"
		},
		"NinjaPizza": {
			"onlinesim.ru": "ninjapizza"
		},
		"SHOKO": {
			"onlinesim.ru": "shoko"
		},
		"Wekings": {
			"onlinesim.ru": "wekings"
		},
		"Coinut": {
			"onlinesim.ru": "coinut",
			"vak-sms.com": "cn"
		},
		"Slotking": {
			"onlinesim.ru": "slotking"
		},
		"chance": {
			"onlinesim.ru": "chance"
		},
		"TaxiMaster": {
			"onlinesim.ru": "taximaster"
		},
		"SKA": {
			"onlinesim.ru": "ska"
		},
		"STALAR": {
			"onlinesim.ru": "stalar"
		},
		"Threema": {
			"onlinesim.ru": "threema"
		},
		"REST_BAZAR": {
			"onlinesim.ru": "rest_bazar"
		},
		"Mrsool": {
			"onlinesim.ru": "mrsool"
		},
		"PlayerAuctions": {
			"onlinesim.ru": "playerauctions"
		},
		"DOCVED": {
			"onlinesim.ru": "docved"
		},
		"STREET_BEAT": {
			"onlinesim.ru": "street_beat"
		},
		"getemail": {
			"onlinesim.ru": "getemail"
		},
		"rocketreach": {
			"onlinesim.ru": "rocketreach"
		},
		"bitclout": {
			"onlinesim.ru": "bitclout"
		},
		"KazanExpress": {
			"onlinesim.ru": "kazanexpress"
		},
		"newtonfinance": {
			"onlinesim.ru": "newtonfinance"
		},
		"Sbermarket": {
			"onlinesim.ru": "sbermarket",
			"vak-sms.com": "sm"
		},
		"domclick": {
			"onlinesim.ru": "domclick"
		},
		"MoeZdorovie": {
			"onlinesim.ru": "moezdorovie"
		},
		"winstrike": {
			"onlinesim.ru": "winstrike"
		},
		"VseAkcii": {
			"onlinesim.ru": "vseakcii"
		},
		"moneyplace": {
			"onlinesim.ru": "moneyplace"
		},
		"Nespresso": {
			"onlinesim.ru": "nespresso"
		},
		"CAOMoscow": {
			"onlinesim.ru": "caomoscow"
		},
		"777Origin": {
			"onlinesim.ru": "777origin"
		},
		"9138": {
			"onlinesim.ru": "9138"
		},
		"purse.io": {
			"sms-acktiwator.ru": "47"
		},
		"wap.jamango.ru": {
			"sms-acktiwator.ru": "51"
		},
		"nextapp.by": {
			"sms-acktiwator.ru": "55"
		},
		"1000taxi.com": {
			"sms-acktiwator.ru": "60"
		},
		"beepcar": {
			"sms-acktiwator.ru": "63"
		},
		"chitai-gorod.ru": {
			"sms-acktiwator.ru": "65"
		},
		"vscale.io": {
			"sms-acktiwator.ru": "68"
		},
		"AlfaBank": {
			"sms-acktiwator.ru": "70"
		},
		"galaxy.mobstudio.ru": {
			"sms-acktiwator.ru": "71"
		},
		"auto.ria.com": {
			"sms-acktiwator.ru": "72"
		},
		"mannabase.com": {
			"sms-acktiwator.ru": "73"
		},
		"bilshe.mastercard.ua": {
			"sms-acktiwator.ru": "76"
		},
		"1": {
			"sms-acktiwator.ru": "81"
		},
		"viberate.com": {
			"sms-acktiwator.ru": "84"
		},
		"живёмнасевере.рф": {
			"sms-acktiwator.ru": "90"
		},
		"sipnet.ru": {
			"sms-acktiwator.ru": "91"
		},
		"Dukascopy Connect 911": {
			"sms-acktiwator.ru": "92"
		},
		"creditkasa.com.ua": {
			"sms-acktiwator.ru": "93"
		},
		"socialtools.ru": {
			"sms-acktiwator.ru": "94"
		},
		"novilidery.com": {
			"sms-acktiwator.ru": "95"
		},
		"smart": {
			"sms-acktiwator.ru": "96"
		},
		"л": {
			"sms-acktiwator.ru": "97"
		},
		"wholeworld.biz": {
			"sms-acktiwator.ru": "98"
		},
		"k": {
			"sms-acktiwator.ru": "101"
		},
		"pochtabank.ru": {
			"sms-acktiwator.ru": "104"
		},
		"exchange.musdcoin.com": {
			"sms-acktiwator.ru": "105"
		},
		"baltika7.ru": {
			"sms-acktiwator.ru": "106"
		},
		"id.sonyentertainmentnetwork.com": {
			"sms-acktiwator.ru": "107"
		},
		"work.ua": {
			"sms-acktiwator.ru": "108"
		},
		"sgro": {
			"sms-acktiwator.ru": "111"
		},
		"mail.ukr.net": {
			"sms-acktiwator.ru": "112"
		},
		"ЛУКОЙЛ": {
			"sms-acktiwator.ru": "118"
		},
		"sms-fly.com": {
			"sms-acktiwator.ru": "120"
		},
		"Cash Show": {
			"sms-acktiwator.ru": "122"
		},
		"smsapi.pl": {
			"sms-acktiwator.ru": "123"
		},
		"b17.ru": {
			"sms-acktiwator.ru": "125"
		},
		"kab.kpkvozrojdenie.ru": {
			"sms-acktiwator.ru": "126"
		},
		"team50.ru": {
			"sms-acktiwator.ru": "127"
		},
		"disk.karelia.pro": {
			"sms-acktiwator.ru": "128"
		},
		"wmmail.ru": {
			"sms-acktiwator.ru": "132"
		},
		"jugl.net": {
			"sms-acktiwator.ru": "134"
		},
		"mywallet.net.ua": {
			"sms-acktiwator.ru": "137"
		},
		"lino.network": {
			"sms-acktiwator.ru": "142"
		},
		"kegelbum.ru": {
			"sms-acktiwator.ru": "143"
		},
		"黑加手环": {
			"sms-acktiwator.ru": "149"
		},
		"upg.ua": {
			"sms-acktiwator.ru": "158"
		},
		"lk.mgnl.ru": {
			"sms-acktiwator.ru": "160"
		},
		"ASH": {
			"sms-acktiwator.ru": "166"
		},
		"NovaPoshta": {
			"sms-acktiwator.ru": "171"
		},
		"app.global24.ua": {
			"sms-acktiwator.ru": "172"
		},
		"11admiral-x.com": {
			"sms-acktiwator.ru": "177"
		},
		"bigfamily.com.ua": {
			"sms-acktiwator.ru": "178"
		},
		"sweet.tv": {
			"sms-acktiwator.ru": "179"
		},
		"smsdatabase": {
			"sms-acktiwator.ru": "201"
		},
		"microklad.ru": {
			"sms-acktiwator.ru": "204"
		},
		"uplata.ua": {
			"sms-acktiwator.ru": "207"
		},
		"petr1.ru": {
			"sms-acktiwator.ru": "213"
		},
		"kaggle": {
			"sms-acktiwator.ru": "451"
		},
		"Швыдко Гроши": {
			"sms-acktiwator.ru": "455"
		},
		"Tengo": {
			"sms-acktiwator.ru": "456"
		},
		"shafa.ua": {
			"sms-acktiwator.ru": "458"
		},
		"Plenty of Fish": {
			"vak-sms.com": "pf"
		},
		"Moteplassen": {
			"vak-sms.com": "mp"
		},
		"Paysafecard": {
			"vak-sms.com": "pc"
		},
		"Страховые": {
			"vak-sms.com": "strh"
		},
		"Move": {
			"vak-sms.com": "mo"
		},
		"Booking": {
			"vak-sms.com": "bo"
		},
		"Pingpongx": {
			"vak-sms.com": "px"
		},
		"GroupMe": {
			"vak-sms.com": "gm"
		},
		"Revolut": {
			"vak-sms.com": "rt"
		},
		"Bunq": {
			"vak-sms.com": "bq"
		},
		"Mozen": {
			"vak-sms.com": "mz"
		},
		"Socpublic": {
			"vak-sms.com": "sp"
		},
		"Contact-sys": {
			"vak-sms.com": "cs"
		},
		"Atlas": {
			"vak-sms.com": "as"
		},
		"Battle": {
			"vak-sms.com": "bt"
		},
		"Spar": {
			"vak-sms.com": "sr"
		}
	};
	return _is_nilb(sites[site]) ? sites["Other"] : (_is_nilb(sites[site][this.service]) ? sites["Other"] : sites[site][this.service]);
};