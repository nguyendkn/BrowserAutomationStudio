_SMS.SmsPvaApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'smspva');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/priemnik.php';
		var params = api.combineParams({metod:action, apikey:api.key}, options);
		
		_call_function(api.request,{url:url, method:"GET", params:params})!
		var content = _result_function();
		
		api.banThread(20);
		
		if(!_is_json_string(content)){
			api.errorHandler(content);
		};
		
		var resp = api.parseJSON(content);
		
		if(res.response=="5"){
			api.banService(60);
		};
		
		if(res.response=="6"){
			api.banService(600);
		};
		
		if(checkErrors && resp.response!=="1"){
			api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.apiRequest,{action:"get_balance"})!
		var resp = _result_function();
		
		_function_return(resp.balance);
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		if(site=="All"){
			fail(api.name + ': ' + (_K=="ru" ? 'Данный сервис не поддерживает получение количества номеров для всех сайтов, возможно получить количество номеров для одного сайта за раз.' : 'This service does not support getting the count of numbers for all sites, it is possible to get the count of numbers for one site at a time.'));
		};
		
		_call_function(api.apiRequest,{action:"get_count_new", options:{service:site, country:country}, checkErrors:false})!
		var resp = _result_function();
		
		_function_return(resp.online);
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		_call_function(api.apiRequest,{action:"get_number", options:{service:site, country:country}})!
		var resp = _result_function();
		
		var id = resp.id;
		var prefix = api.removePlus(resp.CountryCode);
		var numberWithoutPrefix = resp.number;
		var number = prefix + resp.number;
		
		_function_return({api:api, id:id, lastId:id, number:number, numberWithoutPrefix:numberWithoutPrefix, prefix:prefix});
	};
	
	this.getStatus = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"get_sms", options:{id:taskId}, checkErrors:false})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		var actions = {
			"-1":"denial",
			"1":"1",
			"3":"get_clearsms",
			"6":"6",
			"8":"ban"
		};
		
		api.validateStatus(Object.keys(actions), status);
		
		_if(status !== "1" && status !== "6", function(){
			_call_function(api.apiRequest,{action:actions[status], options:{id:taskId}})!
		})!
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var code = null;
		
		_call_function(api.getStatus,{number:number})!
		var resp = _result_function();
		
		if(resp.response==1){
			code = resp.sms;
		}else{
			if(resp.response !== 2){
				api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
			};
		};
			
		_function_return(code);
	};
});