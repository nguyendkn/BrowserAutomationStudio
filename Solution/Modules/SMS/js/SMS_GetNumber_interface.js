<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"service", description:tr("Service"), default_selector: "string", variants: ["sms-activate.ru","smshub.org","5sim.net","getsms.online","smsvk.net","vak-sms.com","cheapsms.ru","give-sms.com","sms.kopeechka.store","simsms.org","sms-reg.com","smspva.com","onlinesim.ru","sms-acktiwator.ru"], disable_int: true, value_string: "sms-activate.ru", help: {description: tr("SMS receiving service.")} }) %>
	<%= _.template($('#input_constructor').html())({id:"apiKey", description:tr("API key"), default_selector: "string", disable_int: true, value_string: "", help: {description: tr("API key of the SMS receiving service.")} }) %>
	<div class="col-xs-12">
		<form class="form-horizontal">
		  <div class="form-group">
			<div class="col-xs-2">
			  <div class="input-group">
				<span data-preserve="true" data-preserve-type="select" data-preserve-id="site">
				  <select class="form-control input-sm" id="site" placeholder="Site">
					<option value="*" selected="selected">*</option>
					<option value="4game">4game</option>
					<option value="AOL">AOL</option>
					<option value="Auto.RU">Auto.RU</option>
					<option value="Avito">Avito</option>
					<option value="Badoo">Badoo</option>
					<option value="Discord">Discord</option>
					<option value="dodopizza.ru">dodopizza.ru</option>
					<option value="Drom.RU">Drom.RU</option>
					<option value="Drug Vokrug">Drug Vokrug</option>
					<option value="Facebook">Facebook</option>
					<option value="Fiverr">Fiverr</option>
					<option value="Fotostrana">Fotostrana</option>
					<option value="G2A.COM">G2A.COM</option>
					<option value="GetTaxi">GetTaxi</option>
					<option value="GMail">GMail</option>
					<option value="HotMail">HotMail</option>
					<option value="ICQ">ICQ</option>
					<option value="Instagram">Instagram</option>
					<option value="LinkedIn">LinkedIn</option>
					<option value="Mail.RU">Mail.RU</option>
					<option value="mamba">mamba</option>
					<option value="MeetMe">MeetMe</option>
					<option value="Naver">Naver</option>
					<option value="OD">OD</option>
					<option value="OLX">OLX</option>
					<option value="Open I Messenger">Open I Messenger</option>
					<option value="Proton Mail">Proton Mail</option>
					<option value="Qiwi">Qiwi</option>
					<option value="SEOsprint.net">SEOsprint.net</option>
					<option value="Sipnet.ru">Sipnet.ru</option>
					<option value="Snapchat">Snapchat</option>
					<option value="Spotify">Spotify</option>
					<option value="Steam">Steam</option>
					<option value="Taxi Maksim">Taxi Maksim</option>
					<option value="Telegram">Telegram</option>
					<option value="Tinder">Tinder</option>
					<option value="Twilio">Twilio</option>
					<option value="Twitter">Twitter</option>
					<option value="Ubank.ru">Ubank.ru</option>
					<option value="Uber">Uber</option>
					<option value="Viber">Viber</option>
					<option value="VK">VK</option>
					<option value="WebMoney">WebMoney</option>
					<option value="WeChat">WeChat</option>
					<option value="Weebly">Weebly</option>
					<option value="WhatsAPP">WhatsAPP</option>
					<option value="Yahoo">Yahoo</option>
					<option value="Yandex">Yandex</option>
					<option value="Zoho">Zoho</option>

				  </select>
				</span>
			  </div>
			</div>
			<label class="control-label text-right tr" style="padding-top:5px !important;">Site</label>
		  </div>
		</form>
	</div>
	<%= _.template($('#input_constructor').html())({id:"country", description:tr("Country"), default_selector: "string", disable_int:true, value_string: "RU", variants:["RU","KZ","UA","EE","FR","ID","IL","KG","LV","NL","PY","PH","PL","RO","UK","VN","CN","US","HK","BY","DE"]}) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
	<%= _.template($('#input_constructor').html())({id:"customSite", description:tr("Custom site"), default_selector: "string", disable_int: true, value_string: "" }) %>
	<%= _.template($('#input_constructor').html())({id:"customCountry", description:tr("Custom country"), default_selector: "string", disable_int: true, value_string: "" }) %>
	<%= _.template($('#input_constructor').html())({id:"serverUrl", description:tr("Server url"), default_selector: "string", disable_int: true, value_string: "" }) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "PHONE_NUMBER"}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get phone number from the SMS receiving service.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>