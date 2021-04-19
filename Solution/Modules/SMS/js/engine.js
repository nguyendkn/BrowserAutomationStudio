_BAS_SMSCONFIRMDATA = {};
_SMS_DEBUG = false;

_SMS = {
	init: function(service, apiKey, serverUrl){
		var data = {service:service, apiKey:apiKey, serverUrl:serverUrl};
		var services = {
			"sms-activate.ru": new _SMS.SmsActivateApi({
				data: data,
				url: 'https://sms-activate.ru',
				name: 'Sms-activate',
				ref: 'browserAutomationStudio'
			}),
			"smshub.org": new _SMS.SmsActivateApi({
				data: data,
				url: 'https://smshub.org',
				name: 'SMSHUB'
			}),
			"5sim.net": new _SMS.SmsActivateApi({
				data: data,
				url: 'http://api1.5sim.net',
				name: '5SIM'
			}),
			"getsms.online": new _SMS.SmsActivateApi({
				data: data,
				url: 'https://smsactivateapi.getsms.online',
				name: 'GetSMS',
				ref: '20111'
			}),
			"smsvk.net": new _SMS.SmsActivateApi({
				data: data,
				url: 'http://smsvk.net',
				name: 'SmsVK'
			}),
			"cheapsms.ru": new _SMS.SmsActivateApi({
				data: data,
				url: 'https://cheapsms.pro',
				name: 'CheapSMS'
			}),
			"sms.kopeechka.store": new _SMS.SmsActivateApi({
				data: data,
				url: 'https://sms.kopeechka.store',
				name: 'Sms.Kopeechka.Store'
			}),
			"sms-reg.com": new _SMS.SmsRegApi({
				data: data,
				url: 'https://api.sms-reg.com',
				name: 'SMS-REG',
				ref: 'RUBMC9BX6OIRJG3S',
				refTitle: 'appid'
			}),
			"smspva.com": new _SMS.SmsPvaApi({
				data: data,
				url: 'http://smspva.com',
				name: 'SMSpva'
			}),
			"simsms.org": new _SMS.SmsPvaApi({
				data: data,
				url: 'http://simsms.org',
				name: 'SIMsms'
			}),
			"onlinesim.ru": new _SMS.OnlineSimApi({
				data: data,
				url: 'https://onlinesim.ru',
				name: 'OnlineSIM'
			}),
			"sms-acktiwator.ru": new _SMS.SmsAcktiwatorApi({
				data: data,
				url: 'https://sms-acktiwator.ru',
				name: 'SmsAcktiwator'
			}),
			"vak-sms.com": new _SMS.VakSmsApi({
				data: data,
				url: 'https://vak-sms.com',
				name: 'VAK-SMS'
			}),
			"give-sms.com": new _SMS.GiveSmsApi({
				data: data,
				url: 'https://give-sms.com',
				name: 'Give-SMS'
			})
		};
		if(Object.keys(services).indexOf(service) < 0){
			die(_K=="ru" ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
		};
		return services[service];
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