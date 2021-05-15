_SMS.SmsRegApi = _SMS.assignApi(function(config, data){
    const api = this;
	_SMS.BaseApi.call(this, config, data, '');
	
	this.makeRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var method = _avoid_nilb(_function_argument("method"), "GET");
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/' + action + '.php';
		var params = api.combineParams({apikey:api.key}, options);
		
		_call_function(api.request,{url:url, method:method, params:params})!
		var content = _result_function();
		
		var resp = api.parseJSON(content);
		
		if(checkErrors && !_is_nilb(resp.response) && resp.response !== "1"){
			api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.makeRequest,{action:"getBalance"})!
		var resp = _result_function();
		
		_function_return(resp.balance);
	};
	
	this.getSites = function(){
		
		_call_function(api.makeRequest,{action:"getList", options:{extended:1}})!
		var resp = _result_function();
		
		_function_return(resp.services.map(function(el){return {id:el.service,name:el.description}}));
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		_call_function(api.makeRequest,{action:"getNum", options:{service:site, country:country}})!
		var resp = _result_function();
		
		var confirmData = {api:api, id:resp.tzid, number:null};
		
		var maxNumberWait = Date.now() + 600000;
		_do(function(){
			if(Date.now() > maxNumberWait){
				api.errorHandler("ACTION_TIMEOUT", "getState");
			};
			
			_call_function(api.getState,{confirmData:confirmData})!
			var resp = _result_function();

			if(["TZ_NUM_PREPARE","TZ_NUM_WAIT","TZ_NUM_ANSWER"].indexOf(resp.response) > -1){
				confirmData.number = api.removePlus(resp.number);
				_function_return(confirmData);
			};

			if(resp.response!="TZ_INPOOL"){
				api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
			};
			
			_call_function(api.sleep,{time:5000})!
		})!
	};
	
	this.getState = function(){
		var number = _function_argument("number");
		var confirmData = _function_argument("confirmData");
		if(_is_nilb(confirmData)){
			confirmData = _SMS.confirmData[number];
		};
		
		_call_function(api.makeRequest,{action:"getState", options:{tzid:confirmData.id}, checkErrors:false})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var status = _function_argument("status").toString();
		
		var actions = {
			"-1":"setOperationUsed",
			"1":"setReady",
			//"3":"getNumRepeat",
			"6":"setOperationOk",
			"8":"setOperationUsed"
		};
		
		if(Object.keys(actions).indexOf(status) < 0){
			_function_return();
		};
		
		var taskId = _SMS.confirmData[number].id;
		
		_call_function(api.makeRequest,{action:actions[status], options:{tzid:taskId}, checkErrors:("1" !== status)})!
		var resp = _result_function();
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var code = null;
		
		_call_function(api.getState,{number:number})!
		var resp = _result_function();
		
		if(['TZ_NUM_ANSWER','TZ_OVER_OK'].indexOf(resp.response) > -1){
			var new_code = _is_nilb(resp.msg) ? resp.full_msg : resp.msg;
			if(!confirmData.repeat || _is_nilb(confirmData.code) || new_code !== confirmData.code){
				code = new_code;
				confirmData.code = new_code;
			};
		}else{
			if(['TZ_NUM_WAIT','TZ_NUM_PREPARE'].indexOf(resp.response) < 0){
				api.errorHandler(resp.error_msg ? resp.error_msg : resp.response);
			};
		};
			
		_function_return(code);
	};
	
	this.getErrorObject = function(error, data){
		var errors = {
			"ERROR_WRONG_KEY": {
				"ru": "Неверный API-ключ.",
				"en": "Invalid API key.",
				"action": "die",
				"instantly": true
			},
			"ERROR_KEY_NEED_CHANGE": {
				"ru": "API-ключ требует замены.",
				"en": "API key needs to be replaced.",
				"action": "die",
				"instantly": true
			},
			"ERROR_NO_KEY": {
				"ru": "API-ключ не указан.",
				"en": "API key not specified.",
				"action": "die",
				"instantly": true
			},
			"WARNING_LOW_BALANCE": {
				"ru": "Недостаточно денег на счету.",
				"en": "Not enough money in the account.",
				"action": "die",
				"instantly": false
			},
			"Service not define": {
				"ru": "Сервис не определен.",
				"en": "Service not defined.",
				"action": "fail"
			},
			"TZID must be number": {
				"ru": "Значение TZID должно быть числом.",
				"en": "The TZID value must be a number.",
				"action": "fail"
			},
			"There is no TZID value": {
				"ru": "TZID не указано.",
				"en": "TZID not specified.",
				"action": "fail"
			},
			"Wrong characters in parameters": {
				"ru": "Недопустимые символы в передаваемых данных.",
				"en": "Invalid characters in the transmitted data.",
				"action": "fail"
			},
			"Rate change can be made when all current operations finished": {
				"ru": "Изменение ставки возможно после завершения всех операций.",
				"en": "Changing the rate is possible after the completion of all operations.",
				"action": "fail"
			},
			"WARNING_WAIT15MIN": {
				"ru": "Вы не использовали много из выданных номеров и поэтому выдача новых номеров заморожена на 15 минут.",
				"en": "You have not used many of the issued numbers and therefore the issuance of new numbers is frozen for 15 minutes.",
				"action": "fail"
			},
			"WARNING_NO_NUMS": {
				"ru": "Нет подходящих номеров.",
				"en": "No matching numbers.",
				"action": "fail"
			},
			"TZ_OVER_OK": {
				"ru": "Операция завершена.",
				"en": "Operation completed.",
				"action": "fail"
			},
			"TZ_OVER_EMPTY": {
				"ru": "Ответ не поступил за отведенное время.",
				"en": "The answer was not received within the allotted time.",
				"action": "fail"
			},
			"TZ_OVER_NR": {
				"ru": "Вы не отправили запрос методом setReady.",
				"en": "You did not send the request with the setReady method.",
				"action": "fail"
			},
			"TZ_DELETED": {
				"ru": "Операция удалена, средства возвращены.",
				"en": "Operation deleted, funds returned.",
				"action": "fail"
			},
			"0": {
				"ru": "Повтор по указанной операции невозможен.",
				"en": "Repeat for the specified operation is not possible.",
				"action": "fail"
			},
			"2": {
				"ru": "Номер оффлайн, используйте метод getNumRepeatOffline.",
				"en": "Number offline, use the getNumRepeatOffline method.",
				"action": "fail"
			},
			"3": {
				"ru": "Операция удалена, средства возвращены.",
				"en": "Operation deleted, funds returned.",
				"action": "fail"
			}
		};
		var errorObj = errors[error];
		if(_is_nilb(errorObj)){
			var reg = /(\S+) to this TZID not applicable/;
			if(reg.test(error)){
				var method = error.match(reg)[1];
				errorObj = {
					"ru": "Метод " + method + " не применим к указанному TZID.",
					"en": "The " + method + " method is not applicable to the specified TZID.",
					"action": "fail"
				};
			}else{
				var reg = /There is no (\S+) value/;
				if(reg.test(error)){
					var parameter = error.match(reg2)[1];
					errorObj = {
						"ru": "Параметр " + parameter + " не указан.",
						"en": "Parameter " + parameter + " not specified.",
						"action": "fail"
					};
				};
			};
		};
		return errorObj;
	};
});