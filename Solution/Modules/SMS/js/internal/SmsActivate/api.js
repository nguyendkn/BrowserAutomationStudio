_SMS.SmsActivateApi = function(config){
	_SMS.base.call(this, config);
	this.type = 'sms-activate';
};
_SMS.SmsActivateApi.prototype = Object.create(_SMS.base.prototype);
_SMS.SmsActivateApi.prototype.constructor = _SMS.SmsActivateApi;

_SMS.SmsActivateApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	var isJSON = _function_argument("isJSON");
	
	var url = api.url + '/stubs/handler_api.php';
	var params = api.combineParams({api_key:api.key,action:action}, options);
	
	_call_function(api.request,{api:api,url:url,method:method,params:params})!
	var content = _result_function();
	
	var resp = isJSON || (_is_nilb(isJSON) && _is_json_string(content)) ? api.parseJSON(content) : content.split(':');

	_function_return(resp);
};
_SMS.SmsActivateApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"getBalance",isJSON:false})!
	var resp = _result_function();
	
	if(resp[0]=="ACCESS_BALANCE"){
		_function_return(resp[1]);
	}else{
		api.errorHandler(resp[0], resp[1]);
	};
};
_SMS.SmsActivateApi.prototype.getNumbersCount = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	
	_call_function(api.apiRequest,{api:api,action:"getNumbersStatus",options:{country:country,operator:operator},isJSON:true})!
	var resp = _result_function();
	
	if(site=="All"){
		var sites = {};
		Object.keys(resp).filter(function(key){
			return key.slice(-2) != '_1';
		}).forEach(function(key){
			sites[key.slice(-2)=='_0' ? key.slice(0,-2) : key] = parseInt(resp[key]);
		});
		_function_return(sites);
	}else{
		_function_return(_is_nilb(resp[site + '_0']) ? resp[site] : resp[site + '_0']);
	};
};
_SMS.SmsActivateApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	_call_function(api.apiRequest,{api:api,action:"getNumber",options:{service:site,country:country,operator:operator,phoneException:phoneException},isJSON:false})!
	var resp = _result_function();
	
	if(resp[0]=="ACCESS_NUMBER"){
		_function_return({api: api, id: resp[1], origId: resp[1], number: resp[2]});
	}else{
		api.errorHandler(resp[0], resp[1]);
	};
};