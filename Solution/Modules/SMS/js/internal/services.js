_SMS.getServiceApi = function(data){
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
	var service = data.service;
	if(Object.keys(services).indexOf(service) < 0){
		die(_K=="ru" ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
	};
	var api = services[service].api;
	var config = services[service].config;
	config.data = data;
	return new api(config);
};