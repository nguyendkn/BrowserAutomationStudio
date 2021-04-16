_BAS_SMSCONFIRMDATA = {};
_SMS_DEBUG = false;

_SMS = {
	init: function(service, apiKey, serverUrl){
		var data = {service:service, apiKey:apiKey, serverUrl:serverUrl};
		var services = {
			"sms-activate.ru": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'https://sms-activate.ru',
				serviceName: 'Sms-activate',
				refId: 'browserAutomationStudio',
				refTitle: 'ref'
			}),
			"smshub.org": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'https://smshub.org',
				serviceName: 'SMSHUB',
				refId: '',
				refTitle: 'ref'
			}),
			"5sim.net": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'http://api1.5sim.net',
				serviceName: '5SIM',
				refId: '',
				refTitle: 'ref'
			}),
			"getsms.online": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'https://smsactivateapi.getsms.online',
				serviceName: 'GetSMS',
				refId: '20111',
				refTitle: 'ref'
			}),
			"smsvk.net": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'http://smsvk.net',
				serviceName: 'SmsVK',
				refId: '',
				refTitle: 'ref'
			}),
			"cheapsms.ru": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'https://cheapsms.pro',
				serviceName: 'CheapSMS',
				refId: '',
				refTitle: 'ref'
			}),
			"sms.kopeechka.store": new _SMS.SmsActivateApi({
				data: data,
				apiUrl: 'https://sms.kopeechka.store',
				serviceName: 'Sms.Kopeechka.Store',
				refId: '',
				refTitle: 'ref'
			}),
			"sms-reg.com": new _SMS.SmsRegApi({
				data: data,
				apiUrl: 'https://api.sms-reg.com',
				serviceName: 'SMS-REG',
				refId: 'RUBMC9BX6OIRJG3S',
				refTitle: 'appid'
			}),
			"smspva.com": new _SMS.SmsPvaApi({
				data: data,
				apiUrl: 'http://smspva.com',
				serviceName: 'SMSpva',
				refId: '',
				refTitle: 'ref'
			}),
			"simsms.org": new _SMS.SmsPvaApi({
				data: data,
				apiUrl: 'http://simsms.org',
				serviceName: 'SIMsms',
				refId: '',
				refTitle: 'ref'
			}),
			"onlinesim.ru": new _SMS.OnlineSimApi({
				data: data,
				apiUrl: 'https://onlinesim.ru',
				serviceName: 'OnlineSIM',
				refId: '',
				refTitle: 'ref'
			}),
			"sms-acktiwator.ru": new _SMS.SmsAcktiwatorApi({
				data: data,
				apiUrl: 'https://sms-acktiwator.ru',
				serviceName: 'SmsAcktiwator',
				refId: '',
				refTitle: 'ref'
			}),
			"vak-sms.com": new _SMS.VakSmsApi({
				data: data,
				apiUrl: 'https://vak-sms.com',
				serviceName: 'VAK-SMS',
				refId: '',
				refTitle: 'softId'
			}),
			"give-sms.com": new _SMS.GiveSmsApi({
				data: data,
				apiUrl: 'https://give-sms.com',
				serviceName: 'Give-SMS',
				refId: '',
				refTitle: 'ref'
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
		country = _is_nilb(customCountry) ? country : customCountry;
		
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