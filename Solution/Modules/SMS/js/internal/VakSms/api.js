_SMS.VakSmsApi = _SMS.assignApi(function(config, data){
    const api = this;
	_SMS.BaseApi.call(this, config, data, '/api');
	
	this.apiRequest = function(){
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
		_call_function(api.apiRequest,{action:"getBalance"})!
		var resp = _result_function();
		
		_function_return(resp.balance);
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_if_else(site=="All", function(){
			_call_function(api.apiRequest,{action:"getCountNumberList", options:{country:country, operator:operator}})!
			var resp = _result_function();
			
			Object.keys(resp).map(function(key){
				resp[key] = parseInt(resp[key].count);
			});
			_function_return(resp);
		}, function(){
			_call_function(api.apiRequest,{action:"getCountNumber", options:{service:site, country:country, operator:operator}})!
			var resp = _result_function();
			
			_function_return(resp[Object.keys(resp)[0]]);
		})!
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_call_function(api.apiRequest,{action:"getNumber", options:{service:site, country:country, operator:operator}})!
		var resp = _result_function();
		
		_function_return({api:api, id:resp.idNum, lastId:resp.idNum, number:api.removePlus(resp.tel)});
	};
	
	this.getStatus = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getSmsCode", options:{idNum:taskId}})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		var actions = {
			"-1":"end",
			"1":"1",
			"3":"send",
			"6":"6",
			"8":"bad"
		};
		
		api.validateStatus(Object.keys(actions), status);
		
		_if(status !== "1" && status !== "6", function(){
			_call_function(api.apiRequest,{action:"setStatus", options:{idNum:taskId, status:actions[status]}})!
			var resp = _result_function();
			
			if(["ready","update"].indexOf(resp.status) < 0){
				api.errorHandler(resp.status);
			};
		})!
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		
		_call_function(api.getStatus,{number:number})!
		var resp = _result_function();
			
		_function_return(resp.smsCode);
	};
	
	this.getErrorObject = function(error, data){
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
				"ru": "Оператор не найдет для запрашиваемой страны.",
				"en": "The operator will not find for the requested country.",
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
				"ru": "На этот номер уже отправлено смс, отмена невозможна.",
				"en": "This number has already been sent sms, cancellation is not possible.",
				"action": "fail"
			}
		};
		return errors[error];
	};
});