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
			"sms-reg.com",
			"vak-sms.com",
			"give-sms.com"
			"getsms.online",
			"sms-man.ru",
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
			description: tr("Service for receiving SMS, from which need to get a phone number."),
			examples: [
				{code: "sms-activate.ru", description: "https://sms-activate.ru"},
				{code: "smshub.org", description: "https://smshub.org"},
				{code: "sms-reg.com", description: "https://sms-reg.com"}
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
					<option value="Other" selected="selected">Other</option>
					<option value="VK">VK</option>
					<option value="WhatsApp">WhatsApp</option>
					<option value="Viber">Viber</option>
					<option value="Telegram">Telegram</option>
					<option value="WeChat">WeChat</option>
					<option value="Google">Google</option>
					<option value="Facebook">Facebook</option>
					<option value="Instagram">Instagram</option>
					<option value="Microsoft">Microsoft</option>
					<option value="Twitter">Twitter</option>
					<option value="Uber">Uber</option>
					<option value="Mail.ru">Mail.ru</option>
					<option value="Yahoo">Yahoo</option>
					<option value="KakaoTalk">KakaoTalk</option>
					<option value="Aol">Aol</option>
					<option value="Naver">Naver</option>
					<option value="Avito">Avito</option>
					<option value="Yandex">Yandex</option>
					<option value="YandexGo">YandexGo</option>
					<option value="Yandex.Eda">Yandex.Eda</option>
					<option value="YooMoney">YooMoney</option>
					<option value="Steam">Steam</option>
					<option value="Tinder">Tinder</option>
					<option value="Mamba">Mamba</option>
					<option value="Imo">Imo</option>
					<option value="TikTok">TikTok</option>
					<option value="Ok.ru">Ok.ru</option>
					<option value="DrugVokrug">DrugVokrug</option>
					<option value="5ka">5ka</option>
					<option value="Discord">Discord</option>
					<option value="ProtonMail">ProtonMail</option>
					<option value="Grindr">Grindr</option>
					<option value="Gett">Gett</option>
					<option value="LINE Messenger">LINE Messenger</option>
					<option value="Tencent QQ">Tencent QQ</option>
					<option value="Magnit">Magnit</option>
					<option value="Netflix">Netflix</option>
					<option value="Amazon">Amazon</option>
					<option value="CityMobil">CityMobil</option>
					<option value="OZON">OZON</option>
					<option value="BlaBlaCar">BlaBlaCar</option>
					<option value="Alibaba">Alibaba</option>
					<option value="Aliexpress">Aliexpress</option>
					<option value="AliPay">AliPay</option>
					<option value="Nike">Nike</option>
					<option value="Qiwi">Qiwi</option>
					<option value="OLX">OLX</option>
					<option value="Youla">Youla</option>
					<option value="Airbnb">Airbnb</option>
					<option value="MeetMe">MeetMe</option>
					<option value="LinkedIN">LinkedIN</option>
					<option value="Yalla">Yalla</option>
					<option value="Skout">Skout</option>
					<option value="Perekrestok">Perekrestok</option>
					<option value="Drom.ru">Drom.ru</option>
					<option value="McDonalds">McDonalds</option>
					<option value="HQ Trivia">HQ Trivia</option>
					<option value="Delivery Club">Delivery Club</option>
					<option value="SEOsprint">SEOsprint</option>
					<option value="SportMaster">SportMaster</option>
					<option value="Careem">Careem</option>
					<option value="Snapchat">Snapchat</option>
					<option value="Bolt">Bolt</option>
					<option value="FoodPanda">FoodPanda</option>
					<option value="Papara">Papara</option>
					<option value="eBay">eBay</option>
					<option value="PayPal">PayPal</option>
					<option value="Blizzard">Blizzard</option>
					<option value="DiDi">DiDi</option>
					<option value="Adidas">Adidas</option>
					<option value="Samokat">Samokat</option>
					<option value="POF.com">POF.com</option>
					<option value="ICQ">ICQ</option>
					<option value="MiChat">MiChat</option>
					<option value="Zoho">Zoho</option>
					<option value="Rambler">Rambler</option>
					<option value="BIGO LIVE">BIGO LIVE</option>
					<option value="Wildberries">Wildberries</option>
					<option value="Shopee">Shopee</option>
					<option value="Burger King">Burger King</option>
					<option value="inDriver">inDriver</option>
					<option value="JD.com">JD.com</option>
					<option value="Lenta">Lenta</option>
					<option value="CoinBase">CoinBase</option>
					<option value="DodoPizza">DodoPizza</option>
					<option value="Grab">Grab</option>
					<option value="MVideo">MVideo</option>
					<option value="Vernyi">Vernyi</option>
					<option value="Taobao">Taobao</option>
					<option value="Hezzl">Hezzl</option>
					<option value="Dent">Dent</option>
					<option value="Premium.one">Premium.one</option>
					<option value="Douyin">Douyin</option>
					<option value="Miratorg">Miratorg</option>
					<option value="PGbonus">PGbonus</option>
					<option value="MEGA">MEGA</option>
					<option value="Keybase">Keybase</option>
					<option value="Truecaller">Truecaller</option>
					<option value="Globus">Globus</option>
					<option value="Prom.ua">Prom.ua</option>
					<option value="Karusel">Karusel</option>
					<option value="Magnolia">Magnolia</option>
					<option value="Weibo">Weibo</option>
					<option value="MTS CashBack">MTS CashBack</option>
					<option value="Deliveroo">Deliveroo</option>
					<option value="РСА">РСА</option>
					<option value="888casino">888casino</option>
					<option value="Tango">Tango</option>
					<option value="Apple">Apple</option>
					<option value="Clubhouse">Clubhouse</option>
					<option value="BitClout">BitClout</option>
					<option value="Kufar.by">Kufar.by</option>
					<option value="EasyPay">EasyPay</option>
					<option value="Pyro Music">Pyro Music</option>
					<option value="Wolt">Wolt</option>
					<option value="CliQQ">CliQQ</option>
					<option value="Ticketmaster">Ticketmaster</option>
					<option value="InboxLv">InboxLv</option>
					<option value="NTT Game">NTT Game</option>
					<option value="MyLove">MyLove</option>
					<option value="Happn">Happn</option>
					<option value="RuTube">RuTube</option>
					<option value="PaddyPower">PaddyPower</option>
					<option value="myGLO">myGLO</option>
					<option value="Dostavista">Dostavista</option>
					<option value="Monese">Monese</option>
					<option value="JustDating">JustDating</option>
					<option value="AVON">AVON</option>
					<option value="Craigslist">Craigslist</option>
					<option value="Foody">Foody</option>
					<option value="Zalo">Zalo</option>
					<option value="LiveScore">LiveScore</option>
					<option value="WestStein">WestStein</option>
					<option value="OfferUp">OfferUp</option>
					<option value="Getir">Getir</option>
					<option value="Faberlic">Faberlic</option>
					<option value="Potato Chat">Potato Chat</option>
					<option value="Amasia">Amasia</option>
					<option value="Auchan">Auchan</option>
					<option value="IQOS">IQOS</option>
					<option value="Mail.ru Group">Mail.ru Group</option>
					<option value="TradingView">TradingView</option>
					<option value="Kwai">Kwai</option>
					<option value="Goods">Goods</option>
					<option value="Glovo">Glovo</option>
					<option value="Vkusvill">Vkusvill</option>
					<option value="Kolesa.kz">Kolesa.kz</option>
					<option value="Onliner.by">Onliner.by</option>
					<option value="Ukrnet">Ukrnet</option>
					<option value="Q12 Trivia">Q12 Trivia</option>
					<option value="SSOid.net">SSOid.net</option>
					<option value="Olacabs">Olacabs</option>
					<option value="MyMusicTaste">MyMusicTaste</option>
					<option value="Surveytime">Surveytime</option>
					<option value="IVI">IVI</option>
					<option value="Quipp">Quipp</option>
					<option value="KuCoinPlay">KuCoinPlay</option>
					<option value="Wish">Wish</option>
					<option value="Baidu">Baidu</option>
					<option value="Paycell">Paycell</option>
					<option value="Yemeksepeti">Yemeksepeti</option>
					<option value="YouStar">YouStar</option>
					<option value="SneakersnStuff">SneakersnStuff</option>
					<option value="ezBuy">ezBuy</option>
					<option value="Rediffmail">Rediffmail</option>
					<option value="Miloan">Miloan</option>
					<option value="Mercado">Mercado</option>
					<option value="Kotak811">Kotak811</option>
					<option value="Hopi">Hopi</option>
					<option value="Trendyol">Trendyol</option>
					<option value="Pairs">Pairs</option>
					<option value="Touchance">Touchance</option>
					<option value="Tosla">Tosla</option>
					<option value="Ininal">Ininal</option>
					<option value="PaySend">PaySend</option>
					<option value="CDKeys">CDKeys</option>
					<option value="MyFishka">MyFishka</option>
					<option value="Huya">Huya</option>
					<option value="Global24">Global24</option>
					<option value="SheerID">SheerID</option>
					<option value="Swvl">Swvl</option>
					<option value="Haraj">Haraj</option>
					<option value="Taksheel">Taksheel</option>
					<option value="Gamekit">Gamekit</option>
					<option value="Şikayet var">Şikayet var</option>
					<option value="Cita Previa">Cita Previa</option>
					<option value="Oriflame">Oriflame</option>
					<option value="Wing Money">Wing Money</option>
					<option value="PaxFuL">PaxFuL</option>
					<option value="Aitu">Aitu</option>
					<option value="MOMO">MOMO</option>
					<option value="1688">1688</option>
					<option value="Douyu">Douyu</option>
					<option value="Uklon">Uklon</option>
					<option value="MoneyLion">MoneyLion</option>
					<option value="PingPong">PingPong</option>
					<option value="MapleSEA">MapleSEA</option>
					<option value="Lazada">Lazada</option>
					<option value="DetskiyMir">DetskiyMir</option>
					<option value="FACEIT">FACEIT</option>
					<option value="ELDORADO">ELDORADO</option>
					<option value="Whoosh">Whoosh</option>
					<option value="Sbermarket">Sbermarket</option>
					<option value="Fotostrana">Fotostrana</option>
					<option value="Monobank">Monobank</option>
					<option value="NRJ Music Awards">NRJ Music Awards</option>
					<option value="Mos.ru">Mos.ru</option>
					<option value="BillMill">BillMill</option>
					<option value="Okta">Okta</option>
					<option value="Fiqsy">Fiqsy</option>
					<option value="Icrypex">Icrypex</option>
					<option value="Dominos Pizza">Dominos Pizza</option>
					<option value="Payberry">Payberry</option>
					<option value="GlobalTel">GlobalTel</option>
					<option value="Socios">Socios</option>
					<option value="Wmaraci">Wmaraci</option>
					<option value="RosaKhutor">RosaKhutor</option>
					<option value="Kvartplata+">Kvartplata+</option>
					<option value="GG">GG</option>
					<option value="OffGamers">OffGamers</option>
					<option value="Hepsiburada.com">Hepsiburada.com</option>
					<option value="Hily">Hily</option>
					<option value="CoinField">CoinField</option>
					<option value="Airtel">Airtel</option>
					<option value="MrGreen">MrGreen</option>
					<option value="PayTM">PayTM</option>
					<option value="Dhani">Dhani</option>
					<option value="CMTcuzdan">CMTcuzdan</option>
					<option value="SnappFood">SnappFood</option>
					<option value="NCsoft">NCsoft</option>
					<option value="E bike Gewinnspiel">E bike Gewinnspiel</option>
					<option value="JKF">JKF</option>
					<option value="Gamer">Gamer</option>
					<option value="99app">99app</option>
					<option value="CAIXA">CAIXA</option>
					<option value="hamrahaval">hamrahaval</option>
					<option value="irancell">irancell</option>
					<option value="Alfa">Alfa</option>
					<option value="Disney Hotstar">Disney Hotstar</option>
					<option value="Agroinform">Agroinform</option>
					<option value="HumbleBundle">HumbleBundle</option>
					<option value="CafeBazaar">CafeBazaar</option>
					<option value="cryptocom">cryptocom</option>
					<option value="Gittigidiyor">Gittigidiyor</option>
					<option value="mzadqatar">mzadqatar</option>
					<option value="Algida">Algida</option>
					<option value="Primaries 2020">Primaries 2020</option>
					<option value="Dream11">Dream11</option>
					<option value="Bykea">Bykea</option>
					<option value="Immowelt">Immowelt</option>
					<option value="Digikala">Digikala</option>
					<option value="Yaay">Yaay</option>
					<option value="GameArena">GameArena</option>
					<option value="VitaExpress">VitaExpress</option>
					<option value="Picpay">Picpay</option>
					<option value="Blued">Blued</option>
					<option value="SpotHit">SpotHit</option>
					<option value="Brand20.ua">Brand20.ua</option>
					<option value="Powerkredite">Powerkredite</option>
					<option value="Bisu">Bisu</option>
					<option value="PurePlatfrom">PurePlatfrom</option>
					<option value="Banqi">Banqi</option>
					<option value="Mobile01">Mobile01</option>
					<option value="Eneba">Eneba</option>
					<option value="Verse">Verse</option>
					<option value="OnTaxi">OnTaxi</option>
					<option value="Hotline">Hotline</option>
					<option value="Tatneft">Tatneft</option>
					<option value="Nifty">Nifty</option>
					<option value="Rozetka">Rozetka</option>
					<option value="Fiverr">Fiverr</option>
					<option value="LYKA">LYKA</option>
					<option value="Stoloto">Stoloto</option>
					<option value="BIP Messenger">BIP Messenger</option>
					<option value="KazanExpress">KazanExpress</option>
					<option value="Blockchain">Blockchain</option>
					<option value="GameFlip">GameFlip</option>
					<option value="Nimses">Nimses</option>
					<option value="Okey">Okey</option>
					<option value="Signal">Signal</option>
					<option value="TanTan">TanTan</option>
					<option value="TaxiMaxim">TaxiMaxim</option>
					<option value="Beget">Beget</option>
					<option value="WebMoney">WebMoney</option>
					<option value="ZdravCity">ZdravCity</option>
					<option value="Badoo">Badoo</option>
					<option value="dbrUA">dbrUA</option>
					<option value="Bitaqaty">Bitaqaty</option>
					<option value="Humta">Humta</option>
					<option value="Divar">Divar</option>
					<option value="Carousell">Carousell</option>
					<option value="RRSA">RRSA</option>
					<option value="Banks">Banks</option>
					<option value="Skroutz">Skroutz</option>
					<option value="GalaxyWin">GalaxyWin</option>
					<option value="Likee">Likee</option>
					<option value="CityBase">CityBase</option>
					<option value="YouGotaGift">YouGotaGift</option>
					<option value="Yubo">Yubo</option>
					<option value="iQIYI">iQIYI</option>
					<option value="Switips">Switips</option>
					<option value="Paysafecard">Paysafecard</option>
					<option value="BetFair">BetFair</option>
					<option value="FastMail">FastMail</option>
					<option value="Dixy">Dixy</option>
					<option value="iCard">iCard</option>
					<option value="IOST">IOST</option>
					<option value="Oracle">Oracle</option>
					<option value="YouDo">YouDo</option>
					<option value="Pandao">Pandao</option>
					<option value="1Cupis">1Cupis</option>
					<option value="Steemit">Steemit</option>
					<option value="Gorzdrav">Gorzdrav</option>
					<option value="Spaces">Spaces</option>
					<option value="FarPost">FarPost</option>
					<option value="Ziglu">Ziglu</option>
					<option value="Allegro">Allegro</option>
					<option value="Gabi">Gabi</option>
					<option value="IFood">IFood</option>
					<option value="Quack">Quack</option>
					<option value="Mocospace">Mocospace</option>
					<option value="Dundle">Dundle</option>
					<option value="Onet">Onet</option>
					<option value="LightChat">LightChat</option>
					<option value="GoFundMe">GoFundMe</option>
					<option value="Meta">Meta</option>
					<option value="JamesDelivery">JamesDelivery</option>
					<option value="ShellBox">ShellBox</option>
					<option value="RedBook">RedBook</option>
					<option value="Trip">Trip</option>
					<option value="Akulaku">Akulaku</option>
					<option value="KeyPay">KeyPay</option>
					<option value="Gojek">Gojek</option>
					<option value="Akelni">Akelni</option>
					<option value="BitTube">BitTube</option>
					<option value="Domdara">Domdara</option>
					<option value="Dukascopy">Dukascopy</option>
					<option value="Electroneum">Electroneum</option>
					<option value="KomandaCard">KomandaCard</option>
					<option value="Lianxin">Lianxin</option>
					<option value="OkCupid">OkCupid</option>
					<option value="PayMaya">PayMaya</option>
					<option value="PokerMaster">PokerMaster</option>
					<option value="PUBG">PUBG</option>
					<option value="Winston">Winston</option>
					<option value="B4U Cabs">B4U Cabs</option>
					<option value="ClickEntregas">ClickEntregas</option>
					<option value="Nana">Nana</option>
					<option value="People.com">People.com</option>
					<option value="Zomato">Zomato</option>
					<option value="Benzuber">Benzuber</option>
					<option value="GPNbonus">GPNbonus</option>
					<option value="Guideh">Guideh</option>
					<option value="Kontur">Kontur</option>
					<option value="Okko">Okko</option>
					<option value="RESO">RESO</option>
					<option value="T7 TAXI">T7 TAXI</option>
					<option value="TamTam">TamTam</option>
					<option value="Почта России">Почта России</option>
					<option value="Hotmail">Hotmail</option>
					<option value="NetBet">NetBet</option>
					<option value="PP.UA">PP.UA</option>
					<option value="Pikabu">Pikabu</option>
					<option value="FetLife">FetLife</option>
					<option value="PapaJohns">PapaJohns</option>
					<option value="G2A">G2A</option>
					<option value="Raketa">Raketa</option>
					<option value="Hinge">Hinge</option>
					<option value="LocalBitcoins">LocalBitcoins</option>
					<option value="Lyft">Lyft</option>
					<option value="E-NUM">E-NUM</option>
					<option value="Lino.network">Lino.network</option>
					<option value="Appbonus">Appbonus</option>
					<option value="Sipnet">Sipnet</option>
					<option value="WOG.ua">WOG.ua</option>
					<option value="Zadarma">Zadarma</option>
					<option value="Plenty of Fish">Plenty of Fish</option>
					<option value="Skype">Skype</option>
					<option value="Auto.ru">Auto.ru</option>
					<option value="GetResponse">GetResponse</option>
					<option value="Qrooto">Qrooto</option>
					<option value="iHerb">iHerb</option>
					<option value="Sunlight">Sunlight</option>
					<option value="tabor.ru">tabor.ru</option>
					<option value="LDinfo">LDinfo</option>
					<option value="4game">4game</option>
					<option value="QIP">QIP</option>
					<option value="Loveplanet">Loveplanet</option>
					<option value="PetrI">PetrI</option>
					<option value="Gem4me">Gem4me</option>
					<option value="ProDoctorov">ProDoctorov</option>
					<option value="KFC">KFC</option>
					<option value="Taxify">Taxify</option>
					<option value="AdvertApp">AdvertApp</option>
					<option value="ihc.ru">ihc.ru</option>
					<option value="Sprinthost">Sprinthost</option>
					<option value="SPAR">SPAR</option>
					<option value="Vscale">Vscale</option>
					<option value="Lukoil">Lukoil</option>
					<option value="Sony">Sony</option>
					<option value="PMSM">PMSM</option>
					<option value="Drive2">Drive2</option>
					<option value="Studwork">Studwork</option>
					<option value="Getcontact">Getcontact</option>
					<option value="METRO">METRO</option>
					<option value="ALLES Bonus">ALLES Bonus</option>
					<option value="Bumble">Bumble</option>
					<option value="GoGo">GoGo</option>
					<option value="Coinut">Coinut</option>
					<option value="budget4me-34">budget4me-34</option>
					<option value="Parimatch">Parimatch</option>
					<option value="1xStavka">1xStavka</option>
					<option value="1xBet">1xBet</option>
					<option value="32red">32red</option>
					<option value="23red">23red</option>
					<option value="Azino777">Azino777</option>
					<option value="Azino888">Azino888</option>
					<option value="Vulkan">Vulkan</option>
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
			"RU<br/><span style='color:gray'>" + tr("Russian Federation") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com)</span>",
			"UA<br/><span style='color:gray'>" + tr("Ukraine") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com)</span>",
			"KZ<br/><span style='color:gray'>" + tr("Kazakhstan") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, sms-reg.com, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com)</span>",
			"GB<br/><span style='color:gray'>" + tr("United Kingdom") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com)</span>",
			"PL<br/><span style='color:gray'>" + tr("Poland") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"EE<br/><span style='color:gray'>" + tr("Estonia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com)</span>",
			"DE<br/><span style='color:gray'>" + tr("Germany") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"SE<br/><span style='color:gray'>" + tr("Sweden") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, sms-acktiwator.ru, vak-sms.com)</span>",
			"ID<br/><span style='color:gray'>" + tr("Indonesia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, sms-acktiwator.ru)</span>",
			"LT<br/><span style='color:gray'>" + tr("Lithuania") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"NL<br/><span style='color:gray'>" + tr("Netherlands") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"LV<br/><span style='color:gray'>" + tr("Latvia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"ES<br/><span style='color:gray'>" + tr("Spain") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"FR<br/><span style='color:gray'>" + tr("France") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, vak-sms.com)</span>",
			"MD<br/><span style='color:gray'>" + tr("Moldova") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru, sms-acktiwator.ru)</span>",
			"PH<br/><span style='color:gray'>" + tr("Philippines") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"VN<br/><span style='color:gray'>" + tr("Vietnam") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"KG<br/><span style='color:gray'>" + tr("Kyrgyzstan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"NG<br/><span style='color:gray'>" + tr("Nigeria") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"IE<br/><span style='color:gray'>" + tr("Ireland") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"HT<br/><span style='color:gray'>" + tr("Haiti") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"RO<br/><span style='color:gray'>" + tr("Romania") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"AR<br/><span style='color:gray'>" + tr("Argentina") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"BY<br/><span style='color:gray'>" + tr("Belarus") + " (sms-activate.ru, smshub.org, 5sim.net, getsms.online, 365sms.ru, sms-man.ru, sms-acktiwator.ru)</span>",
			"MX<br/><span style='color:gray'>" + tr("Mexico") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"BR<br/><span style='color:gray'>" + tr("Brazil") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"CY<br/><span style='color:gray'>" + tr("Cyprus") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"PT<br/><span style='color:gray'>" + tr("Portugal") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, vak-sms.com)</span>",
			"US<br/><span style='color:gray'>" + tr("United States") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com, onlinesim.ru)</span>",
			"CN<br/><span style='color:gray'>" + tr("China") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, sms-reg.com)</span>",
			"MY<br/><span style='color:gray'>" + tr("Malaysia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"KE<br/><span style='color:gray'>" + tr("Kenya") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"EG<br/><span style='color:gray'>" + tr("Egypt") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"EG (Virtual)<br/><span style='color:gray'>" + tr("Egypt") + " (smspva.com)</span>",
			"IN<br/><span style='color:gray'>" + tr("India") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"IN (Virtual)<br/><span style='color:gray'>" + tr("India") + " (smspva.com)</span>",
			"KH<br/><span style='color:gray'>" + tr("Cambodia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"LA<br/><span style='color:gray'>" + tr("Lao People's Democratic Republic") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"CI<br/><span style='color:gray'>" + tr("Cote d'Ivoire") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"YE<br/><span style='color:gray'>" + tr("Yemen") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"ZA<br/><span style='color:gray'>" + tr("South Africa") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"CO<br/><span style='color:gray'>" + tr("Colombia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"CA<br/><span style='color:gray'>" + tr("Canada") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"CA (Virtual)<br/><span style='color:gray'>" + tr("Canada") + " (smspva.com)</span>",
			"MA<br/><span style='color:gray'>" + tr("Morocco") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"GH<br/><span style='color:gray'>" + tr("Ghana") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"GH (Virtual)<br/><span style='color:gray'>" + tr("Ghana") + " (smspva.com)</span>",
			"UZ<br/><span style='color:gray'>" + tr("Uzbekistan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, sms-acktiwator.ru)</span>",
			"IQ<br/><span style='color:gray'>" + tr("Iraq") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"IQ (Virtual)<br/><span style='color:gray'>" + tr("Iraq") + " (smspva.com)</span>",
			"AT<br/><span style='color:gray'>" + tr("Austria") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"IR<br/><span style='color:gray'>" + tr("Iran, Islamic Republic of") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"CZ<br/><span style='color:gray'>" + tr("Czech Republic") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"PK<br/><span style='color:gray'>" + tr("Pakistan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"PK (Virtual)<br/><span style='color:gray'>" + tr("Pakistan") + " (smspva.com)</span>",
			"MN<br/><span style='color:gray'>" + tr("Mongolia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"NP<br/><span style='color:gray'>" + tr("Nepal") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"HN<br/><span style='color:gray'>" + tr("Honduras") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"BO<br/><span style='color:gray'>" + tr("Bolivia, plurinational state of") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"DO<br/><span style='color:gray'>" + tr("Dominican Republic") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, smspva.com)</span>",
			"BF<br/><span style='color:gray'>" + tr("Burkina Faso") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"MM<br/><span style='color:gray'>" + tr("Myanmar") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"IL<br/><span style='color:gray'>" + tr("Israel") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"CD<br/><span style='color:gray'>" + tr("Congo, Democratic Republic of the") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"GM<br/><span style='color:gray'>" + tr("Gambia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"RS<br/><span style='color:gray'>" + tr("Serbia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"CM<br/><span style='color:gray'>" + tr("Cameroon") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"CM (Virtual)<br/><span style='color:gray'>" + tr("Cameroon") + " (smspva.com)</span>",
			"TD<br/><span style='color:gray'>" + tr("Chad") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"HR<br/><span style='color:gray'>" + tr("Croatia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TH<br/><span style='color:gray'>" + tr("Thailand") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"SA<br/><span style='color:gray'>" + tr("Saudi Arabia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TW<br/><span style='color:gray'>" + tr("Taiwan, Province of China") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"DZ<br/><span style='color:gray'>" + tr("Algeria") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"BD<br/><span style='color:gray'>" + tr("Bangladesh") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"SN<br/><span style='color:gray'>" + tr("Senegal") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"PE<br/><span style='color:gray'>" + tr("Peru") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"NZ<br/><span style='color:gray'>" + tr("New Zealand") + " (sms-activate.ru, smshub.org, 5sim.net, sms-man.ru, smspva.com)</span>",
			"GN<br/><span style='color:gray'>" + tr("Guinea") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"ML<br/><span style='color:gray'>" + tr("Mali") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"VE<br/><span style='color:gray'>" + tr("Venezuela") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"AF<br/><span style='color:gray'>" + tr("Afghanistan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"UG<br/><span style='color:gray'>" + tr("Uganda") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"AO<br/><span style='color:gray'>" + tr("Angola") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"PG<br/><span style='color:gray'>" + tr("Papua New Guinea") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"MZ<br/><span style='color:gray'>" + tr("Mozambique") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"PY<br/><span style='color:gray'>" + tr("Paraguay") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TN<br/><span style='color:gray'>" + tr("Tunisia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"NI<br/><span style='color:gray'>" + tr("Nicaragua") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"GT<br/><span style='color:gray'>" + tr("Guatemala") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"AE<br/><span style='color:gray'>" + tr("United Arab Emirates") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"ZW<br/><span style='color:gray'>" + tr("Zimbabwe") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"SV<br/><span style='color:gray'>" + tr("El Salvador") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"LY<br/><span style='color:gray'>" + tr("Libyan Arab Jamahiriya") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"JM<br/><span style='color:gray'>" + tr("Jamaica") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TT<br/><span style='color:gray'>" + tr("Trinidad and Tobago") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"EC<br/><span style='color:gray'>" + tr("Ecuador") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"MR<br/><span style='color:gray'>" + tr("Mauritania") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"SL<br/><span style='color:gray'>" + tr("Sierra Leone") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"BJ<br/><span style='color:gray'>" + tr("Benin") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"BW<br/><span style='color:gray'>" + tr("Botswana") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"DM<br/><span style='color:gray'>" + tr("Dominica") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"GR<br/><span style='color:gray'>" + tr("Greece") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"GY<br/><span style='color:gray'>" + tr("Guyana") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"LR<br/><span style='color:gray'>" + tr("Liberia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"SR<br/><span style='color:gray'>" + tr("Suriname") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TJ<br/><span style='color:gray'>" + tr("Tajikistan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"RE<br/><span style='color:gray'>" + tr("Reunion") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"AM<br/><span style='color:gray'>" + tr("Armenia") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"CG<br/><span style='color:gray'>" + tr("Congo") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"GA<br/><span style='color:gray'>" + tr("Gabon") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"BT<br/><span style='color:gray'>" + tr("Bhutan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"MV<br/><span style='color:gray'>" + tr("Maldives") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TM<br/><span style='color:gray'>" + tr("Turkmenistan") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"FI<br/><span style='color:gray'>" + tr("Finland") + " (sms-activate.ru, 5sim.net, sms-man.ru, smspva.com, vak-sms.com)</span>",
			"AW<br/><span style='color:gray'>" + tr("Aruba") + " (sms-activate.ru, smshub.org, 5sim.net, 365sms.ru, sms-man.ru)</span>",
			"TZ<br/><span style='color:gray'>" + tr("Tanzania, United Republic Of") + " (sms-activate.ru, smshub.org, 5sim.net, sms-man.ru)</span>",
			"TR<br/><span style='color:gray'>" + tr("Turkey") + " (sms-activate.ru, 5sim.net, sms-man.ru, onlinesim.ru)</span>",
			"LK<br/><span style='color:gray'>" + tr("Sri Lanka") + " (sms-activate.ru, 5sim.net, sms-man.ru, onlinesim.ru)</span>",
			"IT<br/><span style='color:gray'>" + tr("Italy") + " (sms-activate.ru, 5sim.net, sms-man.ru, smspva.com)</span>",
			"BA<br/><span style='color:gray'>" + tr("Bosnia and Herzegovina") + " (sms-activate.ru, 5sim.net, sms-man.ru, smspva.com)</span>",
			"BN<br/><span style='color:gray'>" + tr("Brunei Darussalam") + " (sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru)</span>",
			"GE<br/><span style='color:gray'>" + tr("Georgia") + " (sms-activate.ru, smshub.org, 5sim.net, sms-man.ru)</span>",
			"CL<br/><span style='color:gray'>" + tr("Chile") + " (sms-activate.ru, 5sim.net, sms-man.ru, smspva.com)</span>",
			"LB<br/><span style='color:gray'>" + tr("Lebanon") + " (sms-activate.ru, smshub.org, 365sms.ru, sms-man.ru)</span>",
			"AZ<br/><span style='color:gray'>" + tr("Azerbaijan") + " (5sim.net, 365sms.ru, sms-man.ru, onlinesim.ru)</span>",
			"US (Virtual)<br/><span style='color:gray'>" + tr("United States") + " (sms-activate.ru, smshub.org, 365sms.ru)</span>",
			"HK<br/><span style='color:gray'>" + tr("Hong Kong") + " (sms-activate.ru, smshub.org, sms-man.ru)</span>",
			"MO<br/><span style='color:gray'>" + tr("Macao") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SI<br/><span style='color:gray'>" + tr("Slovenia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"ET<br/><span style='color:gray'>" + tr("Ethiopia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BE<br/><span style='color:gray'>" + tr("Belgium") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BG<br/><span style='color:gray'>" + tr("Bulgaria") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"HU<br/><span style='color:gray'>" + tr("Hungary") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"TL<br/><span style='color:gray'>" + tr("Timor-Leste") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"CR<br/><span style='color:gray'>" + tr("Costa Rica") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"PR<br/><span style='color:gray'>" + tr("Puerto Rico") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SD<br/><span style='color:gray'>" + tr("Sudan") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"TG<br/><span style='color:gray'>" + tr("Togo") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"KW<br/><span style='color:gray'>" + tr("Kuwait") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SZ<br/><span style='color:gray'>" + tr("Eswatini") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"OM<br/><span style='color:gray'>" + tr("Oman") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SY<br/><span style='color:gray'>" + tr("Syrian Arab Republic") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"QA<br/><span style='color:gray'>" + tr("Qatar") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"PA<br/><span style='color:gray'>" + tr("Panama") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"CU<br/><span style='color:gray'>" + tr("Cuba") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"JO<br/><span style='color:gray'>" + tr("Jordan") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BB<br/><span style='color:gray'>" + tr("Barbados") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BI<br/><span style='color:gray'>" + tr("Burundi") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BS<br/><span style='color:gray'>" + tr("Bahamas") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BZ<br/><span style='color:gray'>" + tr("Belize") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"GD<br/><span style='color:gray'>" + tr("Grenada") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"GW<br/><span style='color:gray'>" + tr("Guinea-Bissau") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"KM<br/><span style='color:gray'>" + tr("Comoros") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"KN<br/><span style='color:gray'>" + tr("Saint Kitts and Nevis") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"LS<br/><span style='color:gray'>" + tr("Lesotho") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"MW<br/><span style='color:gray'>" + tr("Malawi") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"NA<br/><span style='color:gray'>" + tr("Namibia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"NE<br/><span style='color:gray'>" + tr("Niger") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"RW<br/><span style='color:gray'>" + tr("Rwanda") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SK<br/><span style='color:gray'>" + tr("Slovakia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"BH<br/><span style='color:gray'>" + tr("Bahrain") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"ZM<br/><span style='color:gray'>" + tr("Zambia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SO<br/><span style='color:gray'>" + tr("Somalia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"AL<br/><span style='color:gray'>" + tr("Albania") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"UY<br/><span style='color:gray'>" + tr("Uruguay") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"MU<br/><span style='color:gray'>" + tr("Mauritius") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"GP<br/><span style='color:gray'>" + tr("Guadeloupe") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"GF<br/><span style='color:gray'>" + tr("French Guiana") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"LC<br/><span style='color:gray'>" + tr("Saint Lucia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"LU<br/><span style='color:gray'>" + tr("Luxembourg") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"VC<br/><span style='color:gray'>" + tr("Saint Vincent and the Grenadines") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"GQ<br/><span style='color:gray'>" + tr("Equatorial Guinea") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"DJ<br/><span style='color:gray'>" + tr("Djibouti") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"AG<br/><span style='color:gray'>" + tr("Antigua and Barbuda") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"KY<br/><span style='color:gray'>" + tr("Cayman Islands") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"ME<br/><span style='color:gray'>" + tr("Montenegro") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"CH<br/><span style='color:gray'>" + tr("Switzerland") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"NO<br/><span style='color:gray'>" + tr("Norway") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"AU<br/><span style='color:gray'>" + tr("Australia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"ER<br/><span style='color:gray'>" + tr("Eritrea") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SS<br/><span style='color:gray'>" + tr("South Sudan") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"ST<br/><span style='color:gray'>" + tr("Sao Tome and Principe") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"MS<br/><span style='color:gray'>" + tr("Montserrat") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"AI<br/><span style='color:gray'>" + tr("Anguilla") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"MK<br/><span style='color:gray'>" + tr("Macedonia, The Former Yugoslav Republic Of") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"SC<br/><span style='color:gray'>" + tr("Seychelles") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"NC<br/><span style='color:gray'>" + tr("New Caledonia") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"CV<br/><span style='color:gray'>" + tr("Cape Verde") + " (sms-activate.ru, 5sim.net, sms-man.ru)</span>",
			"CF<br/><span style='color:gray'>" + tr("Central African Republic") + " (sms-activate.ru, sms-man.ru)</span>",
			"IS<br/><span style='color:gray'>" + tr("Iceland") + " (sms-activate.ru, sms-man.ru)</span>",
			"MC<br/><span style='color:gray'>" + tr("Monaco") + " (sms-activate.ru, sms-man.ru)</span>",
			"KR<br/><span style='color:gray'>" + tr("Korea, Republic of") + " (sms-activate.ru, smshub.org)</span>",
			"BM<br/><span style='color:gray'>" + tr("Bermuda") + " (smshub.org, 365sms.ru)</span>",
			"JP<br/><span style='color:gray'>" + tr("Japan") + " (5sim.net, sms-man.ru)</span>",
			"MG<br/><span style='color:gray'>" + tr("Madagascar") + " (5sim.net, sms-man.ru)</span>",
			"FJ<br/><span style='color:gray'>" + tr("Fiji") + " (smshub.org)</span>",
			"WS<br/><span style='color:gray'>" + tr("Samoa") + " (5sim.net)</span>",
			"SG<br/><span style='color:gray'>" + tr("Singapore") + " (5sim.net)</span>",
			"SB<br/><span style='color:gray'>" + tr("Solomon Islands") + " (5sim.net)</span>",
			"TO<br/><span style='color:gray'>" + tr("Tonga") + " (5sim.net)</span>",
			"TC<br/><span style='color:gray'>" + tr("Turks and Caicos Islands") + " (5sim.net)</span>",
			"VG<br/><span style='color:gray'>" + tr("Virgin Islands, British") + " (5sim.net)</span>",
			"PS<br/><span style='color:gray'>" + tr("Palestinian Territory, Occupied") + " (365sms.ru)</span>",
			"SJ<br/><span style='color:gray'>" + tr("Svalbard and Jan Mayen") + " (sms-man.ru)</span>"
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
		default_variable: "PHONE_NUMBER",
		help: {
			description:tr("Variable in which, after successful execution of the action, the phone number will be written."),
			examples: [
				{code: "79001112323"},
				{code: "17039688838"},
				{code: "380048698566"}
			]
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get phone number from the SMS receiving service.</div>
	<div class="tr tooltip-paragraph-fold">This action will return a string containing the received phone number.</div>
	<div class="tooltip-paragraph-fold"><span class="tr">Example</span>: <code>"79001112323"</code></div>
	<div class="tr tooltip-paragraph-fold">The received number must be used in the "Get activation code" action to get the code from SMS, or in the "Change activation status" action to change the number status.</div>
	<div class="tr tooltip-paragraph-fold">You can specify your value for the operator, site and country in the corresponding parameters located in the additional settings. Please note that these values must be specified in the form in which the service perceives them, they will be sent as you specified them.</div>
	<div class="tr tooltip-paragraph-fold">If the required service is not in the list of available ones, but it works through an API similar to the selected service, then you can specify its server url in the corresponding parameter located in the additional settings.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>