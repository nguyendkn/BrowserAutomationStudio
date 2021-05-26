_SMS.VakSmsApi = _SMS.assignApi(function(config, data){
    const api = this;
	_SMS.BaseApi.call(this, config, data, '/api');
	
	this.makeRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/' + action + '/';
		var params = api.combineParams({apiKey:api.key}, options);
		
		_call_function(api.request,{url:url, method:"GET", params:params})!
		var content = _result_function();
		
		var resp = api.parseJSON(content);
		
		if(checkErrors && resp.error){
			api.errorHandler(resp.error);
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.makeRequest,{action:"getBalance"})!
		var resp = _result_function();
		
		_function_return(resp.balance);
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_call_function(api.makeRequest,{action:(site=="All" ? "getCountNumberList" : "getCountNumber"), options:{service:(site=="All" ? "" : site), country:country, operator:operator}})!
		var resp = _result_function();
		
		if(site=="All"){
			for(var key in resp){
				resp[key] = parseInt(resp[key].count);
			};
		}else{
			resp = resp[Object.keys(resp)[0]];
		};
		
		_function_return(resp);
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_call_function(api.makeRequest,{action:"getNumber", options:{service:site, country:country, operator:operator}})!
		var resp = _result_function();
		
		_function_return({api:api, id:resp.idNum, number:api.removePlus(resp.tel.toString())});
	};
	
	this.getState = function(){
		var number = _function_argument("number");
		var taskId = _SMS.confirmData[number].id;
		
		_call_function(api.makeRequest,{action:"getSmsCode", options:{idNum:taskId}})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var status = _function_argument("status").toString();
		
		var actions = {
			"-1":"end",
			"3":"send",
			"8":"bad"
		};
		
		if(!actions.hasOwnProperty(status)){
			_function_return();
		};
		
		var taskId = _SMS.confirmData[number].id;
		
		_call_function(api.makeRequest,{action:"setStatus", options:{idNum:taskId, status:actions[status]}})!
		var resp = _result_function();
		
		if(["ready","update"].indexOf(resp.status) < 0){
			api.errorHandler(resp.status);
		};
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		
		_call_function(api.getState,{number:number})!
		var resp = _result_function();
			
		_function_return(resp.smsCode);
	};
	
	this.getError = function(error, data){
		var errors = {
			"apiKeyNotFound": {
				"ru": "Неверный API-ключ.",
				"en": "Invalid API key.",
				"action": "die",
				"instantly": true
			},
			"noMoney": {
				"ru": "Недостаточно денег на счету.",
				"en": "Not enough money in the account.",
				"action": "die",
				"instantly": false
			},
			"noService": {
				"ru": "Данный сервис не поддерживается, свяжитесь с администрацией сайта.",
				"en": "This service is not supported, please contact the site administration.",
				"action": "fail"
			},
			"noCountry": {
				"ru": "Запрашиваемая страна отсутствует.",
				"en": "The requested country is missing.",
				"action": "fail"
			},
			"noOperator": {
				"ru": "Оператор не найден для запрашиваемой страны.",
				"en": "Operator not found for the requested country.",
				"action": "fail"
			},
			"noNumber": {
				"ru": "Нет номеров, попробуйте позже.",
				"en": "No numbers, please try later.",
				"action": "fail"
			},
			"badStatus": {
				"ru": "Неверный статус.",
				"en": "Invalid status.",
				"action": "fail"
			},
			"idNumNotFound": {
				"ru": "Неверный ID операции.",
				"en": "Invalid operation ID.",
				"action": "fail"
			},
			"badService": {
				"ru": "Неверный код сайта, сервиса, соц.сети.",
				"en": "Invalid website, service, social network code.",
				"action": "fail"
			},
			"badData": {
				"ru": "Отправлены неверные данные.",
				"en": "Invalid data sent.",
				"action": "fail"
			},
			"smsReceived": {
				"ru": "На этот номер уже получен код подтверждения, отмена невозможна.",
				"en": "This number has already received a confirmation code, cancellation is not possible.",
				"action": "fail"
			},
			"waitSMS": {
				"ru": "На этот номер уже отправлено SMS, отмена невозможна.",
				"en": "This number has already been sent SMS, cancellation is not possible.",
				"action": "fail"
			}
		};
		return errors[error];
	};
});