_SMS.GiveSmsApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'give-sms');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/api/v1/';
		var params = api.combineParams({method:action, userkey:api.key}, options);
		
		_call_function(api.request,{url:url, method:"GET", params:params})!
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
		
		_function_return({api:api, id:resp.order_id, origId:resp.order_id, number:('7' + resp.phone)});
	};
});