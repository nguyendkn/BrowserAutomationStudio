_BAS_SMSAPISDATA = {};
_BAS_SMSCONFIRMDATA = {};
_SMS_DEBUG = false;

_SMS = {
	init: function(service, apiKey, serverUrl){
		var data = {service:service, apiKey:apiKey};
		if(!_is_nilb(serverUrl)){
			data.serverUrl = serverUrl;
		};
		
		var id = md5(JSON.stringify(data));
		if(_is_nilb(_BAS_SMSAPISDATA)){
			_BAS_SMSAPISDATA = {};
		};
		
		if(_is_nilb(_BAS_SMSAPISDATA[id])){
			var services = {
				"sms-activate.ru": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'https://sms-activate.ru',
						name: 'Sms-activate',
						ref: 'browserAutomationStudio'
					}
				},
				"smshub.org": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'https://smshub.org',
						name: 'SMSHUB'
					}
				},
				"5sim.net": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'http://api1.5sim.net',
						name: '5SIM'
					}
				},
				"getsms.online": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'https://smsactivateapi.getsms.online',
						name: 'GetSMS',
						ref: '20111'
					}
				},
				"smsvk.net": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'http://smsvk.net',
						name: 'SmsVK'
					}
				},
				"cheapsms.ru": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'https://cheapsms.pro',
						name: 'CheapSMS'
					}
				},
				"sms.kopeechka.store": {
					api: _SMS.SmsActivateApi,
					config: {
						url: 'https://sms.kopeechka.store',
						name: 'Sms.Kopeechka.Store'
					}
				},
				"sms-reg.com": {
					api: _SMS.SmsRegApi,
					config: {
						url: 'https://api.sms-reg.com',
						name: 'SMS-REG',
						ref: 'RUBMC9BX6OIRJG3S',
						refTitle: 'appid'
					}
				},
				"smspva.com": {
					api: _SMS.SmsPvaApi,
					config: {
						url: 'http://smspva.com',
						name: 'SMSpva'
					}
				},
				"simsms.org": {
					api: _SMS.SmsPvaApi,
					config: {
						url: 'http://simsms.org',
						name: 'SIMsms'
					}
				},
				"onlinesim.ru": {
					api: _SMS.OnlineSimApi,
					config: {
						url: 'https://onlinesim.ru',
						name: 'OnlineSIM'
					}
				},
				"sms-acktiwator.ru": {
					api: _SMS.SmsAcktiwatorApi,
					config: {
						url: 'https://sms-acktiwator.ru',
						name: 'SmsAcktiwator'
					}
				},
				"vak-sms.com": {
					api: _SMS.VakSmsApi,
					config: {
						url: 'https://vak-sms.com',
						name: 'VAK-SMS'
					}
				},
				"give-sms.com": {
					api: _SMS.GiveSmsApi,
					config: {
						url: 'https://give-sms.com',
						name: 'Give-SMS'
					}
				}
			};
			if(Object.keys(services).indexOf(service) < 0){
				die(_K=="ru" ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
			};
			var config = services[service].config;
			config.data = data;
			var api = new services[service].api(config);
			_BAS_SMSAPISDATA[id] = api;
			return api;
		}else{
			return _BAS_SMSAPISDATA[id];
		};
	},
	getBalance: function(){
		var service = _function_argument("service");
		var apiKey = _function_argument("apiKey");
		var serverUrl = _function_argument("serverUrl");
		
		var api = _SMS.init(service, apiKey, serverUrl);
		
		_call_function(api.getBalance,{api:api})!
		var balance = _result_function();
		
		_function_return(_is_nilb(balance) ? null : parseFloat(balance));
	},
	getNumbersCount: function(){
		var service = _function_argument("service");
		var apiKey = _function_argument("apiKey");
		var serverUrl = _function_argument("serverUrl");
		var site = _function_argument("site");
		var country = _function_argument("country");
		var customSite = _function_argument("customSite");
		var customCountry = _function_argument("customCountry");
		var operator = _function_argument("operator");
		
		var api = _SMS.init(service, apiKey, serverUrl);
		
		site = _is_nilb(customSite) ? (site=="All" ? "All" : api.getRawSite(site)) : customSite;
		country = _is_nilb(customCountry) ? (country=="" ? "" : api.getRawCountry(country)) : customCountry;
		
		_call_function(api.getNumbersCount,{api:api,site:site,country:country,operator:operator})!
		var count = _result_function();
		
		_function_return(site=="All" ? (_is_nilb(count) ? {} : count) : (_is_nilb(count) ? 0 : parseInt(count)));
	},
	getNumber: function(){
		var service = _function_argument("service");
		var apiKey = _function_argument("apiKey");
		var serverUrl = _function_argument("serverUrl");
		var site = _function_argument("site");
		var country = _function_argument("country");
		var customSite = _function_argument("customSite");
		var customCountry = _function_argument("customCountry");
		var operator = _function_argument("operator");
		var phoneException = _function_argument("phoneException");
		
		if(_is_nilb(_BAS_SMSCONFIRMDATA)){
			_BAS_SMSCONFIRMDATA = {};
		};
		
		var api = _SMS.init(service, apiKey, serverUrl);
		
		site = _is_nilb(customSite) ? api.getRawSite(site) : customSite;
		country = _is_nilb(customCountry) ? api.getRawCountry(country) : customCountry;
		
		_call_function(api.getNumber,{api:api,site:site,country:country,operator:operator,phoneException:phoneException})!
		var confirmData = _result_function();
		var number = confirmData.number;
		
		_BAS_SMSCONFIRMDATA[number] = confirmData;
		
		_function_return(_is_nilb(number) ? null : number);
	},
	debug: function(enable){
		_SMS_DEBUG = (enable==true || enable=="true" || enable==1);
	}
};