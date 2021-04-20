_SMS.SmsPvaApi = function(config){
	_SMS.base.call(this, config);
	this.type = 'smspva';
};
_SMS.SmsPvaApi.prototype = Object.create(_SMS.base.prototype);
_SMS.SmsPvaApi.prototype.constructor = _SMS.SmsPvaApi;

_SMS.SmsPvaApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.url + '/priemnik.php';
	var params = api.combineParams({metod:action,apikey:api.key}, options);
	
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
_SMS.SmsPvaApi.prototype.getNumbersCount = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	
	if(site=="All"){
		fail(api.name + ': ' + (_K=="ru" ? 'Данный сервис не поддерживает получение количества номеров для всех сайтов, возможно получить количество номеров для одного сайта за раз.' : 'This service does not support getting the count of numbers for all sites, it is possible to get the count of numbers for one site at a time.'));
	};
	
	_call_function(api.apiRequest,{api:api,action:"get_count_new",options:{service:site,country:country},checkErrors:false})!
	var resp = _result_function();
	
	_function_return(resp.online);
};
_SMS.SmsPvaApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	
	_call_function(api.apiRequest,{api:api,action:"get_number",options:{service:site,country:country}})!
	var resp = _result_function();
	
	var id = resp.id;
	var countryCode = resp.CountryCode;
	var prefix = countryCode.slice(0,1)=="+" ? countryCode.slice(1) : countryCode;
	var number = prefix + resp.number;
	
	_function_return({api: api, id: id, origId: id, number: number});
};