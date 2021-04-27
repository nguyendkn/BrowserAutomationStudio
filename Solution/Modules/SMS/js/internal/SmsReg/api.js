_SMS.SmsRegApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'sms-reg');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var method = _avoid_nilb(_function_argument("method"), "GET");
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/' + action + '.php';
		var params = api.combineParams({apikey:api.key}, options);
		
		_call_function(api.request,{url:url, method:method, params:params})!
		var content = _result_function();
		
		var resp = api.parseJSON(content);
		
		if(checkErrors && resp.response!=1){
			api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.apiRequest,{action:"getBalance"})!
		var resp = _result_function();
		
		_function_return(resp.balance);
	};
	
	this.getNumbersCount = function(){
		fail(api.name + ': ' + (_K=="ru" ? 'Данный сервис не поддерживает получение количества доступных номеров.' : 'This service does not support getting the count of available numbers.'));
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		var phoneException = _function_argument("phoneException");
		
		_call_function(api.apiRequest,{action:"getNum", options:{service:site, country:country}})!
		var resp = _result_function();
		
		var confirmData = {api:api, id:resp.tzid, lastId:resp.tzid, number:null};
		
		var maxNumberWait = Date.now() + 600000;
		_do(function(){
			if(Date.now() > maxNumberWait){
				api.errorHandler("ACTION_TIMEOUT", "getState");
			};
			
			_call_function(api.getStatus,{confirmData:confirmData})!
			var resp = _result_function();

			if(["TZ_NUM_PREPARE","TZ_NUM_WAIT","TZ_NUM_ANSWER"].indexOf(resp.response) > -1){
				confirmData.number = api.removePlus(resp.number);
				_function_return(confirmData);
			};

			if(resp.response!="TZ_INPOOL"){
				api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
			};
			
			sleep(1000)!
		})!
	};
	
	this.getStatus = function(){
		var confirmData = _function_argument("confirmData");
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getState", options:{tzid:taskId}, checkErrors:false})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var confirmData = _function_argument("confirmData");
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		var actions = {
			"-1":"setOperationUsed",
			"1":"setReady",
			"3":"getNumRepeat",
			"6":"setOperationOk",
			"8":"setOperationUsed"
		};
		
		api.validateStatus(Object.keys(actions), status);
		
		var action = actions[status];
		
		_call_function(api.apiRequest,{action:action, options:{tzid:taskId}})!
	};
	
	this.getCode = function(){
		var confirmData = _function_argument("confirmData");
		var code = null;
		
		_call_function(api.getStatus,{confirmData:confirmData})!
		var resp = _result_function();
		
		if(resp.response=='TZ_NUM_ANSWER'){
			code = _is_nilb(resp.msg) ? resp.full_msg : resp.msg;
		}else{
			if(resp.response != 'TZ_NUM_WAIT'){
				api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
			};
		};
			
		_function_return(code);
	};
});