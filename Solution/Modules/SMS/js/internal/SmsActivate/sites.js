_SMS.SmsActivateApi.prototype.getRawSite = function(site){
	var sites = {
		"Other": {
			"sms-activate.ru": "ot",
			"smshub.org": "ot",
			"5sim.net": "other",
			"getsms.online": "ot",
			"smsvk.net": "ot",
			"cheapsms.ru": "ot",
			"sms.kopeechka.store": "ot"
		},
		"VK": {
			"sms-activate.ru": "vk",
			"smshub.org": "vk",
			"5sim.net": "vkontakte",
			"getsms.online": "vk",
			"smsvk.net": "vk",
			"cheapsms.ru": "vk",
			"sms.kopeechka.store": "vk"
		},
		"Ok.ru": {
			"sms-activate.ru": "ok",
			"smshub.org": "ok",
			"5sim.net": "odnoklassniki",
			"getsms.online": "ok",
			"smsvk.net": "ok",
			"cheapsms.ru": "ok"
		},
		"WhatsApp": {
			"sms-activate.ru": "wa",
			"smshub.org": "wa",
			"5sim.net": "whatsapp",
			"getsms.online": "wa",
			"smsvk.net": "wa",
			"cheapsms.ru": "wp",
			"sms.kopeechka.store": "wa"
		},
		"Viber": {
			"sms-activate.ru": "vi",
			"smshub.org": "vi",
			"5sim.net": "viber",
			"getsms.online": "vi",
			"smsvk.net": "vi",
			"cheapsms.ru": "vi",
			"sms.kopeechka.store": "vi"
		},
		"Telegram": {
			"sms-activate.ru": "tg",
			"smshub.org": "tg",
			"5sim.net": "telegram",
			"getsms.online": "tg",
			"smsvk.net": "tg",
			"cheapsms.ru": "tg",
			"sms.kopeechka.store": "tg"
		},
		"WeChat": {
			"sms-activate.ru": "wb",
			"smshub.org": "wb",
			"5sim.net": "wechat",
			"getsms.online": "wb",
			"smsvk.net": "wc",
			"cheapsms.ru": "wb",
			"sms.kopeechka.store": "wb"
		},
		"Google": {
			"sms-activate.ru": "go",
			"smshub.org": "go",
			"5sim.net": "google",
			"getsms.online": "go",
			"smsvk.net": "go",
			"cheapsms.ru": "go",
			"sms.kopeechka.store": "go"
		},
		"Avito": {
			"sms-activate.ru": "av",
			"smshub.org": "av",
			"5sim.net": "avito",
			"getsms.online": "av",
			"smsvk.net": "av"
		},
		"Facebook": {
			"sms-activate.ru": "fb",
			"smshub.org": "fb",
			"5sim.net": "facebook",
			"getsms.online": "fb",
			"smsvk.net": "fb",
			"cheapsms.ru": "fb",
			"sms.kopeechka.store": "fb"
		},
		"Twitter": {
			"sms-activate.ru": "tw",
			"smshub.org": "tw",
			"5sim.net": "twitter",
			"getsms.online": "tw",
			"smsvk.net": "tw",
			"cheapsms.ru": "tw"
		},
		"Uber": {
			"sms-activate.ru": "ub",
			"smshub.org": "ub",
			"5sim.net": "uber",
			"getsms.online": "ub",
			"smsvk.net": "ub",
			"cheapsms.ru": "ub"
		},
		"Qiwi": {
			"sms-activate.ru": "qw",
			"smshub.org": "qw",
			"5sim.net": "qiwiwallet",
			"smsvk.net": "qw",
			"cheapsms.ru": "qw"
		},
		"Gett": {
			"sms-activate.ru": "gt",
			"smshub.org": "gt",
			"5sim.net": "gett",
			"smsvk.net": "gett",
			"cheapsms.ru": "gt"
		},
		"OLX": {
			"sms-activate.ru": "sn",
			"smshub.org": "sn",
			"5sim.net": "olx"
		},
		"Instagram": {
			"sms-activate.ru": "ig",
			"smshub.org": "ig",
			"5sim.net": "instagram",
			"getsms.online": "ig",
			"smsvk.net": "ig",
			"cheapsms.ru": "ig",
			"sms.kopeechka.store": "ig"
		},
		"Hezzl": {
			"sms-activate.ru": "ss",
			"smshub.org": "ss",
			"5sim.net": "hezzl"
		},
		"Youla": {
			"sms-activate.ru": "ym",
			"smshub.org": "ym",
			"5sim.net": "youla",
			"getsms.online": "yl"
		},
		"Mail.ru": {
			"sms-activate.ru": "ma",
			"smshub.org": "ma",
			"5sim.net": "mailru",
			"getsms.online": "ma",
			"smsvk.net": "ma",
			"cheapsms.ru": "ma",
			"sms.kopeechka.store": "ma"
		},
		"Microsoft": {
			"sms-activate.ru": "mm",
			"smshub.org": "mm",
			"5sim.net": "microsoft",
			"getsms.online": "mm",
			"smsvk.net": "mm",
			"cheapsms.ru": "mm",
			"sms.kopeechka.store": "mm"
		},
		"Airbnb": {
			"sms-activate.ru": "uk",
			"smshub.org": "uk",
			"5sim.net": "airbnb"
		},
		"LINE Messenger": {
			"sms-activate.ru": "me",
			"smshub.org": "me",
			"5sim.net": "line",
			"getsms.online": "me"
		},
		"Yahoo": {
			"sms-activate.ru": "mb",
			"smshub.org": "mb",
			"5sim.net": "yahoo",
			"getsms.online": "mb",
			"smsvk.net": "yh",
			"cheapsms.ru": "mb"
		},
		"DrugVokrug": {
			"sms-activate.ru": "we",
			"smshub.org": "we",
			"5sim.net": "drugvokrug",
			"cheapsms.ru": "we",
			"sms.kopeechka.store": "we"
		},
		"5ka": {
			"sms-activate.ru": "bd",
			"smshub.org": "bd",
			"5sim.net": "pyaterochka",
			"getsms.online": "bd",
			"smsvk.net": "pt",
			"cheapsms.ru": "py"
		},
		"HQ Trivia": {
			"sms-activate.ru": "kp",
			"smshub.org": "kp",
			"5sim.net": "hqtrivia",
			"getsms.online": "pm"
		},
		"Delivery Club": {
			"sms-activate.ru": "dt",
			"smshub.org": "dt",
			"5sim.net": "delivery",
			"cheapsms.ru": "dt"
		},
		"Yandex": {
			"sms-activate.ru": "ya",
			"smshub.org": "ya",
			"5sim.net": "yandex",
			"getsms.online": "ya",
			"cheapsms.ru": "ya",
			"sms.kopeechka.store": "ya"
		},
		"Steam": {
			"sms-activate.ru": "mt",
			"smshub.org": "mt",
			"5sim.net": "steam",
			"getsms.online": "sm",
			"cheapsms.ru": "mt"
		},
		"Tinder": {
			"sms-activate.ru": "oi",
			"smshub.org": "oi",
			"5sim.net": "tinder",
			"cheapsms.ru": "oi",
			"sms.kopeechka.store": "oi"
		},
		"Mamba": {
			"sms-activate.ru": "fd",
			"smshub.org": "fd",
			"5sim.net": "mamba",
			"smsvk.net": "mb",
			"cheapsms.ru": "fd",
			"sms.kopeechka.store": "fd"
		},
		"MeetMe": {
			"sms-activate.ru": "fd",
			"5sim.net": "meetme",
			"getsms.online": "uk",
			"sms.kopeechka.store": "fd"
		},
		"Dent": {
			"sms-activate.ru": "zz",
			"smshub.org": "zz",
			"5sim.net": "dent"
		},
		"KakaoTalk": {
			"sms-activate.ru": "kt",
			"smshub.org": "kt",
			"5sim.net": "kakaotalk",
			"getsms.online": "kt",
			"smsvk.net": "kt",
			"sms.kopeechka.store": "kt"
		},
		"Aol": {
			"sms-activate.ru": "pm",
			"smshub.org": "pm",
			"5sim.net": "aol",
			"getsms.online": "we",
			"smsvk.net": "al",
			"cheapsms.ru": "pm"
		},
		"LinkedIN": {
			"sms-activate.ru": "tn",
			"smshub.org": "tn",
			"5sim.net": "linkedin",
			"cheapsms.ru": "in"
		},
		"Tencent QQ": {
			"sms-activate.ru": "qq",
			"smshub.org": "qq",
			"5sim.net": "tencentqq",
			"getsms.online": "qq"
		},
		"Magnit": {
			"sms-activate.ru": "mg",
			"smshub.org": "mg",
			"5sim.net": "magnit",
			"getsms.online": "mg",
			"cheapsms.ru": "mn"
		},
		"POF.com": {
			"sms-activate.ru": "pf",
			"smshub.org": "pf",
			"5sim.net": "pof"
		},
		"Yalla": {
			"sms-activate.ru": "yl",
			"smshub.org": "yl",
			"5sim.net": "yalla"
		},
		"Kolesa.kz": {
			"sms-activate.ru": "kl",
			"smshub.org": "kl"
		},
		"Premium.one": {
			"sms-activate.ru": "po",
			"smshub.org": "po"
		},
		"Naver": {
			"sms-activate.ru": "nv",
			"smshub.org": "nv",
			"5sim.net": "naver",
			"getsms.online": "nv",
			"smsvk.net": "nv",
			"cheapsms.ru": "nv",
			"sms.kopeechka.store": "nv"
		},
		"Netflix": {
			"sms-activate.ru": "nf",
			"smshub.org": "nf",
			"5sim.net": "netflix",
			"smsvk.net": "nf"
		},
		"ICQ": {
			"sms-activate.ru": "iq",
			"smshub.org": "iq",
			"5sim.net": "icq",
			"cheapsms.ru": "ic"
		},
		"Onliner.by": {
			"sms-activate.ru": "ob",
			"smshub.org": "ob"
		},
		"Kufar.by": {
			"sms-activate.ru": "kb",
			"smshub.org": "kb",
			"5sim.net": "kufarby"
		},
		"Imo": {
			"sms-activate.ru": "im",
			"smshub.org": "im",
			"5sim.net": "imo",
			"smsvk.net": "im",
			"cheapsms.ru": "im",
			"sms.kopeechka.store": "im"
		},
		"MiChat": {
			"sms-activate.ru": "mc",
			"smshub.org": "mc",
			"5sim.net": "michat"
		},
		"Discord": {
			"sms-activate.ru": "ds",
			"smshub.org": "ds",
			"5sim.net": "discord",
			"getsms.online": "ds",
			"cheapsms.ru": "dc"
		},
		"SEOsprint": {
			"sms-activate.ru": "vv",
			"smshub.org": "vv",
			"5sim.net": "seosprint",
			"cheapsms.ru": "ss"
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
			"sms.kopeechka.store": "tt"
		},
		"Douyin": {
			"sms-activate.ru": "lf",
			"smshub.org": "lf"
		},
		"Ukrnet": {
			"sms-activate.ru": "hu",
			"smshub.org": "hu"
		},
		"Skout": {
			"sms-activate.ru": "wg",
			"smshub.org": "wg",
			"5sim.net": "skout",
			"getsms.online": "mt",
			"smsvk.net": "wg"
		},
		"EasyPay": {
			"sms-activate.ru": "rz",
			"smshub.org": "rz"
		},
		"Q12 Trivia": {
			"sms-activate.ru": "vf",
			"smshub.org": "vf"
		},
		"Pyro Music": {
			"sms-activate.ru": "ny",
			"smshub.org": "ny",
			"sms.kopeechka.store": "ny"
		},
		"Wolt": {
			"sms-activate.ru": "rr",
			"smshub.org": "rr",
			"sms.kopeechka.store": "rr"
		},
		"CliQQ": {
			"sms-activate.ru": "fe",
			"smshub.org": "fe"
		},
		"SSOid.net": {
			"sms-activate.ru": "la",
			"smshub.org": "la"
		},
		"Zoho": {
			"sms-activate.ru": "zh",
			"smshub.org": "zh",
			"5sim.net": "zoho",
			"sms.kopeechka.store": "zh"
		},
		"Ticketmaster": {
			"sms-activate.ru": "gp",
			"smshub.org": "gp"
		},
		"Amazon": {
			"sms-activate.ru": "am",
			"smshub.org": "am",
			"5sim.net": "amazon",
			"cheapsms.ru": "am"
		},
		"Olacabs": {
			"sms-activate.ru": "ly",
			"smshub.org": "ly"
		},
		"Rambler": {
			"sms-activate.ru": "tc",
			"smshub.org": "tc",
			"sms.kopeechka.store": "tc"
		},
		"ProtonMail": {
			"sms-activate.ru": "dp",
			"smshub.org": "dp",
			"5sim.net": "proton",
			"smsvk.net": "dp",
			"sms.kopeechka.store": "dp"
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
			"cheapsms.ru": "cm"
		},
		"Miratorg": {
			"sms-activate.ru": "op",
			"smshub.org": "op",
			"5sim.net": "miratorg"
		},
		"PGbonus": {
			"sms-activate.ru": "fx",
			"smshub.org": "fx",
			"cheapsms.ru": "pg"
		},
		"MEGA": {
			"sms-activate.ru": "qr",
			"smshub.org": "qr",
			"5sim.net": "mega"
		},
		"SportMaster": {
			"sms-activate.ru": "yk",
			"smshub.org": "yk",
			"cheapsms.ru": "sp"
		},
		"Careem": {
			"sms-activate.ru": "ls",
			"smshub.org": "ls",
			"5sim.net": "careem"
		},
		"BIGO LIVE": {
			"sms-activate.ru": "bl",
			"smshub.org": "bl",
			"5sim.net": "bigolive",
			"sms.kopeechka.store": "bg"
		},
		"MyMusicTaste": {
			"sms-activate.ru": "mu",
			"smshub.org": "mu"
		},
		"Snapchat": {
			"sms-activate.ru": "fu",
			"smshub.org": "fu",
			"5sim.net": "snapchat"
		},
		"Keybase": {
			"sms-activate.ru": "bf",
			"smshub.org": "bf",
			"5sim.net": "keybase"
		},
		"OZON": {
			"sms-activate.ru": "sg",
			"smshub.org": "sg",
			"5sim.net": "ozon",
			"cheapsms.ru": "oz",
			"sms.kopeechka.store": "sg"
		},
		"Wildberries": {
			"sms-activate.ru": "uu",
			"smshub.org": "uu",
			"cheapsms.ru": "wl"
		},
		"BlaBlaCar": {
			"sms-activate.ru": "ua",
			"smshub.org": "ua",
			"5sim.net": "blablacar",
			"getsms.online": "bc",
			"cheapsms.ru": "bb"
		},
		"Alibaba": {
			"sms-activate.ru": "ab",
			"smshub.org": "ab",
			"5sim.net": "alibaba",
			"smsvk.net": "ab",
			"cheapsms.ru": "ab",
			"sms.kopeechka.store": "ab"
		},
		"InboxLv": {
			"sms-activate.ru": "iv",
			"smshub.org": "iv",
			"sms.kopeechka.store": "iv"
		},
		"NTT Game": {
			"sms-activate.ru": "zy",
			"smshub.org": "zy",
			"5sim.net": "nttgame"
		},
		"Surveytime": {
			"sms-activate.ru": "gd",
			"smshub.org": "gd"
		},
		"MyLove": {
			"sms-activate.ru": "fy",
			"smshub.org": "fy",
			"sms.kopeechka.store": "fy"
		},
		"Mos.ru": {
			"sms-activate.ru": "ce",
			"smshub.org": "ce"
		},
		"Truecaller": {
			"sms-activate.ru": "tl",
			"smshub.org": "tl",
			"5sim.net": "truecaller"
		},
		"Globus": {
			"sms-activate.ru": "hm",
			"smshub.org": "hm",
			"5sim.net": "globus",
			"cheapsms.ru": "gl"
		},
		"Bolt": {
			"sms-activate.ru": "tx",
			"smshub.org": "tx",
			"sms.kopeechka.store": "tx"
		},
		"Shopee": {
			"sms-activate.ru": "ka",
			"smshub.org": "ka",
			"5sim.net": "shopee"
		},
		"Perekrestok": {
			"sms-activate.ru": "pl",
			"smshub.org": "pl",
			"5sim.net": "perekrestok",
			"cheapsms.ru": "pk"
		},
		"Burger King": {
			"sms-activate.ru": "ip",
			"smshub.org": "ip",
			"5sim.net": "burgerking"
		},
		"Prom.ua": {
			"sms-activate.ru": "cm",
			"smshub.org": "cm"
		},
		"AliPay": {
			"sms-activate.ru": "hw",
			"smshub.org": "hw",
			"5sim.net": "alipay",
			"getsms.online": "ap"
		},
		"Karusel": {
			"sms-activate.ru": "de",
			"smshub.org": "de"
		},
		"IVI": {
			"sms-activate.ru": "jc",
			"smshub.org": "jc"
		},
		"inDriver": {
			"sms-activate.ru": "rl",
			"smshub.org": "rl",
			"sms.kopeechka.store": "rl"
		},
		"Happn": {
			"sms-activate.ru": "df",
			"smshub.org": "df",
			"sms.kopeechka.store": "df"
		},
		"RuTube": {
			"sms-activate.ru": "ui",
			"smshub.org": "ui",
			"sms.kopeechka.store": "ui"
		},
		"Magnolia": {
			"sms-activate.ru": "up",
			"smshub.org": "up",
			"5sim.net": "magnolia",
			"cheapsms.ru": "mg"
		},
		"FoodPanda": {
			"sms-activate.ru": "nz",
			"smshub.org": "nz",
			"5sim.net": "foodpanda",
			"cheapsms.ru": "fp"
		},
		"Weibo": {
			"sms-activate.ru": "kf",
			"smshub.org": "kf",
			"5sim.net": "weibo"
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
			"5sim.net": "jd"
		},
		"MTS CashBack": {
			"sms-activate.ru": "da",
			"smshub.org": "da",
			"5sim.net": "mtscashback"
		},
		"Fiqsy": {
			"sms-activate.ru": "ug",
			"smshub.org": "ug"
		},
		"KuCoinPlay": {
			"sms-activate.ru": "sq",
			"smshub.org": "sq"
		},
		"Papara": {
			"sms-activate.ru": "zr",
			"smshub.org": "zr",
			"5sim.net": "papara",
			"sms.kopeechka.store": "zr"
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
			"smshub.org": "cw"
		},
		"Baidu": {
			"sms-activate.ru": "li",
			"smshub.org": "li"
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
			"cheapsms.ru": "ln"
		},
		"Payberry": {
			"sms-activate.ru": "qb",
			"smshub.org": "qb"
		},
		"Drom.ru": {
			"sms-activate.ru": "hz",
			"smshub.org": "hz",
			"5sim.net": "drom",
			"smsvk.net": "dr"
		},
		"GlobalTel": {
			"sms-activate.ru": "gl",
			"smshub.org": "gl"
		},
		"Deliveroo": {
			"sms-activate.ru": "zk",
			"smshub.org": "zk",
			"5sim.net": "deliveroo"
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
			"cheapsms.ru": "nk"
		},
		"myGLO": {
			"sms-activate.ru": "ae",
			"smshub.org": "ae"
		},
		"YouStar": {
			"sms-activate.ru": "gb",
			"smshub.org": "gb"
		},
		"РСА": {
			"sms-activate.ru": "cy",
			"smshub.org": "cy",
			"cheapsms.ru": "pc"
		},
		"RosaKhutor": {
			"sms-activate.ru": "qm",
			"smshub.org": "qm"
		},
		"eBay": {
			"sms-activate.ru": "dh",
			"smshub.org": "dh",
			"5sim.net": "ebay"
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
			"sms.kopeechka.store": "gr"
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
			"5sim.net": "coinbase"
		},
		"dbrUA": {
			"sms-activate.ru": "tj",
			"smshub.org": "tj"
		},
		"PayPal": {
			"sms-activate.ru": "ts",
			"smshub.org": "ts",
			"5sim.net": "paypal",
			"sms.kopeechka.store": "pl"
		},
		"Hily": {
			"sms-activate.ru": "rt",
			"smshub.org": "rt"
		},
		"SneakersnStuff": {
			"sms-activate.ru": "sf",
			"smshub.org": "sf"
		},
		"Dostavista": {
			"sms-activate.ru": "sv",
			"smshub.org": "sv",
			"5sim.net": "dostavista"
		},
		"32red": {
			"sms-activate.ru": "qi"
		},
		"Blizzard": {
			"sms-activate.ru": "bz",
			"smshub.org": "bz",
			"5sim.net": "blizzard"
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
			"cheapsms.ru": "yg"
		},
		"MrGreen": {
			"sms-activate.ru": "lw",
			"smshub.org": "lw"
		},
		"Rediffmail": {
			"sms-activate.ru": "co",
			"smshub.org": "co"
		},
		"Miloan": {
			"sms-activate.ru": "ey",
			"smshub.org": "ey"
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
			"cheapsms.ru": "di"
		},
		"Monese": {
			"sms-activate.ru": "py",
			"smshub.org": "py"
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
			"5sim.net": "justdating"
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
			"smshub.org": "ff"
		},
		"DodoPizza": {
			"sms-activate.ru": "sd",
			"smshub.org": "sd",
			"5sim.net": "dodopizza",
			"cheapsms.ru": "dd"
		},
		"McDonalds": {
			"sms-activate.ru": "ry",
			"smshub.org": "ry",
			"5sim.net": "mcdonalds",
			"cheapsms.ru": "md"
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
			"smshub.org": "qa"
		},
		"Craigslist": {
			"sms-activate.ru": "wc",
			"smshub.org": "wc",
			"5sim.net": "craigslist"
		},
		"Foody": {
			"sms-activate.ru": "kw",
			"smshub.org": "kw",
			"5sim.net": "foody"
		},
		"Grab": {
			"sms-activate.ru": "jg",
			"smshub.org": "jg",
			"5sim.net": "grabtaxi"
		},
		"Zalo": {
			"sms-activate.ru": "mj",
			"smshub.org": "mj",
			"5sim.net": "zalo"
		},
		"LiveScore": {
			"sms-activate.ru": "eu",
			"smshub.org": "eu",
			"5sim.net": "livescore"
		},
		"888casino": {
			"sms-activate.ru": "ll",
			"smshub.org": "ll"
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
			"smshub.org": "th"
		},
		"Tango": {
			"sms-activate.ru": "xr",
			"smshub.org": "xr",
			"5sim.net": "tango"
		},
		"Global24": {
			"sms-activate.ru": "iz",
			"smshub.org": "iz"
		},
		"MVideo": {
			"sms-activate.ru": "tk",
			"smshub.org": "tk"
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
			"5sim.net": "offerup"
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
			"smshub.org": "rm"
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
			"smshub.org": "si"
		},
		"Potato Chat": {
			"sms-activate.ru": "fj",
			"smshub.org": "fj",
			"5sim.net": "potato"
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
			"5sim.net": "amasia"
		},
		"Dream11": {
			"sms-activate.ru": "ve",
			"smshub.org": "ve"
		},
		"Oriflame": {
			"sms-activate.ru": "qh",
			"smshub.org": "qh"
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
			"smshub.org": "jb"
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
			"smshub.org": "st"
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
			"smshub.org": "il"
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
			"smshub.org": "dn"
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
			"5sim.net": "1xbet"
		},
		"Mobile01": {
			"sms-activate.ru": "wk",
			"smshub.org": "wk"
		},
		"Aitu": {
			"sms-activate.ru": "jj",
			"smshub.org": "jj"
		},
		"Adidas": {
			"sms-activate.ru": "an",
			"smshub.org": "an",
			"5sim.net": "adidas",
			"cheapsms.ru": "ad"
		},
		"Samokat": {
			"sms-activate.ru": "jr",
			"smshub.org": "jr",
			"5sim.net": "samokat",
			"cheapsms.ru": "sa"
		},
		"Vernyi": {
			"sms-activate.ru": "nb",
			"smshub.org": "nb",
			"5sim.net": "vernyi"
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
			"smshub.org": "hc"
		},
		"Eneba": {
			"sms-activate.ru": "uf",
			"smshub.org": "uf"
		},
		"Verse": {
			"sms-activate.ru": "kn",
			"smshub.org": "kn"
		},
		"Taobao": {
			"sms-activate.ru": "qd",
			"smshub.org": "qd",
			"5sim.net": "taobao",
			"getsms.online": "ap"
		},
		"1688": {
			"sms-activate.ru": "hn",
			"smshub.org": "hn",
			"5sim.net": "1688"
		},
		"OnTaxi": {
			"sms-activate.ru": "zf",
			"smshub.org": "zf"
		},
		"Hotline": {
			"sms-activate.ru": "gi",
			"smshub.org": "gi"
		},
		"Tatneft": {
			"sms-activate.ru": "uc",
			"smshub.org": "uc"
		},
		"RRSA": {
			"sms-activate.ru": "mn",
			"smshub.org": "mn"
		},
		"Douyu": {
			"sms-activate.ru": "ak",
			"smshub.org": "ak",
			"5sim.net": "douyu"
		},
		"Uklon": {
			"sms-activate.ru": "cp",
			"smshub.org": "cp"
		},
		"MoneyLion": {
			"sms-activate.ru": "qo",
			"smshub.org": "qo"
		},
		"Apple": {
			"sms-activate.ru": "wx",
			"smshub.org": "wx",
			"sms.kopeechka.store": "ap"
		},
		"Clubhouse": {
			"sms-activate.ru": "et",
			"smshub.org": "et"
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
			"sms-activate.ru": "lb"
		},
		"Banks": {
			"sms-activate.ru": "md",
			"smshub.org": "md"
		},
		"BitClout": {
			"sms-activate.ru": "lt",
			"smshub.org": "lt",
			"5sim.net": "bitclout"
		},
		"Skroutz": {
			"sms-activate.ru": "sk",
			"smshub.org": "sk"
		},
		"MapleSEA": {
			"sms-activate.ru": "oh",
			"smshub.org": "oh"
		},
		"Rozetka": {
			"sms-activate.ru": "km",
			"smshub.org": "km"
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
			"smshub.org": "jf"
		},
		"CityBase": {
			"sms-activate.ru": "az",
			"smshub.org": "az"
		},
		"Allegro": {
			"sms-activate.ru": "yn",
			"smshub.org": "yn"
		},
		"YouGotaGift": {
			"sms-activate.ru": "wl",
			"smshub.org": "wl"
		},
		"Lazada": {
			"sms-activate.ru": "dl",
			"smshub.org": "dl",
			"5sim.net": "lazada"
		},
		"TradingView": {
			"sms-activate.ru": "gc",
			"smshub.org": "gc",
			"cheapsms.ru": "tv"
		},
		"Fiverr": {
			"sms-activate.ru": "cn",
			"smshub.org": "cn",
			"5sim.net": "fiverr"
		},
		"Gabi": {
			"sms-activate.ru": "ou",
			"smshub.org": "ou"
		},
		"Kwai": {
			"sms-activate.ru": "vp",
			"smshub.org": "vp",
			"5sim.net": "kwai",
			"smsvk.net": "kw"
		},
		"DetskiyMir": {
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
		"Goods": {
			"sms-activate.ru": "be",
			"smshub.org": "be",
			"smsvk.net": "gd"
		},
		"Glovo": {
			"sms-activate.ru": "aq",
			"smshub.org": "aq",
			"5sim.net": "glovo"
		},
		"23red": {
			"smshub.org": "qi",
			"5sim.net": "23red"
		},
		"PaySend": {
			"5sim.net": "paysend"
		},
		"Aliexpress": {
			"5sim.net": "aliexpress"
		},
		"Airtel (wf)": {
			"5sim.net": "airtel"
		},
		"Akelni": {
			"5sim.net": "akelni"
		},
		"Azino": {
			"5sim.net": "azino"
		},
		"BitTube": {
			"5sim.net": "bittube"
		},
		"Blockchain": {
			"5sim.net": "blockchain"
		},
		"Cekkazan": {
			"5sim.net": "cekkazan"
		},
		"Dixy": {
			"5sim.net": "dixy",
			"cheapsms.ru": "ds"
		},
		"Domdara": {
			"5sim.net": "domdara",
			"sms.kopeechka.store": "dd"
		},
		"Dukascopy": {
			"5sim.net": "dukascopy"
		},
		"Edgeless": {
			"5sim.net": "edgeless"
		},
		"Electroneum": {
			"5sim.net": "electroneum"
		},
		"Forwarding": {
			"5sim.net": "forwarding"
		},
		"GameFlip": {
			"5sim.net": "gameflip"
		},
		"Gcash": {
			"5sim.net": "gcash"
		},
		"Get": {
			"5sim.net": "get"
		},
		"Green": {
			"5sim.net": "green"
		},
		"iCard": {
			"5sim.net": "icard"
		},
		"IOST": {
			"5sim.net": "iost"
		},
		"KomandaCard": {
			"5sim.net": "komandacard"
		},
		"LBRY": {
			"5sim.net": "lbry"
		},
		"Lianxin": {
			"5sim.net": "lianxin"
		},
		"Nimses": {
			"5sim.net": "nimses"
		},
		"OkCupid": {
			"5sim.net": "okcupid"
		},
		"Okey": {
			"5sim.net": "okey",
			"cheapsms.ru": "oy"
		},
		"OpenPoint": {
			"5sim.net": "openpoint"
		},
		"Oracle": {
			"5sim.net": "oraclecloud"
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
			"5sim.net": "pubg"
		},
		"Reuse": {
			"5sim.net": "reuse"
		},
		"Ripkord": {
			"5sim.net": "ripkord"
		},
		"Signal": {
			"5sim.net": "signal"
		},
		"TanTan": {
			"5sim.net": "tantan",
			"sms.kopeechka.store": "ta"
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
			"5sim.net": "winston"
		},
		"YouDo": {
			"5sim.net": "youdo"
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
			"cheapsms.ru": "pd"
		},
		"TaxiMaxim": {
			"smsvk.net": "mx"
		},
		"2Cupis": {
			"cheapsms.ru": "qc"
		},
		"1Cupis": {
			"cheapsms.ru": "1c"
		},
		"1Xstavka": {
			"cheapsms.ru": "ox"
		},
		"Beget": {
			"cheapsms.ru": "bt"
		},
		"Benzuber": {
			"cheapsms.ru": "bz"
		},
		"CreditPlus": {
			"cheapsms.ru": "cp"
		},
		"FACEIT": {
			"cheapsms.ru": "fc"
		},
		"Farfor": {
			"cheapsms.ru": "fr"
		},
		"GPNbonus": {
			"cheapsms.ru": "gp"
		},
		"Guideh": {
			"cheapsms.ru": "gd"
		},
		"Kontur": {
			"cheapsms.ru": "kt"
		},
		"MegafonTV": {
			"cheapsms.ru": "me"
		},
		"Okko": {
			"cheapsms.ru": "ko"
		},
		"RESO": {
			"cheapsms.ru": "rs"
		},
		"RocketBank": {
			"cheapsms.ru": "rb"
		},
		"Steemit": {
			"cheapsms.ru": "sm"
		},
		"T7 TAXI": {
			"cheapsms.ru": "st"
		},
		"TamTam": {
			"cheapsms.ru": "ta"
		},
		"Tinkoff": {
			"cheapsms.ru": "tf"
		},
		"Vkusvill": {
			"cheapsms.ru": "vv"
		},
		"WebMoney": {
			"cheapsms.ru": "wm"
		},
		"Worki": {
			"cheapsms.ru": "wo"
		},
		"YooMoney": {
			"cheapsms.ru": "yo"
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
			"cheapsms.ru": "gz"
		},
		"ZdravCity": {
			"cheapsms.ru": "zc"
		},
		"НашЛюбимыйВрач.рф": {
			"cheapsms.ru": "vr"
		},
		"Почта России": {
			"cheapsms.ru": "pr"
		},
		"Fotostrana": {
			"cheapsms.ru": "fs"
		},
		"PP.UA": {
			"sms.kopeechka.store": "pp"
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
			"sms.kopeechka.store": "pk"
		},
		"Band": {
			"sms.kopeechka.store": "pk"
		},
		"Up-x.net": {
			"sms.kopeechka.store": "up"
		},
		"FetLife": {
			"sms.kopeechka.store": "fe"
		}
	};
	return _is_nilb(sites[site]) ? sites["Other"][this.service] : (_is_nilb(sites[site][this.service]) ? sites["Other"][this.service] : sites[site][this.service]);
};