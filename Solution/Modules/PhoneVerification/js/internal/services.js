_SMS.getServiceApi = function(data){
	var services = {
		"sms-activate.ru": {
			api: this.SmsActivateApi,
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
			api: this.SmsActivateApi,
			config: {
				name: 'SMSHUB',
				url: 'https://smshub.org',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"5sim.net": {
			api: this.SmsActivateApi,
			config: {
				name: '5SIM',
				url: 'http://api1.5sim.net',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: '598fdb60'
			}
		},
		"365sms.ru": {
			api: this.SmsActivateApi,
			config: {
				name: '365SMS',
				url: 'https://365sms.ru',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"sms-man.ru": {
			api: this.SmsActivateApi,
			config: {
				name: 'SMS@MAN',
				url: 'https://api.sms-man.ru',
				supportedMethods: [
					'getNumbersCount',
					'getSites',
					'getCountries'
				],
				ref: 'lyevZ418dni4'
			}
		},
		"getsms.online": {
			api: this.SmsActivateApi,
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
			api: this.SmsActivateApi,
			config: {
				name: 'CheapSMS',
				url: 'https://cheapsms.pro',
				path: '/handler/index',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"smsvk.net": {
			api: this.SmsActivateApi,
			config: {
				name: 'SmsVK',
				url: 'http://smsvk.net',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: 'bablosoft'
			}
		},
		"sms.kopeechka.store": {
			api: this.SmsActivateApi,
			config: {
				name: 'Sms.Kopeechka.Store',
				url: 'https://sms.kopeechka.store',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: 'bablosoft'
			}
		},
		"sms-reg.com": {
			api: this.SmsRegApi,
			config: {
				name: 'SMS-REG',
				url: 'https://api.sms-reg.com',
				supportedMethods: [
					'getSites'
				],
				ref: 'RUBMC9BX6OIRJG3S',
				refTitle: 'appid'
			}
		},
		"smspva.com": {
			api: this.SmsPvaApi,
			config: {
				name: 'SMSpva',
				url: 'http://smspva.com',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"simsms.org": {
			api: this.SmsPvaApi,
			config: {
				name: 'SIMsms',
				url: 'http://simsms.org',
				supportedMethods: [
					'getNumbersCount'
				]
			}
		},
		"onlinesim.ru": {
			api: this.OnlineSimApi,
			config: {
				name: 'OnlineSIM',
				url: 'https://onlinesim.ru',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: '2451761',
				refTitle: 'dev_id'
			}
		},
		"sms-acktiwator.ru": {
			api: this.SmsAcktiwatorApi,
			config: {
				name: 'SmsAcktiwator',
				url: 'https://sms-acktiwator.ru',
				supportedMethods: [
					'getNumbersCount',
					'getSites',
					'getCountries'
				]
			}
		},
		"vak-sms.com": {
			api: this.VakSmsApi,
			config: {
				name: 'VAK-SMS',
				url: 'https://vak-sms.com',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: '1007',
				refTitle: 'softId'
			}
		},
		"give-sms.com": {
			api: this.GiveSmsApi,
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
	if(!services.hasOwnProperty(service)){
		die(_K=="ru" ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
	};
	var obj = services[service];
	try{
		return new obj.api(obj.config, data);
	}catch(e){
		die(_K=="ru" ? ('Класс сервиса ' + service + ' поврежден или отсутствует') : ('Class of service ' + service + ' is corrupted or missing'), true);
	};
};