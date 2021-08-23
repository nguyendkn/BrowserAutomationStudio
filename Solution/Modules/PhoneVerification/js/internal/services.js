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
				ref: 'browserAutomationStudio',
				limits: [
					{
						requestsPerInterval: 200,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
			}
		},
		"smshub.org": {
			api: this.SmsActivateApi,
			config: {
				name: 'SMSHUB',
				url: 'https://smshub.org',
				supportedMethods: [
					'getNumbersCount'
				],
				limits: [
					{
						requestsPerInterval: 200,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
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
				ref: '598fdb60',
				limits: [
					{
						requestsPerInterval: 200,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
			}
		},
		"365sms.ru": {
			api: this.SmsActivateApi,
			config: {
				name: '365SMS',
				url: 'https://365sms.ru',
				supportedMethods: [
					'getNumbersCount'
				],
				limits: [
					{
						requestsPerInterval: 10,
						interval: 30000,
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 2000,
						type: 'service'
					}
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
				ref: 'lyevZ418dni4',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
			}
		},
		"activation.pw": {
			api: this.SmsActivateApi,
			config: {
				name: 'ActivationPw',
				url: 'https://activation.pw',
				supportedMethods: [
					'getNumbersCount'
				],
				ref: '4dcbfedf7b81f8d067a78a6d825e36de',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
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
				ref: '20111',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
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
				],
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
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
				ref: 'bablosoft',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
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
				ref: 'bablosoft',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 6,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
				]
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
				refTitle: 'appid',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 3,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
				]
			}
		},
		"smspva.com": {
			api: this.SmsPvaApi,
			config: {
				name: 'SMSpva',
				url: 'http://smspva.com',
				supportedMethods: [
					'getNumbersCount'
				],
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 5,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
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
				],
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 5,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
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
				refTitle: 'dev_id',
				limits: [
					{
						requestsPerInterval: 30,
						interval: 30000,
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
				]
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
				],
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 6,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
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
				refTitle: 'softId',
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 10,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 2,
						interval: 'second',
						type: 'thread'
					}
				]
			}
		},
		"give-sms.com": {
			api: this.GiveSmsApi,
			config: {
				name: 'Give-SMS',
				url: 'https://give-sms.com',
				supportedMethods: [
					'getNumbersCount'
				],
				limits: [
					{
						requestsPerInterval: 100,
						interval: 'minute',
						type: 'service'
					},
					{
						requestsPerInterval: 5,
						interval: 'second',
						type: 'service'
					},
					{
						requestsPerInterval: 1,
						interval: 'second',
						type: 'thread'
					}
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