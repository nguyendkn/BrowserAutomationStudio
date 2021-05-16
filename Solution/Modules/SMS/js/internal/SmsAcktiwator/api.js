_SMS.SmsAcktiwatorApi = _SMS.assignApi(function(config, data){
    const api = this;
	_SMS.BaseApi.call(this, config, data, '/api');
	
	this.makeRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/' + action + '/' + api.key;
		var params = api.combineParams({}, options);
		
		_call_function(api.request,{url:url, method:"GET", params:params})!
		var content = _result_function();
		var resp = content;
		
		if(_is_json_string(content)){
			resp = api.parseJSON(content);
			
			if(checkErrors && (resp.code=="error" || !_is_nilb(resp.code) || resp.error)){
				api.errorHandler(!_is_nilb(resp.code) ? resp.code : resp.error, resp.message);
			};	
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.makeRequest,{action:"getbalance"})!
		var resp = _result_function();
		
		_function_return(resp);
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		_call_function(api.makeRequest,{action:"numbersstatus", options:{code:country}})!
		var resp = _result_function();
		
		if(site=="All"){
			var sites = {};
			resp.forEach(function(data){
				sites[data.id] = parseInt(data.count);
			});
			_function_return(sites);
		}else{
			var data = resp.filter(function(e){return e.id==parseInt(site) || e.name==site})[0];
			_function_return(_is_nilb(data) ? null : data.count);
		};
	};
	
	this.getSites = function(){
		
		_call_function(api.makeRequest,{action:"getservices"})!
		var resp = _result_function();
		
		_function_return(resp);
	};
	
	this.getCountries = function(){
		
		_call_function(api.makeRequest,{action:"countries"})!
		var resp = _result_function();
		
		_function_return(resp.map(function(el){
			el.id = el.code;
			delete el.code;
			return el;
		}));
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		_call_function(api.makeRequest,{action:"getnumber", options:{id:site, code:country}})!
		var resp = _result_function();
		
		_function_return({api:api, id:resp.id, number:api.removePlus(resp.number)});
	};
	
	this.getState = function(){
		var number = _function_argument("number");
		var taskId = _SMS.confirmData[number].id;
		
		_call_function(api.makeRequest,{action:"getstatus", options:{id:taskId}})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var status = _function_argument("status").toString();
		
		_if(status=="-1" || status=="8" || status=="3", function(){
			var taskId = _SMS.confirmData[number].id;
			var options = {id:taskId};
			if(status !== "3"){
				options.status = "1";
			};
			
			_call_function(api.makeRequest,{action:(status=="3" ? "play" : "setstatus"), options:options})!
		})!
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var code = null;
		
		_call_function(api.getState,{number:number})!
		var resp = _result_function();
		
		if(resp !== "null" && [resp.small,resp.text].filter(function(e){return !_is_nilb(e) && e !== '-'}).length > 0){
			code = (_is_nilb(resp.small) || resp.small=='-') ? resp.text : resp.small;
		};
			
		_function_return(code);
	};
	
	this.getError = function(error, data){
		var errors = {
			"101": {
				"ru": "Cервис не найден.",
				"en": "Service not found.",
				"action": "fail"
			},
			"102": {
				"ru": "Недостаточно денег на счету.",
				"en": "Not enough money in the account.",
				"action": "die",
				"instantly": false
			},
			"103": {
				"ru": "Нет доступных номеров.",
				"en": "No numbers available.",
				"action": "fail"
			},
			"201": {
				"ru": "API-ключ не указан.",
				"en": "API key not specified.",
				"action": "die",
				"instantly": true
			},
			"202": {
				"ru": "Неверный API-ключ.",
				"en": "Invalid API key.",
				"action": "die",
				"instantly": true
			},
			"203": {
				"ru": "Аккаунт заблокирован | " + data,
				"en": "Account blocked | " + data,
				"action": "fail"
			},
		};
		return errors[error];
	};
});