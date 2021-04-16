_SMS.VakSmsApi = function(config){
	_SMS.base.call(this, config);
	this.apiType = 'vak-sms';
};
_SMS.VakSmsApi.prototype = Object.create(_SMS.base.prototype);
_SMS.VakSmsApi.prototype.constructor = _SMS.VakSmsApi;

_SMS.VakSmsApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.apiUrl + '/api/' + action + '/';
	var params = api.combineParams({apiKey:api.apiKey}, options);
	
	_call_function(api.request,{api:api,url:url,method:"GET",params:params})!
	var content = _result_function();
	
	var resp = api.parseJSON(content);
	
	if(checkErrors && resp.error){
		api.errorHandler(resp.error);
	};

	_function_return(resp);
};
_SMS.VakSmsApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"getBalance"})!
	var resp = _result_function();
	
	_function_return(resp.balance);
};
_SMS.VakSmsApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	var options = {service:site,country:country};
	
	if(!_is_nilb(operator)){
		options.operator = operator;
	};
	
	_call_function(api.apiRequest,{api:api,action:"getNumber",options:{service:site,country:country}})!
	var resp = _result_function();
	
	_function_return({api: api, id: resp.idNum, origId: resp.idNum, number: resp.tel});
};