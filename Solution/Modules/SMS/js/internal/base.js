_SMS.BaseApi = function(config, type){
	const api = this;
	var data = config.data;
	var serverUrl = data.serverUrl;
	this.key = data.apiKey;
	this.service = data.service;
	this.type = type;
	
	if(_is_nilb(serverUrl)){
		this.url = config.url;
		this.name = config.name;
	}else{
		var url = serverUrl.slice(-1)=="/" ? serverUrl.slice(0, -1) : serverUrl;
		var name = url.replace(new RegExp('https?://'),"").replace(/^(?:\d+)?api(?:\d+)?./,"");
		this.url = url;
		this.name = name.slice(0, 1).toLocaleUpperCase() + name.slice(1);
	};
	
	if(!_is_nilb(config.ref)){
		this.ref = config.ref;
		if(_is_nilb(config.refTitle)){
			this.refTitle = 'ref';
		}else{
			this.refTitle = config.refTitle;
		};
	};
	
	this.combineParams = function(params, options, labels){
		labels = _avoid_nilb(labels, {});
		var keys = Object.keys(options);
		if(keys.length > 0){
			keys.forEach(function(key){
				if(!_is_nilb(options[key])){
					params[labels[key] ? labels[key] : key] = options[key];
				};
			});
		};
		return params;
	};
	
	this.paramsToString = function(params){
		return Object.keys(params).map(function(key){
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		}).join('&');
	};
	
	this.paramsToArray = function(params){
		var data = [];
		Object.keys(params).forEach(function(key){
			data.push(key);
			data.push(params[key]);
		});
		return data;
	};
	
	this.reduceString = function(str, length){
		length = _avoid_nilb(length, 100);
		return str.length > length ? str.slice(0, length) + '...' : str;
	};
	
	this.removePlus = function(number){
		return number.slice(0,1)=='+' ? number.slice(1) : number;
	};
	
	this.parseJSON = function(data){
		try{
			var json = JSON.parse(data);
		}catch(e){
			this.errorHandler("RESPONSE_IS_NOT_JSON", this.reduceString(data));
		};
		return json;
	};
	
	this.validateStatus = function(supported, status){
		if(supported.indexOf(status) < 0){
			api.errorHandler('UNSUPPORTED_STATUS', status);
		};
	};
	
	this.validateMethod = function(method){
		if(_is_nilb(api) || Object.keys(api).indexOf(method) < 0){
			api.errorHandler('UNSUPPORTED_METHOD', method);
		};
	};
	
	this.banThread = function(seconds){
		_SMS_BAN_THREAD = Date.now() + seconds * 1000;
	};
	
	this.banService = function(seconds){
		PSet("sms", "_SMS_BAN_THREAD", (Date.now() + seconds * 1000).toString());
	};
	
	this.beforeRequest = function(){
		_do(function(){
			var sleepTime = 0;
			
			if(_SMS_BAN_THREAD > 0 && _SMS_BAN_THREAD - Date.now() > 0){
				sleepTime = _SMS_BAN_THREAD - Date.now();
			};
			
			if(P("sms", "_SMS_BAN_THREAD").length > 0 && parseInt(P("sms", "_SMS_BAN_THREAD")) - Date.now() > 0){
				var time = parseInt(P("sms", "_SMS_BAN_THREAD")) - Date.now() + rand(0,30) * 1000;
				if(time > sleepTime){
					sleepTime = time;
				};
			};

			_if_else(sleepTime==0, function(){
				_break("function");
			}, function(){
				if(_SMS_DEBUG){
					log((_K=="ru" ? 'Ждем ' : 'Wait ') + (sleepTime/1000) + (_K=="ru" ? ' секунд перед запросом к ' : ' seconds before requesting ') + api.name);
				};
				sleep(sleepTime)!
			})!
		})!
	};
	
	this.request = function(){
		var url = _function_argument("url");
		var method = _function_argument("method");
		var params = _function_argument("params");
		var data = [];
		
		if(!_is_nilb(api.ref)){
			params[api.refTitle] = api.ref;
		};
		
		if(Object.keys(params).length>0){
			if(method=="GET"){
				url += '?' + api.paramsToString(params);
			}else{
				data = api.paramsToArray(params);
			};
		};
		
		_call_function(api.beforeRequest,{})!
		
		_switch_http_client_internal();
		
		_ensure_http_client();
		_BAS_FAIL_ON_ERROR = FAIL_ON_ERROR;
		http_client_set_fail_on_error(false);
		
		_do(function(){
			if(_iterator() > 10){
				_switch_http_client_main();
				FAIL_ON_ERROR = _BAS_FAIL_ON_ERROR;
				api.errorHandler("FAILED_REQUEST");
			};
			
			_if_else(method=="GET", function(){
				if(_SMS_DEBUG){
					log((_K=="ru" ? 'Запрос к' : 'Request') + ' ' + api.name + ': ' + url);
				};
				http_client_get2(url, {"method":"GET"})!
			}, function(){
				if(_SMS_DEBUG){
					log((_K=="ru" ? 'Запрос к' : 'Request') + ' ' + api.name + ': ' + url + ', ' + (_K=="ru" ? 'данные' : 'data') + ': ' + api.paramsToString(params));
				};
				http_client_post(url, data, {"content-type":"urlencode", "encoding":"UTF-8", "method":"POST"})!
			})!
			
			if(!http_client_was_error()){
				_break();
			};
			
			sleep(1000)!
		})!
		
		FAIL_ON_ERROR = _BAS_FAIL_ON_ERROR;

		var content = http_client_content('auto');
		
		if(_SMS_DEBUG){
			log((_K=="ru" ? 'Ответ от' : 'Response') + ' ' + api.name + ': ' + content);
		};

		_switch_http_client_main();
		
		_function_return(content);
	};
};
_SMS.assignApi = function(fn){
	fn.prototype = Object.create(_SMS.BaseApi.prototype);
	fn.prototype.constructor = fn;
	return fn;
};