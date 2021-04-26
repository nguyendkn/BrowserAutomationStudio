_SMS.VakSmsApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'vak-sms');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/api/' + action + '/';
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
		
		_function_return({api:api, id:resp.idNum, origId:resp.idNum, number:api.removePlus(resp.tel)});
	};
});