<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "service",
		description: tr("Service"),
		default_selector: "string",
		variants: [
			"sms-activate.ru",
			"smshub.org",
			"5sim.net",
			"onlinesim.ru",
			"sms-acktiwator.ru",
			"vak-sms.com",
			"give-sms.com",
			"getsms.online",
			"sms-man.ru",
			"activation.pw",
			"cheapsms.ru",
			"smsvk.net",
			"sms.kopeechka.store",
			"365sms.ru",
			"smspva.com",
			"simsms.org"
		],
		disable_int: true,
		value_string: "sms-activate.ru",
		help: {
			description: tr("SMS receiving service for which need to get the count of available numbers."),
			examples: [
				{code: "sms-activate.ru", description: "https://sms-activate.ru"},
				{code: "smshub.org", description: "https://smshub.org"},
				{code: "5sim.net", description: "https://5sim.net"}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "apiKey",
		description: tr("API key"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("API key of the SMS receiving service. The key for the service selected in the \"Service\" parameter. Depending on the service, you can get it in your personal account or in the service settings."),
			examples: [
				{code: "8b1a9953c4611296a827abf8c47804d7"},
				{code: "79916U5718g2266a7bff7fad356c6cb280b3ea"},
				{code: "f4d559ba78aa6c4701c1995ae9977c03"}
			]
		}
	}) %>
	<div class="col-xs-12">
		<form class="form-horizontal">
		  <div class="form-group">
			<div class="col-xs-2" style="width: auto;">
			  <div class="input-group">
				<span data-preserve="true" data-preserve-type="select" data-preserve-id="site">
				  <select class="form-control input-sm" id="site" placeholder="Site">
					<option class="tr" title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Other" selected="selected">Other</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="VK">VK</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="WhatsApp">WhatsApp</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Viber">Viber</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Telegram">Telegram</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="WeChat">WeChat</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Google">Google</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Facebook">Facebook</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Instagram">Instagram</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Microsoft">Microsoft</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="KakaoTalk">KakaoTalk</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Twitter">Twitter</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Uber">Uber</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Mail.ru">Mail.ru</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, smspva.com, vak-sms.com, give-sms.com" value="Mail.ru Group">Mail.ru Group</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Yahoo">Yahoo</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Tinder">Tinder</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Aol">Aol</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Naver">Naver</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Ok.ru">Ok.ru</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Avito">Avito</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Yandex">Yandex</option>
					<option title="sms-activate.ru, smshub.org, smsvk.net, cheapsms.ru, 365sms.ru, sms-acktiwator.ru" value="YandexGo">YandexGo</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Yandex.Eda">Yandex.Eda</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Steam">Steam</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Mamba">Mamba</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Imo">Imo</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="TikTok">TikTok</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="DrugVokrug">DrugVokrug</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Discord">Discord</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="ProtonMail">ProtonMail</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Grindr">Grindr</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Gett">Gett</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="OLX">OLX</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Airbnb">Airbnb</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="LINE Messenger">LINE Messenger</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="5ka">5ka</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Tencent QQ">Tencent QQ</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Netflix">Netflix</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Amazon">Amazon</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="CityMobil">CityMobil</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="OZON">OZON</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="BlaBlaCar">BlaBlaCar</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Alibaba">Alibaba</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Aliexpress">Aliexpress</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Nike">Nike</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Adidas">Adidas</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, cheapsms.ru, 365sms.ru, activation.pw, smspva.com, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Qiwi">Qiwi</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Youla">Youla</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="LinkedIN">LinkedIN</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Magnit">Magnit</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Yalla">Yalla</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, smsvk.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Skout">Skout</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Perekrestok">Perekrestok</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="AliPay">AliPay</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Drom.ru">Drom.ru</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, sms-acktiwator.ru, vak-sms.com" value="PayPal">PayPal</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="DiDi">DiDi</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="McDonalds">McDonalds</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Delivery Club">Delivery Club</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, onlinesim.ru, sms-acktiwator.ru" value="SEOsprint">SEOsprint</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Zoho">Zoho</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="SportMaster">SportMaster</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Careem">Careem</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Snapchat">Snapchat</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Bolt">Bolt</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="FoodPanda">FoodPanda</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Papara">Papara</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="eBay">eBay</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Blizzard">Blizzard</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Samokat">Samokat</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="HQ Trivia">HQ Trivia</option>
					<option title="sms-activate.ru, 5sim.net, getsms.online, sms-man.ru, sms.kopeechka.store, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="MeetMe">MeetMe</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="POF.com">POF.com</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="ICQ">ICQ</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="MiChat">MiChat</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, give-sms.com" value="BIGO LIVE">BIGO LIVE</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, vak-sms.com, give-sms.com" value="Wildberries">Wildberries</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Shopee">Shopee</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Burger King">Burger King</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="inDriver">inDriver</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, sms-acktiwator.ru, give-sms.com" value="JD.com">JD.com</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, vak-sms.com" value="Lenta">Lenta</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, sms-acktiwator.ru, vak-sms.com" value="Deliveroo">Deliveroo</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, sms-acktiwator.ru, vak-sms.com" value="CoinBase">CoinBase</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, vak-sms.com" value="DodoPizza">DodoPizza</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Craigslist">Craigslist</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Grab">Grab</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, give-sms.com" value="Tango">Tango</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="MVideo">MVideo</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Taobao">Taobao</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Hezzl">Hezzl</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Dent">Dent</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru, vak-sms.com, give-sms.com" value="Douyin">Douyin</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru" value="Wolt">Wolt</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru" value="Rambler">Rambler</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, give-sms.com" value="PGbonus">PGbonus</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, give-sms.com" value="MEGA">MEGA</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Keybase">Keybase</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="NTT Game">NTT Game</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Truecaller">Truecaller</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Globus">Globus</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Prom.ua">Prom.ua</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, vak-sms.com, give-sms.com" value="Karusel">Karusel</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, give-sms.com" value="Happn">Happn</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, cheapsms.ru, 365sms.ru, sms-man.ru, activation.pw, vak-sms.com" value="Magnolia">Magnolia</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Weibo">Weibo</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Wish">Wish</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="PaddyPower">PaddyPower</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="РСА">РСА</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Foody">Foody</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="888casino">888casino</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="WestStein">WestStein</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru" value="OfferUp">OfferUp</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Amasia">Amasia</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru, give-sms.com" value="Vernyi">Vernyi</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru" value="Apple">Apple</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="BitClout">BitClout</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Glovo">Glovo</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, give-sms.com" value="Premium.one">Premium.one</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Kufar.by">Kufar.by</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, sms-acktiwator.ru" value="EasyPay">EasyPay</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru" value="Pyro Music">Pyro Music</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="CliQQ">CliQQ</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru" value="Ticketmaster">Ticketmaster</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Miratorg">Miratorg</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru" value="InboxLv">InboxLv</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru" value="MyLove">MyLove</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms.kopeechka.store, onlinesim.ru" value="RuTube">RuTube</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Quipp">Quipp</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, give-sms.com" value="MTS CashBack">MTS CashBack</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru" value="Paycell">Paycell</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, give-sms.com" value="YouStar">YouStar</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="OffGamers">OffGamers</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Hily">Hily</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, sms-acktiwator.ru" value="SneakersnStuff">SneakersnStuff</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Dostavista">Dostavista</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Rediffmail">Rediffmail</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Mercado">Mercado</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com, vak-sms.com" value="Monese">Monese</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Hopi">Hopi</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="JustDating">JustDating</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Pairs">Pairs</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Touchance">Touchance</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Tosla">Tosla</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Ininal">Ininal</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="CDKeys">CDKeys</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="AVON">AVON</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="MyFishka">MyFishka</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Zalo">Zalo</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, activation.pw, smspva.com, onlinesim.ru" value="LiveScore">LiveScore</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Global24">Global24</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Haraj">Haraj</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Taksheel">Taksheel</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Getir">Getir</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Faberlic">Faberlic</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru" value="Potato Chat">Potato Chat</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, vak-sms.com" value="Auchan">Auchan</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="IQOS">IQOS</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, activation.pw, smspva.com, onlinesim.ru" value="1688">1688</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Clubhouse">Clubhouse</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, smsvk.net, 365sms.ru, activation.pw, onlinesim.ru" value="Kwai">Kwai</option>
					<option title="sms-activate.ru, smshub.org, smsvk.net, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Goods">Goods</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru, vak-sms.com" value="Vkusvill">Vkusvill</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru, vak-sms.com" value="KazanExpress">KazanExpress</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru, vak-sms.com" value="SberMarket">SberMarket</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="ZdravCity">ZdravCity</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Kolesa.kz">Kolesa.kz</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Onliner.by">Onliner.by</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Ukrnet">Ukrnet</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Q12 Trivia">Q12 Trivia</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="SSOid.net">SSOid.net</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Olacabs">Olacabs</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="MyMusicTaste">MyMusicTaste</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Surveytime">Surveytime</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="IVI">IVI</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="BillMill">BillMill</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Okta">Okta</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Fiqsy">Fiqsy</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="KuCoinPlay">KuCoinPlay</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Icrypex">Icrypex</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Baidu">Baidu</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="GlobalTel">GlobalTel</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Socios">Socios</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Wmaraci">Wmaraci</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="Yemeksepeti">Yemeksepeti</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="myGLO">myGLO</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru" value="ezBuy">ezBuy</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="CoinField">CoinField</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Airtel">Airtel</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru" value="Miloan">Miloan</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="Kotak811">Kotak811</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="Trendyol">Trendyol</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="SnappFood">SnappFood</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="NCsoft">NCsoft</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="PaySend">PaySend</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="JKF">JKF</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Gamer">Gamer</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru" value="Huya">Huya</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="SheerID">SheerID</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="99app">99app</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="CAIXA">CAIXA</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="Swvl">Swvl</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="hamrahaval">hamrahaval</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Gamekit">Gamekit</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw" value="Şikayet var">Şikayet var</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Agroinform">Agroinform</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="HumbleBundle">HumbleBundle</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="CafeBazaar">CafeBazaar</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Gittigidiyor">Gittigidiyor</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="mzadqatar">mzadqatar</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Algida">Algida</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, vak-sms.com" value="Cita Previa">Cita Previa</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Dream11">Dream11</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Oriflame">Oriflame</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Bykea">Bykea</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Immowelt">Immowelt</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Digikala">Digikala</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com" value="Wing Money">Wing Money</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Yaay">Yaay</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="GameArena">GameArena</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="PaxFuL">PaxFuL</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, give-sms.com" value="Aitu">Aitu</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, smspva.com, onlinesim.ru" value="MOMO">MOMO</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru" value="Eneba">Eneba</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, activation.pw, onlinesim.ru" value="Douyu">Douyu</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="Uklon">Uklon</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw, smspva.com" value="MoneyLion">MoneyLion</option>
					<option title="sms-activate.ru, smshub.org, smsvk.net, 365sms.ru, activation.pw, sms.kopeechka.store" value="PingPong">PingPong</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="MapleSEA">MapleSEA</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, activation.pw, smspva.com, sms-acktiwator.ru" value="Lazada">Lazada</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru" value="TradingView">TradingView</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, activation.pw, smspva.com, onlinesim.ru" value="Fiverr">Fiverr</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru" value="DetskiyMir">DetskiyMir</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw, onlinesim.ru" value="FACEIT">FACEIT</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="ELDORADO">ELDORADO</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru, vak-sms.com" value="METRO">METRO</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, onlinesim.ru, vak-sms.com" value="Twitch">Twitch</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Monobank">Monobank</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="NRJ Music Awards">NRJ Music Awards</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Mos.ru">Mos.ru</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Dominos Pizza">Dominos Pizza</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Payberry">Payberry</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="RosaKhutor">RosaKhutor</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Kvartplata+">Kvartplata+</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="GG">GG</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Hepsiburada.com">Hepsiburada.com</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="MrGreen">MrGreen</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="PayTM">PayTM</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Dhani">Dhani</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="CMTcuzdan">CMTcuzdan</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="E bike Gewinnspiel">E bike Gewinnspiel</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="irancell">irancell</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Alfa">Alfa</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Disney Hotstar">Disney Hotstar</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="cryptocom">cryptocom</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru" value="Bitaqaty">Bitaqaty</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Primaries 2020">Primaries 2020</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="VitaExpress">VitaExpress</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Picpay">Picpay</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Blued">Blued</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="SpotHit">SpotHit</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Brand20.ua">Brand20.ua</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Powerkredite">Powerkredite</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Bisu">Bisu</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="PurePlatfrom">PurePlatfrom</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Banqi">Banqi</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Mobile01">Mobile01</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, smspva.com" value="Verse">Verse</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru" value="OnTaxi">OnTaxi</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, sms-acktiwator.ru" value="Hotline">Hotline</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru" value="Tatneft">Tatneft</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, activation.pw" value="Nifty">Nifty</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, sms-acktiwator.ru" value="Rozetka">Rozetka</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw" value="Yubo">Yubo</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, smspva.com, onlinesim.ru" value="LYKA">LYKA</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, onlinesim.ru" value="Stoloto">Stoloto</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru, activation.pw" value="Whoosh">Whoosh</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, smspva.com" value="BetFair">BetFair</option>
					<option title="sms-activate.ru, smshub.org, sms-man.ru, activation.pw, smspva.com" value="FastMail">FastMail</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, sms-acktiwator.ru" value="HandyPick">HandyPick</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw, vak-sms.com" value="GroupMe">GroupMe</option>
					<option title="5sim.net, cheapsms.ru, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Blockchain">Blockchain</option>
					<option title="cheapsms.ru, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="Fotostrana">Fotostrana</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="dbrUA">dbrUA</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="Humta">Humta</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="Divar">Divar</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="Carousell">Carousell</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="RRSA">RRSA</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="Banks">Banks</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="Skroutz">Skroutz</option>
					<option title="sms-activate.ru, smshub.org, sms-man.ru, activation.pw" value="GalaxyWin">GalaxyWin</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, onlinesim.ru" value="Likee">Likee</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, sms-acktiwator.ru" value="CityBase">CityBase</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, sms-acktiwator.ru" value="YouGotaGift">YouGotaGift</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, activation.pw" value="iQIYI">iQIYI</option>
					<option title="sms-activate.ru, smshub.org, sms-man.ru, activation.pw" value="IFood">IFood</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, onlinesim.ru" value="Switips">Switips</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, vak-sms.com" value="Paysafecard">Paysafecard</option>
					<option title="sms-activate.ru, smshub.org, sms-man.ru, activation.pw" value="GoFundMe">GoFundMe</option>
					<option title="sms-activate.ru, smshub.org, activation.pw, sms-acktiwator.ru" value="BIP Messenger">BIP Messenger</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru, vak-sms.com" value="Revolut">Revolut</option>
					<option title="sms-activate.ru, smshub.org, cheapsms.ru, 365sms.ru" value="SberApteka">SberApteka</option>
					<option title="sms-activate.ru, smshub.org, smspva.com, sms-acktiwator.ru" value="Kaggle">Kaggle</option>
					<option title="5sim.net, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="GameFlip">GameFlip</option>
					<option title="5sim.net, sms-reg.com, onlinesim.ru, sms-acktiwator.ru" value="Nimses">Nimses</option>
					<option title="5sim.net, cheapsms.ru, onlinesim.ru, sms-acktiwator.ru" value="Okey">Okey</option>
					<option title="5sim.net, smspva.com, onlinesim.ru, vak-sms.com" value="Signal">Signal</option>
					<option title="5sim.net, sms.kopeechka.store, onlinesim.ru, sms-acktiwator.ru" value="TanTan">TanTan</option>
					<option title="smsvk.net, smspva.com, onlinesim.ru, sms-acktiwator.ru" value="TaxiMaxim">TaxiMaxim</option>
					<option title="cheapsms.ru, onlinesim.ru, sms-acktiwator.ru, vak-sms.com" value="Beget">Beget</option>
					<option title="cheapsms.ru, smspva.com, sms-acktiwator.ru, vak-sms.com" value="WebMoney">WebMoney</option>
					<option title="sms-reg.com, smspva.com, onlinesim.ru, vak-sms.com" value="Badoo">Badoo</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Ziglu">Ziglu</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Allegro">Allegro</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Gabi">Gabi</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Quack">Quack</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Mocospace">Mocospace</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Dundle">Dundle</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Onet">Onet</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="LightChat">LightChat</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Meta">Meta</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="JamesDelivery">JamesDelivery</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="ShellBox">ShellBox</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="RedBook">RedBook</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Trip">Trip</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Akulaku">Akulaku</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="KeyPay">KeyPay</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Gojek">Gojek</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="ChaingeFinance">ChaingeFinance</option>
					<option title="sms-activate.ru, smshub.org, activation.pw" value="Iwplay">Iwplay</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru" value="NimoTV">NimoTV</option>
					<option title="sms-activate.ru, smshub.org, 365sms.ru" value="Stripe">Stripe</option>
					<option title="sms-activate.ru, smshub.org, sms-acktiwator.ru" value="Lidl">Lidl</option>
					<option title="sms-activate.ru, smshub.org, sms.kopeechka.store" value="Band">Band</option>
					<option title="5sim.net, cheapsms.ru, onlinesim.ru" value="Dixy">Dixy</option>
					<option title="5sim.net, smspva.com, sms-acktiwator.ru" value="iCard">iCard</option>
					<option title="5sim.net, onlinesim.ru, sms-acktiwator.ru" value="IOST">IOST</option>
					<option title="5sim.net, smspva.com, onlinesim.ru" value="Oracle">Oracle</option>
					<option title="5sim.net, onlinesim.ru, sms-acktiwator.ru" value="YouDo">YouDo</option>
					<option title="getsms.online, cheapsms.ru, onlinesim.ru" value="Pandao">Pandao</option>
					<option title="cheapsms.ru, onlinesim.ru, vak-sms.com" value="1Cupis">1Cupis</option>
					<option title="cheapsms.ru, onlinesim.ru, vak-sms.com" value="KFC">KFC</option>
					<option title="cheapsms.ru, onlinesim.ru, sms-acktiwator.ru" value="Steemit">Steemit</option>
					<option title="cheapsms.ru, sms-acktiwator.ru, vak-sms.com" value="YooMoney">YooMoney</option>
					<option title="cheapsms.ru, onlinesim.ru, sms-acktiwator.ru" value="Gorzdrav">Gorzdrav</option>
					<option title="sms-activate.ru, smshub.org" value="Eyecon">Eyecon</option>
					<option title="sms-activate.ru, smshub.org" value="GalaxyChat">GalaxyChat</option>
					<option title="sms-activate.ru, smshub.org" value="Iti">Iti</option>
					<option title="sms-activate.ru, smshub.org" value="Setel">Setel</option>
					<option title="sms-activate.ru, smshub.org" value="163.com">163.com</option>
					<option title="sms-activate.ru, smshub.org" value="Hermes">Hermes</option>
					<option title="sms-activate.ru, smshub.org" value="HeyBox">HeyBox</option>
					<option title="5sim.net, onlinesim.ru" value="Akelni">Akelni</option>
					<option title="5sim.net, sms-acktiwator.ru" value="BitTube">BitTube</option>
					<option title="5sim.net, sms.kopeechka.store" value="Domdara">Domdara</option>
					<option title="5sim.net, onlinesim.ru" value="Dukascopy">Dukascopy</option>
					<option title="5sim.net, onlinesim.ru" value="Electroneum">Electroneum</option>
					<option title="5sim.net, sms-acktiwator.ru" value="KomandaCard">KomandaCard</option>
					<option title="5sim.net, onlinesim.ru" value="Lianxin">Lianxin</option>
					<option title="5sim.net, vak-sms.com" value="OkCupid">OkCupid</option>
					<option title="5sim.net, onlinesim.ru" value="PokerMaster">PokerMaster</option>
					<option title="5sim.net, onlinesim.ru" value="PUBG">PUBG</option>
					<option title="5sim.net, onlinesim.ru" value="Winston">Winston</option>
					<option title="5sim.net, sms-man.ru" value="B4U Cabs">B4U Cabs</option>
					<option title="5sim.net, sms-man.ru" value="ClickEntregas">ClickEntregas</option>
					<option title="5sim.net, sms-man.ru" value="Nana">Nana</option>
					<option title="5sim.net, sms-man.ru" value="People.com">People.com</option>
					<option title="5sim.net, onlinesim.ru" value="Zomato">Zomato</option>
					<option title="cheapsms.ru, onlinesim.ru" value="Benzuber">Benzuber</option>
					<option title="cheapsms.ru, onlinesim.ru" value="GPNbonus">GPNbonus</option>
					<option title="cheapsms.ru, onlinesim.ru" value="Guideh">Guideh</option>
					<option title="cheapsms.ru, onlinesim.ru" value="Kontur">Kontur</option>
					<option title="cheapsms.ru, onlinesim.ru" value="Okko">Okko</option>
					<option title="cheapsms.ru, onlinesim.ru" value="RESO">RESO</option>
					<option title="cheapsms.ru, onlinesim.ru" value="T7 TAXI">T7 TAXI</option>
					<option title="cheapsms.ru, onlinesim.ru" value="TamTam">TamTam</option>
					<option title="cheapsms.ru, onlinesim.ru" value="Почта России">Почта России</option>
					<option title="sms-man.ru, onlinesim.ru" value="Hotmail">Hotmail</option>
					<option title="sms-man.ru, smspva.com" value="NetBet">NetBet</option>
					<option title="sms.kopeechka.store, onlinesim.ru" value="PP.UA">PP.UA</option>
					<option title="sms.kopeechka.store, onlinesim.ru" value="Pikabu">Pikabu</option>
					<option title="sms.kopeechka.store, onlinesim.ru" value="FetLife">FetLife</option>
					<option title="smspva.com, onlinesim.ru" value="PapaJohns">PapaJohns</option>
					<option title="smspva.com, onlinesim.ru" value="G2A">G2A</option>
					<option title="smspva.com, sms-acktiwator.ru" value="Raketa">Raketa</option>
					<option title="smspva.com, sms-acktiwator.ru" value="Hinge">Hinge</option>
					<option title="smspva.com, onlinesim.ru" value="LocalBitcoins">LocalBitcoins</option>
					<option title="smspva.com, onlinesim.ru" value="Lyft">Lyft</option>
					<option title="smspva.com, onlinesim.ru" value="E-NUM">E-NUM</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Lino.network">Lino.network</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Appbonus">Appbonus</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Sipnet">Sipnet</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="WOG.ua">WOG.ua</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Zadarma">Zadarma</option>
					<option title="onlinesim.ru, vak-sms.com" value="Plenty of Fish">Plenty of Fish</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Skype">Skype</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Auto.ru">Auto.ru</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="GetResponse">GetResponse</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Spaces">Spaces</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Qrooto">Qrooto</option>
					<option title="onlinesim.ru, vak-sms.com" value="iHerb">iHerb</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Sunlight">Sunlight</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="tabor.ru">tabor.ru</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="LDinfo">LDinfo</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="4game">4game</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="QIP">QIP</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Loveplanet">Loveplanet</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="PetrI">PetrI</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Gem4me">Gem4me</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="ProDoctorov">ProDoctorov</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="FarPost">FarPost</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Taxify">Taxify</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="ihc.ru">ihc.ru</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Sprinthost">Sprinthost</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Vscale">Vscale</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Lukoil">Lukoil</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Sony">Sony</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="PMSM">PMSM</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Studwork">Studwork</option>
					<option title="onlinesim.ru, vak-sms.com" value="ALLES Bonus">ALLES Bonus</option>
					<option title="onlinesim.ru, vak-sms.com" value="Bumble">Bumble</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="GoGo">GoGo</option>
					<option title="onlinesim.ru, sms-acktiwator.ru" value="Parimatch">Parimatch</option>
					<option title="cheapsms.ru, onlinesim.ru" value="1xStavka">1xStavka</option>
					<option title="sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru, sms-acktiwator.ru" value="1xBet">1xBet</option>
					<option title="sms-activate.ru, sms-man.ru, smspva.com, vak-sms.com" value="32red">32red</option>
					<option title="smshub.org, 5sim.net, 365sms.ru, activation.pw" value="23red">23red</option>
					<option title="5sim.net, onlinesim.ru, sms-acktiwator.ru" value="Azino777">Azino777</option>
					<option title="5sim.net, onlinesim.ru, sms-acktiwator.ru" value="Azino888">Azino888</option>
					<option title="cheapsms.ru, onlinesim.ru" value="Vulkan">Vulkan</option>
				  </select>
				</span>
			  </div>
			</div>
			<label class="control-label text-right tr" style="padding-top:5px !important;">Site</label>
		  </div>
		</form>
	</div>
	<%= _.template($('#input_constructor').html())({
		id: "country",
		description: tr("Country"),
		default_selector: "string",
		disable_int: true,
		value_string: "RU",
		variants: [
			"RU<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("Russian Federation") + "</span>",
			"UA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("Ukraine") + "</span>",
			"KZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("Kazakhstan") + "</span>",
			"GB<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("United Kingdom") + "</span>",
			"DE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("Germany") + "</span>",
			"PL<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, vak-sms.com'>" + tr("Poland") + "</span>",
			"EE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("Estonia") + "</span>",
			"SE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com'>" + tr("Sweden") + "</span>",
			"ID<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru'>" + tr("Indonesia") + "</span>",
			"RO<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru'>" + tr("Romania") + "</span>",
			"LT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, vak-sms.com'>" + tr("Lithuania") + "</span>",
			"NL<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, vak-sms.com'>" + tr("Netherlands") + "</span>",
			"LV<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, vak-sms.com'>" + tr("Latvia") + "</span>",
			"ES<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, vak-sms.com'>" + tr("Spain") + "</span>",
			"FR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, vak-sms.com'>" + tr("France") + "</span>",
			"MD<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru, sms-acktiwator.ru'>" + tr("Moldova") + "</span>",
			"PH<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Philippines") + "</span>",
			"VN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Vietnam") + "</span>",
			"KG<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Kyrgyzstan") + "</span>",
			"NG<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Nigeria") + "</span>",
			"IE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Ireland") + "</span>",
			"HT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Haiti") + "</span>",
			"AR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Argentina") + "</span>",
			"BY<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru'>" + tr("Belarus") + "</span>",
			"MX<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Mexico") + "</span>",
			"BR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Brazil") + "</span>",
			"CY<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("Cyprus") + "</span>",
			"PT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, vak-sms.com'>" + tr("Portugal") + "</span>",
			"US<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com, onlinesim.ru'>" + tr("United States") + "</span>",
			"CN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms-reg.com'>" + tr("China") + "</span>",
			"MY<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Malaysia") + "</span>",
			"KE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Kenya") + "</span>",
			"IL<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Israel") + "</span>",
			"EG<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Egypt") + "</span>",
			"EG (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("Egypt") + "</span>",
			"IN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("India") + "</span>",
			"IN (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("India") + "</span>",
			"KH<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Cambodia") + "</span>",
			"LA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Lao People's Democratic Republic") + "</span>",
			"CI<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Cote d'Ivoire") + "</span>",
			"YE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Yemen") + "</span>",
			"ZA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("South Africa") + "</span>",
			"CO<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Colombia") + "</span>",
			"CA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Canada") + "</span>",
			"CA (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("Canada") + "</span>",
			"MA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Morocco") + "</span>",
			"GH<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Ghana") + "</span>",
			"GH (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("Ghana") + "</span>",
			"UZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, sms-acktiwator.ru'>" + tr("Uzbekistan") + "</span>",
			"IQ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Iraq") + "</span>",
			"IQ (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("Iraq") + "</span>",
			"AT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Austria") + "</span>",
			"CZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Czech Republic") + "</span>",
			"PK<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Pakistan") + "</span>",
			"PK (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("Pakistan") + "</span>",
			"MN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Mongolia") + "</span>",
			"NP<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Nepal") + "</span>",
			"HN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Honduras") + "</span>",
			"BO<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Bolivia, plurinational state of") + "</span>",
			"DO<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, smspva.com'>" + tr("Dominican Republic") + "</span>",
			"BF<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Burkina Faso") + "</span>",
			"MM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Myanmar") + "</span>",
			"CD<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Congo, Democratic Republic of the") + "</span>",
			"GM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Gambia") + "</span>",
			"RS<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Serbia") + "</span>",
			"CM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Cameroon") + "</span>",
			"CM (Virtual)<br/><span style='color:gray' title='smspva.com'>" + tr("Cameroon") + "</span>",
			"TD<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Chad") + "</span>",
			"HR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Croatia") + "</span>",
			"TH<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Thailand") + "</span>",
			"SA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Saudi Arabia") + "</span>",
			"TW<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Taiwan, Province of China") + "</span>",
			"DZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Algeria") + "</span>",
			"BD<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Bangladesh") + "</span>",
			"SN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Senegal") + "</span>",
			"TR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Turkey") + "</span>",
			"LK<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Sri Lanka") + "</span>",
			"PE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Peru") + "</span>",
			"NZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw, smspva.com'>" + tr("New Zealand") + "</span>",
			"GN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Guinea") + "</span>",
			"ML<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Mali") + "</span>",
			"VE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Venezuela") + "</span>",
			"AF<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Afghanistan") + "</span>",
			"UG<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Uganda") + "</span>",
			"AO<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Angola") + "</span>",
			"PG<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Papua New Guinea") + "</span>",
			"MZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Mozambique") + "</span>",
			"PY<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Paraguay") + "</span>",
			"TN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Tunisia") + "</span>",
			"NI<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Nicaragua") + "</span>",
			"GT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Guatemala") + "</span>",
			"AE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("United Arab Emirates") + "</span>",
			"ZW<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Zimbabwe") + "</span>",
			"SV<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("El Salvador") + "</span>",
			"LY<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Libyan Arab Jamahiriya") + "</span>",
			"JM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Jamaica") + "</span>",
			"TT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Trinidad and Tobago") + "</span>",
			"EC<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Ecuador") + "</span>",
			"MR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Mauritania") + "</span>",
			"SL<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Sierra Leone") + "</span>",
			"BJ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Benin") + "</span>",
			"BW<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Botswana") + "</span>",
			"DM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Dominica") + "</span>",
			"GR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Greece") + "</span>",
			"GY<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Guyana") + "</span>",
			"LR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Liberia") + "</span>",
			"SR<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Suriname") + "</span>",
			"TJ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Tajikistan") + "</span>",
			"RE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Reunion") + "</span>",
			"AM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Armenia") + "</span>",
			"CG<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Congo") + "</span>",
			"GA<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Gabon") + "</span>",
			"BT<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Bhutan") + "</span>",
			"MV<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Maldives") + "</span>",
			"TM<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Turkmenistan") + "</span>",
			"FI<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw, smspva.com, vak-sms.com'>" + tr("Finland") + "</span>",
			"AW<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Aruba") + "</span>",
			"IR<br/><span style='color:gray' title='smshub.org, 5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Iran, Islamic Republic of") + "</span>",
			"TZ<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw'>" + tr("Tanzania, United Republic Of") + "</span>",
			"HK<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw'>" + tr("Hong Kong") + "</span>",
			"BA<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw, smspva.com'>" + tr("Bosnia and Herzegovina") + "</span>",
			"JO<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw'>" + tr("Jordan") + "</span>",
			"BN<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Brunei Darussalam") + "</span>",
			"GE<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw'>" + tr("Georgia") + "</span>",
			"CL<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw, smspva.com'>" + tr("Chile") + "</span>",
			"LB<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru, activation.pw'>" + tr("Lebanon") + "</span>",
			"MU<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, activation.pw'>" + tr("Mauritius") + "</span>",
			"AZ<br/><span style='color:gray' title='5sim.net, 365sms.ru, sms-man.ru, activation.pw, onlinesim.ru'>" + tr("Azerbaijan") + "</span>",
			"US (Virtual)<br/><span style='color:gray' title='sms-activate.ru, smshub.org, 365sms.ru, activation.pw'>" + tr("United States") + "</span>",
			"MO<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Macao") + "</span>",
			"SI<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Slovenia") + "</span>",
			"ET<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Ethiopia") + "</span>",
			"BE<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Belgium") + "</span>",
			"BG<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Bulgaria") + "</span>",
			"HU<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Hungary") + "</span>",
			"IT<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Italy") + "</span>",
			"TL<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Timor-Leste") + "</span>",
			"CR<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Costa Rica") + "</span>",
			"PR<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Puerto Rico") + "</span>",
			"TG<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Togo") + "</span>",
			"KW<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Kuwait") + "</span>",
			"SZ<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Eswatini") + "</span>",
			"OM<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Oman") + "</span>",
			"QA<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Qatar") + "</span>",
			"PA<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Panama") + "</span>",
			"BB<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Barbados") + "</span>",
			"BI<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Burundi") + "</span>",
			"BS<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Bahamas") + "</span>",
			"BZ<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Belize") + "</span>",
			"CF<br/><span style='color:gray' title='sms-activate.ru, sms-man.ru, activation.pw'>" + tr("Central African Republic") + "</span>",
			"GD<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Grenada") + "</span>",
			"GW<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Guinea-Bissau") + "</span>",
			"KM<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Comoros") + "</span>",
			"KN<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Saint Kitts and Nevis") + "</span>",
			"LS<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Lesotho") + "</span>",
			"MW<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Malawi") + "</span>",
			"NA<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Namibia") + "</span>",
			"NE<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Niger") + "</span>",
			"RW<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Rwanda") + "</span>",
			"SK<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Slovakia") + "</span>",
			"BH<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Bahrain") + "</span>",
			"ZM<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Zambia") + "</span>",
			"SO<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Somalia") + "</span>",
			"AL<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Albania") + "</span>",
			"UY<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Uruguay") + "</span>",
			"GP<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Guadeloupe") + "</span>",
			"GF<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("French Guiana") + "</span>",
			"LC<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Saint Lucia") + "</span>",
			"LU<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Luxembourg") + "</span>",
			"VC<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Saint Vincent and the Grenadines") + "</span>",
			"GQ<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Equatorial Guinea") + "</span>",
			"DJ<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Djibouti") + "</span>",
			"AG<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Antigua and Barbuda") + "</span>",
			"KY<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Cayman Islands") + "</span>",
			"ME<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Montenegro") + "</span>",
			"CH<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Switzerland") + "</span>",
			"NO<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Norway") + "</span>",
			"AU<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Australia") + "</span>",
			"ER<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Eritrea") + "</span>",
			"SS<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("South Sudan") + "</span>",
			"ST<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Sao Tome and Principe") + "</span>",
			"MS<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Montserrat") + "</span>",
			"AI<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Anguilla") + "</span>",
			"MK<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Macedonia, The Former Yugoslav Republic Of") + "</span>",
			"SC<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Seychelles") + "</span>",
			"NC<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("New Caledonia") + "</span>",
			"CV<br/><span style='color:gray' title='sms-activate.ru, 5sim.net, sms-man.ru, activation.pw'>" + tr("Cape Verde") + "</span>",
			"SD<br/><span style='color:gray' title='smshub.org, 5sim.net, sms-man.ru, activation.pw'>" + tr("Sudan") + "</span>",
			"IS<br/><span style='color:gray' title='sms-activate.ru, sms-man.ru, activation.pw'>" + tr("Iceland") + "</span>",
			"MC<br/><span style='color:gray' title='sms-activate.ru, sms-man.ru, activation.pw'>" + tr("Monaco") + "</span>",
			"BM<br/><span style='color:gray' title='smshub.org, 365sms.ru, activation.pw'>" + tr("Bermuda") + "</span>",
			"CU<br/><span style='color:gray' title='5sim.net, sms-man.ru, activation.pw'>" + tr("Cuba") + "</span>",
			"JP<br/><span style='color:gray' title='5sim.net, sms-man.ru, activation.pw'>" + tr("Japan") + "</span>",
			"MG<br/><span style='color:gray' title='5sim.net, sms-man.ru, activation.pw'>" + tr("Madagascar") + "</span>",
			"SY<br/><span style='color:gray' title='5sim.net, sms-man.ru, activation.pw'>" + tr("Syrian Arab Republic") + "</span>",
			"KR<br/><span style='color:gray' title='sms-activate.ru, smshub.org'>" + tr("Korea, Republic of") + "</span>",
			"FJ<br/><span style='color:gray' title='smshub.org'>" + tr("Fiji") + "</span>",
			"WS<br/><span style='color:gray' title='5sim.net'>" + tr("Samoa") + "</span>",
			"SG<br/><span style='color:gray' title='5sim.net'>" + tr("Singapore") + "</span>",
			"SB<br/><span style='color:gray' title='5sim.net'>" + tr("Solomon Islands") + "</span>",
			"TO<br/><span style='color:gray' title='5sim.net'>" + tr("Tonga") + "</span>",
			"TC<br/><span style='color:gray' title='5sim.net'>" + tr("Turks and Caicos Islands") + "</span>",
			"VG<br/><span style='color:gray' title='5sim.net'>" + tr("Virgin Islands, British") + "</span>",
			"PS<br/><span style='color:gray' title='365sms.ru'>" + tr("Palestinian Territory, Occupied") + "</span>",
			"EH<br/><span style='color:gray' title='activation.pw'>" + tr("Western Sahara") + "</span>"
		],
		help: {
			description: tr("Optional parameter.") + " " + tr("Country of the number."),
			examples: [
				{code: "RU", description: tr("Russian Federation")},
				{code: "UA", description: tr("Ukraine")},
				{code: "US", description: tr("United States")},
				{code: tr("Empty string"), description: tr("Depends on the service used, maybe the last used country or some specific country, you can find out more in the description of the API of the service.")}
			]
		}
	}) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<%= _.template($('#input_constructor').html())({
			id: "operator",
			description: tr("Operator"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Optional parameter.") + " " + tr("Cellular operator of the number, in the form in which it is perceived by the SMS receiving service."),
				examples: [
					{code: "megafon", description: tr("MegaFon")},
					{code: "kyivstar", description: tr("Kyivstar")},
					{code: "tele2", description: "Tele2"},
					{code: tr("Empty string"), description: tr("Use any operator.")}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "customSite",
			description: tr("Custom site"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Optional parameter.") + " " + tr("Custom value of the site, in the form in which it is perceived by the SMS receiving service. If this parameter is specified, then it will be used instead of the \"Site\" parameter and sent to the service without preliminary processing."),
				examples: [
					{code: "wa", description: "WhatsApp"},
					{code: "tg", description: "Telegram"},
					{code: "go", description: "Google"},
					{code: tr("Empty string"), description: tr("Use value from \"") + tr("Site") + tr("\" parameter.")}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "customCountry",
			description: tr("Custom country"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Optional parameter.") + " " + tr("Custom value of the country, in the form in which it is perceived by the SMS receiving service. If this parameter is specified, then it will be used instead of the \"Country\" parameter and sent to the service without preliminary processing."),
				examples: [
					{code: "0", description: tr("Russian Federation")},
					{code: "1", description: tr("Ukraine")},
					{code: "187", description: tr("United States")},
					{code: tr("Empty string"), description: tr("Use value from \"") + tr("Country") + tr("\" parameter.")}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "serverUrl",
			description: tr("Server url"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Optional parameter.") + " " + tr("Url of the SMS receiving service server. Use this parameter to specify the url of the server, if the required service is not in the list of available ones, but it works through an API similar to the selected service."),
				examples: [
					{code: "https://sms.org"},
					{code: "http://receive-sms.com"},
					{code: "http://127.0.0.1:8888"},
					{code: tr("Empty string"), description: tr("Use default server url, https://sms-activate.ru for sms-activate.ru, etc")}
				]
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "SMS_NUMBERS_COUNT",
		help: {
			description:tr("Variable in which, after successful execution of the action, the count of available numbers will be written."),
			examples: [
				{code: 137},
				{code: 549},
				{code: 1596},
				{code: 0, description: tr("The specified service currently does not have numbers with the specified parameters")}
			]
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get the count of available numbers on the SMS receiving service.</div>
	<div class="tr tooltip-paragraph-fold">This action will return a number equal to the number of available numbers corresponding to the specified parameters on the SMS receiving service.</div>
	<div class="tr tooltip-paragraph-fold">You can specify your value for the operator, site and country in the corresponding parameters located in the additional settings. Please note that these values must be specified in the form in which the service perceives them, they will be sent as you specified them.</div>
	<div class="tr tooltip-paragraph-fold">If the required service is not in the list of available ones, but it works through an API similar to the selected service, then you can specify its server url in the corresponding parameter located in the additional settings.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", use_timeout:true, visible:true}) %>