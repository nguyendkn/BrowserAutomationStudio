_SMS.GiveSmsApi = _SMS.assignApi(function(config, data){
    const api = this;
	_SMS.BaseApi.call(this, config, data, '/api/v1/');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var params = api.combineParams({method:action, userkey:api.key}, options);
		
		_call_function(api.request,{url:api.url, method:"GET", params:params})!
		var content = _result_function();
		
		var resp = api.parseJSON(content);
		
		if(checkErrors && resp.status!=200){
			api.errorHandler(resp.status, resp.data.msg);
		};

		_function_return(resp.data);
	};
	
	this.getBalance = function(){
		_call_function(api.apiRequest,{action:"getbalance"})!
		var resp = _result_function();
		
		_function_return(resp.balance);
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var operator = _function_argument("operator");
		
		_call_function(api.apiRequest,{action:"getcount"})!
		var resp = _result_function();
		
		var sites = resp[_is_nilb(operator) ? "ANY" : operator.toLocaleUpperCase()];
		
		if(site=="All"){
			Object.keys(sites).map(function(key){
				sites[key] = parseInt(sites[key].count);
			});
			_function_return(sites);
		}else{
			_function_return(sites[site].count);
		};
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_call_function(api.apiRequest,{action:"getnumber", options:{service:site, country:country, operator:operator}})!
		var resp = _result_function();
		
		_function_return({api:api, id:resp.order_id, lastId:resp.order_id, number:('7' + resp.phone)});
	};
	
	this.getStatus = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var taskId = confirmData.id;
		var lastId = confirmData.lastId;
		
		var action = "getcode";
		var options = {order_id:taskId};
		if(confirmData.repeat){
			action = "wrongcode";
			options.last_id = lastId;
		};
		
		_call_function(api.apiRequest,{action:action, options:options, checkErrors:false})!
		var resp = _result_function();
			
		if(!_is_nilb(resp.data.id)){
			confirmData.lastId = resp.data.id;
		};
		
		_function_return(resp);
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		api.validateStatus(["-1","1","3","6","8"], status);
		
		_if(status=="-1" || status=="8", function(){
			_call_function(api.apiRequest,{action:(status=="-1" ? "refusenumber" : "bannumber"), options:{order_id:taskId}})!
		})!
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var code = null;
		
		_call_function(api.getStatus,{number:number})!
		var resp = _result_function();
		
		if(resp.status==200){
			code = _is_nilb(resp.data.code) ? resp.data.fullSms : resp.data.code;
		}else{
			if(resp.status !== 400){
				api.errorHandler(resp.status, resp.data.msg);
			};
		};
			
		_function_return(code);
	};
	
	this.getErrorObject = function(error, data){
		var errors = {
			"401": {
				"ru": "Неверный API-ключ.",
				"en": "Invalid API key.",
				"action": "die",
				"instantly": true
			},
			"404": {
				"ru": "Неправильно задан параметр method.",
				"en": "The method parameter is set incorrectly.",
				"action": "fail"
			},
			"500": {
				"ru": "Ошибка при обработке запроса / Нет доступных номеров / Истекло время заказа.",
				"en": "Error processing request / No numbers available / Time of order expired.",
				"action": "fail"
			},
			"502": {
				"ru": "Сервис не существует.",
				"en": "Service does not exist.",
				"action": "fail"
			},
			"503": {
				"ru": "Оператора не существует.",
				"en": "Operator does not exist.",
				"action": "fail"
			},
			"504": {
				"ru": "Недостаточно денег на счету.",
				"en": "Not enough money in the account.",
				"action": "die",
				"instantly": false
			},
			"505": {
				"ru": "Страна не существует.",
				"en": "Country does not exist.",
				"action": "fail"
			},
			"506": {
				"ru": "Не указан параметр order_id.",
				"en": "order_id parameter not specified.",
				"action": "fail"
			},
			"666": {
				"ru": "Многократный бан номеров.",
				"en": "Multiple ban of numbers.",
				"action": "fail"
			}
		};
		return errors[error];
	};
});