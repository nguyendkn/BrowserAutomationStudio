_BAS_SMSCONFIRMDATA = {};

function _SMS_SetServiceConfig(service, apiKey, serverUrl){
	var services = {
		"sms-activate.ru":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://sms-activate.ru',
			apiType: 'sms-activate',
			serviceName: 'Sms-activate',
			refId: 'browserAutomationStudio',
			refTitle: 'ref'
		},
		"smshub.org":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://smshub.org',
			apiType: 'sms-activate',
			serviceName: 'SMSHUB',
			refId: '',
			refTitle: 'ref'
		},
		"5sim.net":{
			api: _SMS_Activate_Api,
			apiUrl: 'http://api1.5sim.net',
			apiType: 'sms-activate',
			serviceName: '5SIM',
			refId: '',
			refTitle: 'ref'
		},
		"getsms.online":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://smsactivateapi.getsms.online',
			apiType: 'sms-activate',
			serviceName: 'GetSMS',
			refId: '20111',
			refTitle: 'ref'
		},
		"smsvk.net":{
			api: _SMS_Activate_Api,
			apiUrl: 'http://smsvk.net',
			apiType: 'sms-activate',
			serviceName: 'SmsVK',
			refId: '',
			refTitle: 'ref'
		},
		"vak-sms.com":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://vak-sms.com',
			apiType: 'sms-activate',
			serviceName: 'VAK-SMS',
			refId: '',
			refTitle: 'ref'
		},
		"cheapsms.ru":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://cheapsms.pro',
			apiType: 'sms-activate',
			serviceName: 'CheapSMS',
			refId: '',
			refTitle: 'ref'
		},
		"give-sms.com":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://give-sms.com',
			apiType: 'sms-activate',
			serviceName: 'Give-SMS',
			refId: '',
			refTitle: 'ref'
		},
		"sms.kopeechka.store":{
			api: _SMS_Activate_Api,
			apiUrl: 'https://sms.kopeechka.store',
			apiType: 'sms-activate',
			serviceName: 'Sms.Kopeechka.Store',
			refId: '',
			refTitle: 'ref'
		},
		"simsms.org":{
			api: _SMS_Activate_Api,
			apiUrl: 'http://simsms2.org',
			apiType: 'sms-activate',
			serviceName: 'SIMsms',
			refId: '',
			refTitle: 'ref'
		},
		"sms-reg.com":{
			api: _SMS_Reg_Api,
			apiUrl: 'https://api.sms-reg.com',
			apiType: 'sms-reg',
			serviceName: 'SMS-REG',
			refId: 'RUBMC9BX6OIRJG3S',
			refTitle: 'appid'
		},
		"smspva.com":{
			api: _SMS_Pva_Api,
			apiUrl: 'http://smspva.com',
			apiType: 'smspva',
			serviceName: 'SMSpva',
			refId: '',
			refTitle: 'ref'
		},
		"onlinesim.ru":{
			api: _SMS_OnlineSim_Api,
			apiUrl: 'https://onlinesim.ru',
			apiType: 'onlinesim',
			serviceName: 'OnlineSIM',
			refId: '',
			refTitle: 'ref'
		},
		"sms-acktiwator.ru":{
			api: _SMS_Acktiwator_Api,
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
	Object.keys(settings).forEach(function(key){config[key] = settings[key]});
	if(!_is_nilb(serverUrl)){
		config.apiUrl = serverUrl.slice(-1)=="/" ? serverUrl.slice(0, -1) : serverUrl;
		config.serviceName = config.apiUrl.replace(new RegExp('https?://'),"").replace(/^(?:\d+)?api(?:\d+)?./,"");
		config.serviceName = config.serviceName.slice(0, 1).toLocaleUpperCase() + config.serviceName.slice(1);
	};
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
	
	if(!_is_nilb(config.refId)){
		params[config.refTitle] = config.refId;
	};
	
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
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	var isJSON = _function_argument("isJSON");
	
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
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = config.apiUrl + '/' + action + '.php';
	var params = _SMS_CombineParams({apikey:config.apiKey}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":method,"params":params})!
	var content = _result_function();
	
	var resp = _SMS_ParseJSON(config, content);
	
	if(checkErrors && resp.response!=1){
		_SMS_ErrorHandler(config, resp.error_msg ? resp.error_msg : resp.response);
	};

	_function_return(resp);
};
function _SMS_Pva_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = config.apiUrl + '/priemnik.php';
	var params = _SMS_CombineParams({metod:action,apikey:config.apiKey}, options);
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":"GET","params":params})!
	var content = _result_function();
	
	if(!_is_json_string(content)){
		_SMS_ErrorHandler(config, content);
	};
	
	var resp = _SMS_ParseJSON(config, content);
	
	if(checkErrors && resp.response!=="1"){
		_SMS_ErrorHandler(config, resp.error_msg ? resp.error_msg : resp.response);
	};

	_function_return(resp);
};
function _SMS_OnlineSim_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = config.apiUrl + '/api/' + action + '.php';
	var params = _SMS_CombineParams({apikey:config.apiKey}, options, {operator:"simoperator",phoneException:"reject"});
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":method,"params":params})!
	var content = _result_function();
	
	var resp = _SMS_ParseJSON(config, content);
	
	if(checkErrors && resp.response!=1){
		_SMS_ErrorHandler(config, resp.response);
	};

	_function_return(resp);
};
function _SMS_Acktiwator_Api(){
	var config = _function_argument("config");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = config.apiUrl + '/api/' + action + '/' + config.apiKey;
	var params = _SMS_CombineParams({}, options, {country:"code"});
	
	_call_function(_SMS_Request,{"config":config,"url":url,"method":"GET","params":params})!
	var content = _result_function();
	
	var resp = _SMS_ParseJSON(config, content);
	
	if(checkErrors && (resp.name=="error" || resp.error)){
		_SMS_ErrorHandler(config, resp.name=="error" ? resp.code : resp.error, resp.message);
	};

	_function_return(resp);
};
function _SMS_GetBalance(){
	var service = _function_argument("service");
	var apiKey = _function_argument("apiKey");
	var serverUrl = _function_argument("serverUrl");
	
	var config = _SMS_SetServiceConfig(service, apiKey, serverUrl);
	
	var balance = null;
	
	_if(config.apiType=="sms-activate",function(){
		_call_function(_SMS_Activate_Api,{config:config,action:"getBalance",isJSON:false})!
		var resp = _result_function();
		
		if(resp[0]=="ACCESS_BALANCE"){
			balance = resp[1];
		}else{
			_SMS_ErrorHandler(config, resp[0], resp[1]);
		};
	})!
	
	_if(config.apiType=="sms-reg" || config.apiType=="smspva" || config.apiType=="onlinesim",function(){
		_call_function(config.api,{config:config,action:(config.apiType=="smspva" ? "get_balance" : "getBalance")})!
		var resp = _result_function();
		
		balance = resp.balance;
	})!
	
	_if(config.apiType=="sms-acktiwator",function(){
		_call_function(_SMS_Acktiwator_Api,{config:config,action:"getbalance"})!
		var resp = _result_function();
		
		balance = resp;
	})!
	
	_function_return(_is_nilb(balance) ? null : parseFloat(balance));
};
function _SMS_GetNumber(){
	var service = _function_argument("service");
	var apiKey = _function_argument("apiKey");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var customSite = _function_argument("customSite");
	var customCountry = _function_argument("customCountry");
	var serverUrl = _function_argument("serverUrl");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	var config = _SMS_SetServiceConfig(service, apiKey, serverUrl);
	
	var options = {service: (customSite ? customSite : site), country: (customCountry ? customCountry : country)};
	
	var confirmData = {config: config, id: null, origId: null, number: null};
	
	if(_is_nilb(_BAS_SMSCONFIRMDATA)){
		_BAS_SMSCONFIRMDATA = {};
	};
	
	if(service=="sms-activate.ru" || service=="onlinesim.ru"){
		if(!_is_nilb(operator)){
			options.operator = operator;
		};
		if(!_is_nilb(phoneException)){
			options.phoneException = phoneException;
		};
	};
	
	_if(config.apiType=="sms-activate",function(){
		_call_function(_SMS_Activate_Api,{config:config,action:"getNumber",options:options,isJSON:false})!
		var resp = _result_function();
		
		if(resp[0]=="ACCESS_NUMBER"){
			confirmData.id = resp[1];
			confirmData.origId = resp[1];
			confirmData.number = resp[2];
			_BAS_SMSCONFIRMDATA[ resp[2] ] = confirmData;
		}else{
			_SMS_ErrorHandler(config, resp[0], resp[1]);
		};
	})!
	
	_if(config.apiType=="sms-reg" || config.apiType=="onlinesim",function(){		
		_call_function(config.api,{config:config,action:"getNum",options:options})!
		var resp = _result_function();
		
		confirmData.id = resp.tzid;
		confirmData.origId = resp.tzid;
		
		var opts = {tzid: resp.tzid};
		
		var maxNumberWait = Date.now() + 600000;
		_do(function(){
			if(Date.now() > maxNumberWait){
				_SMS_ErrorHandler(config, "TIMEOUT_GET_STATE");
			};
			
			_call_function(config.api,{config:config,action:"getState",options:opts,checkErrors:false})!
			var resp = _result_function();
			if(Array.isArray(resp)){
				resp = resp[0];
			};

			if(["TZ_NUM_PREPARE","TZ_NUM_WAIT","TZ_NUM_ANSWER"].indexOf(resp.response) > -1){
				confirmData.number = resp.number;
				_BAS_SMSCONFIRMDATA[resp.number] = confirmData;
				_break()
			};

			if(resp.response!="TZ_INPOOL"){
				_SMS_ErrorHandler(config, resp.error_msg ? resp.error_msg : resp.response);
			};
			
			sleep(1000)!
		})!
	})!
	
	_if(config.apiType=="smspva",function(){
		_call_function(_SMS_Pva_Api,{config:config,action:"get_number",options:options})!
		var resp = _result_function();
		
		var countryCode = resp.CountryCode;
		var prefix = countryCode.slice(0,1)=="+" ? countryCode.slice(1) : countryCode;
		var number = prefix + resp.number;
		
		confirmData.id = resp.id;
		confirmData.origId = resp.id;
		confirmData.number = number;
		_BAS_SMSCONFIRMDATA[number] = confirmData;
	})!
	
	_if(config.apiType=="sms-acktiwator",function(){
		_call_function(_SMS_Acktiwator_Api,{config:config,action:"getnumber",options:options})!
		var resp = _result_function();
		
		confirmData.id = resp.id;
		confirmData.origId = resp.id;
		confirmData.number = resp.number;
		_BAS_SMSCONFIRMDATA[resp.number] = confirmData;
	})!
	
	_function_return(_is_nilb(confirmData.number) ? null : confirmData.number);
};