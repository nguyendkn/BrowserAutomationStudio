_SMS.GiveSmsApi = function(config){
	_SMS.base.call(this, config);
	this.type = 'give-sms';
};
_SMS.GiveSmsApi.prototype = Object.create(_SMS.base.prototype);
_SMS.GiveSmsApi.prototype.constructor = _SMS.GiveSmsApi;

_SMS.GiveSmsApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.url + '/api/v1/';
	var params = api.combineParams({method:action,userkey:api.key}, options);
	
	_call_function(api.request,{api:api,url:url,method:"GET",params:params})!
	var content = _result_function();
	
	var resp = api.parseJSON(content);
	
	if(checkErrors && resp.status!=200){
		api.errorHandler(resp.status, resp.data.msg);
	};

	_function_return(resp.data);
};
_SMS.GiveSmsApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"getbalance"})!
	var resp = _result_function();
	
	_function_return(resp.balance);
};
_SMS.GiveSmsApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	var options = {service:site,country:country};
	
	if(!_is_nilb(operator)){
		options.operator = operator;
	};
	
	_call_function(api.apiRequest,{api:api,action:"getnumber",options:options})!
	var resp = _result_function();
	
	_function_return({api: api, id: resp.order_id, origId: resp.order_id, number: ('7' + resp.phone)});
};