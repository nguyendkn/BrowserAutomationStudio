_SMS.getServiceApi = function(data){
	var services = {
		"sms-activate.ru": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'Sms-activate',
				url: 'https://sms-activate.ru',
				supportedMethods: [
					'getNumbersCount',
					'getCountries'
				],
				ref: 'browserAutomationStudio'
			}
		},
		"smshub.org": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'SMSHUB',
				url: 'https://smshub.org',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"5sim.net": {
			api: _SMS.SmsActivateApi,
			config: {
				name: '5SIM',
				url: 'http://api1.5sim.net',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"365sms.ru": {
			api: _SMS.SmsActivateApi,
			config: {
				name: '365SMS',
				url: 'https://365sms.ru',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"sms-man.ru": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'SMS@MAN',
				url: 'https://api.sms-man.ru',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"getsms.online": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'GetSMS',
				url: 'https://smsactivateapi.getsms.online',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: '20111'
			}
		},
		"cheapsms.ru": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'CheapSMS',
				url: 'https://cheapsms.pro',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"smsvk.net": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'SmsVK',
				url: 'http://smsvk.net',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"sms.kopeechka.store": {
			api: _SMS.SmsActivateApi,
			config: {
				name: 'Sms.Kopeechka.Store',
				url: 'https://sms.kopeechka.store',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"sms-reg.com": {
			api: _SMS.SmsRegApi,
			config: {
				name: 'SMS-REG',
				url: 'https://api.sms-reg.com',
				supportedMethods: [],
				ref: 'RUBMC9BX6OIRJG3S',
				refTitle: 'appid'
			}
		},
		"smspva.com": {
			api: _SMS.SmsPvaApi,
			config: {
				name: 'SMSpva',
				url: 'http://smspva.com',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"simsms.org": {
			api: _SMS.SmsPvaApi,
			config: {
				name: 'SIMsms',
				url: 'http://simsms.org',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"onlinesim.ru": {
			api: _SMS.OnlineSimApi,
			config: {
				name: 'OnlineSIM',
				url: 'https://onlinesim.ru',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"sms-acktiwator.ru": {
			api: _SMS.SmsAcktiwatorApi,
			config: {
				name: 'SmsAcktiwator',
				url: 'https://sms-acktiwator.ru',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"vak-sms.com": {
			api: _SMS.VakSmsApi,
			config: {
				name: 'VAK-SMS',
				url: 'https://vak-sms.com',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"give-sms.com": {
			api: _SMS.GiveSmsApi,
			config: {
				name: 'Give-SMS',
				url: 'https://give-sms.com',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		}
	};
	var service = data.service;
	if(Object.keys(services).indexOf(service) < 0){
		die(_K=="ru" ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
	};
	var api = services[service].api;
	var config = services[service].config;
	return new api(config, data);
};