_SMS.base = function(config){
	var data = config.data;
	var serverUrl = data.serverUrl;
	this.apiKey = data.apiKey;
	this.apiUrl = config.apiUrl;
	this.service = data.service;
	this.serviceName = config.serviceName;
	this.refId = config.refId;
	this.refTitle = config.refTitle;
	if(!_is_nilb(serverUrl)){
		var url = serverUrl.slice(-1)=="/" ? serverUrl.slice(0, -1) : serverUrl;
		var name = url.replace(new RegExp('https?://'),"").replace(/^(?:\d+)?api(?:\d+)?./,"");
		this.apiUrl = url;
		this.serviceName = name.slice(0, 1).toLocaleUpperCase() + name.slice(1);
	};
};
_SMS.base.prototype.combineParams = function(params, options, labels){
	labels = _avoid_nilb(labels, {});
	var keys = Object.keys(options);
	if(keys.length > 0){
		keys.forEach(function(key){params[labels[key] ? labels[key] : key] = options[key]});
	};
	return params;
};	
_SMS.base.prototype.paramsToString = function(params){
	return Object.keys(params).map(function(key){
		return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
	}).join('&');
};
_SMS.base.prototype.paramsToArray = function(params){
	var data = [];
	Object.keys(params).forEach(function(key){
		data.push(key);
		data.push(params[key]);
	});
	return data;
};
_SMS.base.prototype.parseJSON = function(data){
	try{
		var json = JSON.parse(data);
	}catch(e){
		this.errorHandler("RESPONSE_IS_NOT_JSON");
	};
	return json;
};
_SMS.base.prototype.request = function(){
	var api = _function_argument("api");
	var url = _function_argument("url");
	var method = _function_argument("method");
	var params = _function_argument("params");
	
	if(!_is_nilb(api.refId)){
		params[api.refTitle] = api.refId;
	};
	
	if(Object.keys(params).length>0){
		if(method=="GET"){
			url += '?' + api.paramsToString(params);
		}else{
			var data = api.paramsToArray(params);
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
			api.errorHandler("FAILED_REQUEST");
		};
		
		_if_else(method=="GET", function(){
			if(_SMS_DEBUG){
				log((_K=="ru" ? 'Запрос к API' : 'API request') + ' ' + api.serviceName + ': ' + url);
			};
			http_client_get2(url,{"method":"GET"})!
		}, function(){
			if(_SMS_DEBUG){
				log((_K=="ru" ? 'Запрос к API' : 'API request') + ' ' + api.serviceName + ': ' + url + ', ' + (_K=="ru" ? 'данные' : 'data') + ': ' + api.paramsToString(params));
			};
			http_client_post(url, data, {"content-type":"urlencode","encoding":"UTF-8","method":"POST"})!
		})!
		
		if(!http_client_was_error()){
			_break();
		};
		
		sleep(1000)!
	})!
	
	FAIL_ON_ERROR = _BAS_FAIL_ON_ERROR;

	var content = http_client_content();
	
	if(_SMS_DEBUG){
		log((_K=="ru" ? 'Ответ от API' : 'API response') + ' ' + api.serviceName + ': ' + content);
	};

	_switch_http_client_main();
	
	_function_return(content);
};