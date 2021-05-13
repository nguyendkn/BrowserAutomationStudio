_SMS.SmsActivateApi = _SMS.assignApi(function(config, data){
    const api = this;
	_SMS.BaseApi.call(this, config, data, '/stubs/handler_api.php');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var method = _avoid_nilb(_function_argument("method"), "GET");
		var isJSON = _function_argument("isJSON");
		
		var params = api.combineParams({api_key:api.key, action:action}, options);
		
		_call_function(api.request,{url:api.url, method:method, params:params})!
		var content = _result_function();
		
		if(_is_json_string(content)){
			var resp = api.parseJSON(content);
		}else{
			content = content.split(':');
			var resp = {status:content[0]};
			var data = content.slice(1);
			var len = data.length;
			if(len==2){
				resp.id = data[0];
				resp.number = data[1];
			}else{
				resp.data = data[0];
			};
			if(isJSON){
				api.errorHandler(resp.status, resp.data);
			};
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.apiRequest,{action:"getBalance"})!
		var resp = _result_function();
		
		if(resp.status=="ACCESS_BALANCE"){
			_function_return(resp.data);
		}else{
			api.errorHandler(resp.status, resp.data);
		};
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_call_function(api.apiRequest,{action:"getNumbersStatus", options:{country:country, operator:operator}, isJSON:true})!
		var resp = _result_function();
		
		if(site=="All"){
			var sites = {};
			Object.keys(resp).forEach(function(key){
				var end = key.slice(-2);
				if(end != '_1'){
					sites[end=='_0' ? key.slice(0,-2) : key] = parseInt(resp[key]);
				};
			});
			_function_return(sites);
		}else{
			_function_return(_is_nilb(resp[site + '_0']) ? resp[site] : resp[site + '_0']);
		};
	};
	
	this.getSites = function(){
		
		_call_function(api.apiRequest,{action:"getServices", isJSON:true})!
		var resp = _result_function();
		
		_function_return(resp);
	};
	
	this.getCountries = function(){
		
		_call_function(api.apiRequest,{action:"getCountries", isJSON:true})!
		var resp = _result_function();
		
		_function_return(Array.isArray(resp) ? resp : Object.keys(resp).map(function(key){
			resp[key].name = resp[key].rus;
			resp[key].name_en = resp[key].eng;
			resp[key].name_ch = resp[key].chn;
			resp[key].id = String(resp[key].id);
			delete resp[key].rus;
			delete resp[key].eng;
			delete resp[key].chn;
			return resp[key];
		}));
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		
		_call_function(api.apiRequest,{action:"getNumber", options:{service:site, country:country, operator:operator}})!
		var resp = _result_function();
		
		if(resp.status=="ACCESS_NUMBER"){
			_function_return({api:api, id:resp.id, lastId:resp.id, number:api.removePlus(resp.number)});
		}else{
			api.errorHandler(resp.status, resp.data);
		};
	};
	
	this.getStatus = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getStatus", options:{id:taskId}})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		if(status=="8" && api.service=="getsms.online"){
			status = "10";
		};
		
		_call_function(api.apiRequest,{action:"setStatus", options:{id:taskId, status:status}})!
		var resp = _result_function();
		
		if(resp.status.indexOf('ACCESS_') != 0){
			api.errorHandler(resp.status, resp.data);
		};
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var confirmData = _SMS.confirmData[number];
		var code = null;
		
		_call_function(api.getStatus,{number:number})!
		var resp = _result_function();
		
		if(resp.status=='STATUS_OK'){
			code = resp.data;
		}else{
			if(resp.status.indexOf('STATUS_WAIT_') != 0){
				api.errorHandler(resp.status, resp.data);
			};
		};
			
		_function_return(code);
	};
	
	this.getErrorObject = function(error, data){
		var errors = {
			"BAD_KEY": {
				"ru": "Неверный API-ключ.",
				"en": "Invalid API key.",
				"action": "die",
				"instantly": true
			},
			"NO_KEY": {
				"ru": "API-ключ не указан.",
				"en": "API key not specified.",
				"action": "die",
				"instantly": true
			},
			"NO_BALANCE": {
				"ru": "Закончился баланс.",
				"en": "Balance ended.",
				"action": "die",
				"instantly": false
			},
			"NO_MEANS": {
				"ru": "Закончился баланс.",
				"en": "Balance ended.",
				"action": "die",
				"instantly": false
			},
			"NO_NUMBERS": {
				"ru": "Нет номеров.",
				"en": "No numbers.",
				"action": "fail"
			},
			"ERROR_SQL": {
				"ru": "Ошибка SQL-сервера.",
				"en": "SQL Server Error.",
				"action": "fail"
			},
			"BAD_ACTION": {
				"ru": "Некорректное действие.",
				"en": "Incorrect action.",
				"action": "fail"
			},
			"BAD_SERVICE": {
				"ru": "Некорректное наименование сервиса.",
				"en": "Incorrect service name.",
				"action": "fail"
			},
			"WRONG_SERVICE": {
				"ru": "Неверный идентификатор сервиса.",
				"en": "Invalid service identifier.",
				"action": "fail"
			},
			"WRONG_EXCEPTION_PHONE": {
				"ru": "Некорректные исключающие префиксы.",
				"en": "Invalid exclusion prefixes.",
				"action": "fail"
			},
			"NO_BALANCE_FORWARD": {
				"ru": "Недостаточно средств для покупки переадресации.",
				"en": "Iinsufficient funds to buy call forwarding.",
				"action": "die",
				"instantly": false
			},
			"BAD_FORWARD": {
				"ru": "Некорректно указана переадресация.",
				"en": "Redirection specified incorrectly.",
				"action": "fail"
			},
			"NOT_AVAILABLE": {
				"ru": "Для страны, которую вы используете, недоступна покупка мультисервисов.",
				"en": "Multiservice purchase is not available for the country you are using.",
				"action": "fail"
			},
			"NO_ACTIVATION": {
				"ru": "id активации не существует.",
				"en": "Activation id does not exist.",
				"action": "fail"
			},
			"WRONG_ADDITIONAL_SERVICE": {
				"ru": "Неверный дополнительный сервис (допустимы только сервисы для переадресации).",
				"en": "Invalid additional service (only services for redirection are allowed).",
				"action": "fail"
			},
			"WRONG_ACTIVATION_ID": {
				"ru": "Неверный ID родительской активации.",
				"en": "Invalid Parent Activation ID.",
				"action": "fail"
			},
			"WRONG_SECURITY": {
				"ru": "Ошибка при попытке передать ID активации без переадресации, или же завершенной/не активной активации.",
				"en": "An error occurred while trying to transfer an activation ID without forwarding, or a completed/inactive activation.",
				"action": "fail"
			},
			"REPEAT_ADDITIONAL_SERVICE": {
				"ru": "Ошибка возникает при попытке заказать купленный сервис еще раз.",
				"en": "An error occurs when trying to order a purchased service again.",
				"action": "fail"
			},
			"ACCOUNT_INACTIVE": {
				"ru": "Свободных номеров нет.",
				"en": "No numbers.",
				"action": "fail"
			},
			"NO_ID_RENT": {
				"ru": "Не указан id Аренды.",
				"en": "Rent id not specified.",
				"action": "fail"
			},
			"INVALID_PHONE": {
				"ru": "Номер арендован не вами (неправильный id аренды).",
				"en": "Number is not rented by you (wrong rental id).",
				"action": "fail"
			},
			"STATUS_FINISH": {
				"ru": "Аренда оплачна и завершена.",
				"en": "Rent paid and completed.",
				"action": "fail"
			},
			"STATUS_CANCEL": {
				"ru": "Аренда отменена с возвратом денег.",
				"en": "Rent canceled with refund.",
				"action": "fail"
			},
			"STATUS_WAIT_CODE": {
				"ru": "Ожидание первой смс.",
				"en": "Waiting for the first sms.",
				"action": "fail"
			},
			"INCORECT_STATUS": {
				"ru": "Отсутствует или неправильно указан статус.",
				"en": "Missing or incorrect status.",
				"action": "fail"
			},
			"CANT_CANCEL": {
				"ru": "Невозможно отменить аренду (более 20 мин.).",
				"en": "It is impossible to cancel the rental (more than 20 minutes).",
				"action": "fail"
			},
			"ALREADY_FINISH": {
				"ru": "Аренда уже завершена.",
				"en": "Rental is already completed.",
				"action": "fail"
			},
			"ALREADY_CANCEL": {
				"ru": "Аренда уже отменена.",
				"en": "Rent already canceled.",
				"action": "fail"
			},
			"RENT_DIE": {
				"ru": "Аренду невозможно продлить, так как срок жизни номера истёк.",
				"en": "Rent cannot be extended because the number has expired.",
				"action": "fail"
			},
			"WRONG_OPERATOR": {
				"ru": "Оператор переданной аренды не MTT.",
				"en": "Rent transferred operator not MTT.",
				"action": "fail"
			},
			"INVALID_TIME": {
				"ru": "Неверное время. Доступное количество часов от 4 до 1344.",
				"en": "Wrong time. Available number of hours from 4 to 1344.",
				"action": "fail"
			},
			"BANNED": {
				"ru": "Аккаунт заблокирован до " + data,
				"en": "Account blocked until " + data,
				"action": "fail"
			}
		};
		return errors[error];
	};
});