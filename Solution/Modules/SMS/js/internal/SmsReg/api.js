_SMS.SmsRegApi = function(config){
	_SMS.BaseApi.call(this, config);
	this.type = 'sms-reg';
};
_SMS.SmsRegApi.prototype = Object.create(_SMS.BaseApi.prototype);
_SMS.SmsRegApi.prototype.constructor = _SMS.SmsRegApi;

_SMS.SmsRegApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.url + '/' + action + '.php';
	var params = api.combineParams({apikey:api.key}, options);
	
	_call_function(api.request,{api:api,url:url,method:method,params:params})!
	var content = _result_function();
	
	var resp = api.parseJSON(content);
	
	if(checkErrors && resp.response!=1){
		api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
	};

	_function_return(resp);
};
_SMS.SmsRegApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"getBalance"})!
	var resp = _result_function();
	
	_function_return(resp.balance);
};
_SMS.SmsRegApi.prototype.getNumbersCount = function(){
	var api = _function_argument("api");
	
	fail(api.name + ': ' + (_K=="ru" ? 'Данный сервис не поддерживает получение количества доступных номеров.' : 'This service does not support getting the count of available numbers.'));
};
_SMS.SmsRegApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	_call_function(api.apiRequest,{api:api,action:"getNum",options:{service:site,country:country}})!
	var resp = _result_function();
	
	var confirmData = {api: api, id: resp.tzid, origId: resp.tzid, number: null};
	
	var maxNumberWait = Date.now() + 600000;
	_do(function(){
		if(Date.now() > maxNumberWait){
			api.errorHandler("TIMEOUT_GET_STATE");
		};
		
		_call_function(api.apiRequest,{api:api,action:"getState",options:{tzid:confirmData.id},checkErrors:false})!
		var resp = _result_function();

		if(["TZ_NUM_PREPARE","TZ_NUM_WAIT","TZ_NUM_ANSWER"].indexOf(resp.response) > -1){
			confirmData.number = resp.number;
			_function_return(confirmData);
		};

		if(resp.response!="TZ_INPOOL"){
			api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
		};
		
		sleep(1000)!
	})!
};