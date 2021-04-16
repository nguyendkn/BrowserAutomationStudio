_SMS.SmsPvaApi = function(config){
	_SMS.base.call(this, config);
	this.apiType = 'smspva';
};
_SMS.SmsPvaApi.prototype = Object.create(_SMS.base.prototype);
_SMS.SmsPvaApi.prototype.constructor = _SMS.SmsPvaApi;

_SMS.SmsPvaApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.apiUrl + '/priemnik.php';
	var params = api.combineParams({metod:action,apikey:api.apiKey}, options);
	
	_call_function(api.request,{api:api,url:url,method:"GET",params:params})!
	var content = _result_function();
	
	if(!_is_json_string(content)){
		api.errorHandler(content);
	};
	
	var resp = api.parseJSON(content);
	
	if(checkErrors && resp.response!=="1"){
		api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
	};

	_function_return(resp);
};
_SMS.SmsPvaApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"get_balance"})!
	var resp = _result_function();
	
	_function_return(resp.balance);
};
_SMS.SmsPvaApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	_call_function(api.apiRequest,{api:api,action:"get_number",options:{service:site,country:country}})!
	var resp = _result_function();
	
	var id = resp.id;
	var countryCode = resp.CountryCode;
	var prefix = countryCode.slice(0,1)=="+" ? countryCode.slice(1) : countryCode;
	var number = prefix + resp.number;
	
	_function_return({api: api, id: id, origId: id, number: number});
};