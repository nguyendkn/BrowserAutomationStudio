function _SMS_SetServiceConfig(service, apiKey){
	var services = {
		"sms-activate.ru":{
			apiUrl: 'https://sms-activate.ru',
			apiType: 'sms-activate',
			serviceName: 'Sms-activate',
			refId: 'browserAutomationStudio',
			refTitle: 'ref'
		},
		"smshub.org":{
			apiUrl: 'https://smshub.org',
			apiType: 'sms-activate',
			serviceName: 'SMSHUB',
			refId: '',
			refTitle: 'ref'
		},
		"5sim.net":{
			apiUrl: 'http://api1.5sim.net',
			apiType: 'sms-activate',
			serviceName: '5SIM',
			refId: '',
			refTitle: 'ref'
		},
		"getsms.online":{
			apiUrl: 'https://smsactivateapi.getsms.online',
			apiType: 'sms-activate',
			serviceName: 'GetSMS',
			refId: '20111',
			refTitle: 'ref'
		},
		"smsvk.net":{
			apiUrl: 'http://smsvk.net',
			apiType: 'sms-activate',
			serviceName: 'SmsVK',
			refId: '',
			refTitle: 'ref'
		},
		"vak-sms.com":{
			apiUrl: 'https://vak-sms.com',
			apiType: 'sms-activate',
			serviceName: 'VAK-SMS',
			refId: '',
			refTitle: 'ref'
		},
		"cheapsms.ru":{
			apiUrl: 'https://cheapsms.pro',
			apiType: 'sms-activate',
			serviceName: 'CheapSMS',
			refId: '',
			refTitle: 'ref'
		},
		"give-sms.com":{
			apiUrl: 'https://give-sms.com',
			apiType: 'sms-activate',
			serviceName: 'Give-SMS',
			refId: '',
			refTitle: 'ref'
		},
		"sms.kopeechka.store":{
			apiUrl: 'https://sms.kopeechka.store',
			apiType: 'sms-activate',
			serviceName: 'Sms.Kopeechka.Store',
			refId: '',
			refTitle: 'ref'
		},
		"simsms.org":{
			apiUrl: 'http://simsms2.org',
			apiType: 'sms-activate',
			serviceName: 'SIMsms',
			refId: '',
			refTitle: 'ref'
		},
		"sms-reg.com":{
			apiUrl: 'https://api.sms-reg.com',
			apiType: 'sms-reg',
			serviceName: 'SMS-REG',
			refId: 'RUBMC9BX6OIRJG3S',
			refTitle: 'appid'
		},
		"smspva.com":{
			apiUrl: 'http://smspva.com',
			apiType: 'smspva',
			serviceName: 'SMSpva',
			refId: '',
			refTitle: 'ref'
		},
		"onlinesim.ru":{
			apiUrl: 'https://onlinesim.ru',
			apiType: 'onlinesim',
			serviceName: 'OnlineSIM',
			refId: '',
			refTitle: 'ref'
		},
		"sms-acktiwator.ru":{
			apiUrl: 'https://sms-acktiwator.ru',
			apiType: 'sms-acktiwator',
			serviceName: 'SmsAcktiwator',
			refId: '',
			refTitle: 'ref'
		}
	};
	if(Object.keys(services).indexOf(service) < 0){
		die(_K=="ru" ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
	};
	var config = {service:service,apiKey:apiKey};
	var settings = services[service];
	Object.keys(settings).forEach(function(key){config[key] = settings[key]})
	return config;
};
function _SMS_CombineParams(params, options, labels){
	labels = _avoid_nilb(labels, {});
	var keys = Object.keys(options);
	if(keys.length > 0){
		keys.forEach(function(key){params[labels[key] ? labels[key] : key] = options[key]});
	};
	return params;
};
function _SMS_ParseJSON(config, content){
	try{
		var resp = JSON.parse(content);
	}catch(e){
		_SMS_ErrorHandler(config, "RESPONSE_IS_NOT_JSON");
	};
	return resp;
};
function _SMS_Request(){
	var config = _function_argument("config");
	var url = _function_argument("url");
	var method = _function_argument("method");
	var params = _function_argument("params");
	
	var data = [];
	var keys = Object.keys(params);
	if(keys.length>0){
		if(method=="GET"){
			url += '?' + keys.map(function(key){
				return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
			}).join('&');
		}else{
			keys.forEach(function(key){
				data.push(key);
				data.push(params[key]);
			});
		};
	};
	
	_switch_http_client_internal();
	
	_ensure_http_client();
	_BAS_FAIL_ON_ERROR = FAIL_ON_ERROR;
	http_client_set_fail_on_error(false);
	
	_do(function(){
		if(_iterator() > 10){
			_switch_http_client_main();
			FAIL_ON_ERROR = _BAS_FAIL_ON_ERROR;
			_SMS_ErrorHandler(config, "FAILED_REQUEST");
		};
		
		_if_else(method=="GET", function(){
			http_client_get2(url,{"method":"GET"})!
		}, function(){
			http_client_post(url, data, {"content-type":"urlencode","encoding":"UTF-8","method":"POST"})!
		})!
		
		if(!http_client_was_error()){
			_break();
		};
		
		sleep(1000)!
	})!
	
	FAIL_ON_ERROR = _BAS_FAIL_ON_ERROR;

	var content = http_client_content();

	_switch_http_client_main();
	
	_function_return(content);
};
function _SMS_Activate_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var isJSON = _function_argument("isJSON");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	
	var url = config.apiUrl + '/stubs/handler_api.php';
	var params = _SMS_CombineParams({api_key:config.apiKey,action:action}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":method,"params":params})!
	var content = _result_function();
	
	var resp = isJSON || (_is_nilb(isJSON) && _is_json_string(content)) ? _SMS_ParseJSON(config, content) : content.split(':');

	_function_return(resp)
};
function _SMS_Reg_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	
	var url = config.apiUrl + '/' + action + '.php';
	var params = _SMS_CombineParams({apikey:config.apiKey}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":method,"params":params})!
	var content = _result_function();
	
	var resp = _SMS_ParseJSON(config, content);

	_function_return(resp);
};
function _SMS_Pva_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	
	var url = config.apiUrl + '/priemnik.php';
	var params = _SMS_CombineParams({metod:action,apikey:config.apiKey}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":"GET","params":params})!
	var content = _result_function();
	
	if(!_is_json_string(content)){
		_SMS_ErrorHandler(config, content);
	};
	
	var resp = _SMS_ParseJSON(config, content);

	_function_return(resp);
};
function _SMS_OnlineSim_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	
	var url = config.apiUrl + '/api/' + action + '.php';
	var params = _SMS_CombineParams({apikey:config.apiKey}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":method,"params":params})!
	var content = _result_function();
	
	var resp = _SMS_ParseJSON(config, content);

	_function_return(resp);
};
function _SMS_Acktiwator_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	
	var url = config.apiUrl + '/api/' + action + '/' + config.apiKey;
	var params = _SMS_CombineParams({}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":"GET","params":params})!
	var content = _result_function();
	
	var resp = _SMS_ParseJSON(config, content);

	_function_return(resp);
};
function _SMS_GetBalance(){
	var service = _function_argument("service");
	var apiKey = _function_argument("apiKey");
	
	var config = _SMS_SetServiceConfig(service, apiKey);
	
	var balance = null;
	
	_if(config.apiType=="sms-activate",function(){
		_call_function(_SMS_Activate_Api,{config:config,action:"getBalance",isJSON:false})!
		var resp = _result_function();
		
		if(resp[0]=="ACCESS_BALANCE" && resp[1]){
			balance = resp[1];
		}else{
			_SMS_ErrorHandler(config, resp[0]);
		};
	})!
	
	_if(config.apiType=="sms-reg",function(){
		_call_function(_SMS_Reg_Api,{config:config,action:"getBalance"})!
		var resp = _result_function();
		
		if(resp.response==1 && resp.balance){
			balance = resp.balance;
		}else{
			_SMS_ErrorHandler(config, resp.error_msg ? resp.error_msg : resp.response);
		};
	})!
	
	_if(config.apiType=="smspva",function(){
		_call_function(_SMS_Pva_Api,{config:config,action:"get_balance"})!
		var resp = _result_function();
		
		if(resp.response==1 && resp.balance){
			balance = resp.balance;
		}else{
			_SMS_ErrorHandler(config, resp.error_msg ? resp.error_msg : resp.response);
		};
	})!
	
	_if(config.apiType=="onlinesim",function(){
		_call_function(_SMS_OnlineSim_Api,{config:config,action:"getBalance"})!
		var resp = _result_function();
		
		if(resp.response==1 && resp.balance){
			balance = resp.balance;
		}else{
			_SMS_ErrorHandler(config, resp.response);
		};
	})!
	
	_if(config.apiType=="sms-acktiwator",function(){
		_call_function(_SMS_Acktiwator_Api,{config:config,action:"getbalance"})!
		var resp = _result_function();
		
		if(typeof resp=="number"){
			balance = resp;
		}else{
			_SMS_ErrorHandler(config, resp.message);
		};
	})!
	
	_function_return(_is_nilb(balance) ? null : parseFloat(balance));
};