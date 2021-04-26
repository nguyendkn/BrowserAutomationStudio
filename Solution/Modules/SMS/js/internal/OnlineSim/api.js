_SMS.OnlineSimApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'onlinesim');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var method = _avoid_nilb(_function_argument("method"), "GET");
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/api/' + action + '.php';
		var params = api.combineParams({apikey:api.key}, options);
		
		_call_function(api.request,{url:url, method:method, params:params})!
		var content = _result_function();
		
		var resp = api.parseJSON(content);
		
		if(checkErrors && resp.response!=1){
			api.errorHandler(resp.response);
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
		
		_call_function(api.apiRequest,{action:"getNumbersStats", options:{country:country}, checkErrors:false})!
		var resp = _result_function();
		
		var sites = {};
		var count = null;
		(country=="all" && _is_nilb(resp.name) ? Object.keys(resp) : [0]).forEach(function(key){
			var services = country=="all" ? resp[key].services : resp.services;
			var keys = Object.keys(services);
			if(site=="All"){
				keys.forEach(function(key){
					var data = services[key];
					if(_is_nilb(sites[data.slug])){
						sites[data.slug] = parseInt(data.count);
					}else{
						sites[data.slug] += parseInt(data.count);
					};
				});
				_function_return(sites);
			}else{
				var name = keys.filter(function(key){
					var service = services[key];
					return service.slug==site || service.service==site;
				})[0];
				if(!_is_nilb(name)){
					if(_is_nilb(count)){
						count = parseInt(services[name].count);
					}else{
						count += parseInt(services[name].count);
					};
				};
			};
		});
		_function_return(site=="All" ? sites : count);
	};
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		var phoneException = _function_argument("phoneException");
		
		_call_function(api.apiRequest,{action:"getNum", options:{service:site, country:country, number:true, simoperator:operator, reject:phoneException}})!
		var resp = _result_function();
		
		_function_return({api:api, id:resp.tzid, origId:resp.tzid, number:(resp.number.slice(0,1)=='+' ? resp.number.slice(1) : resp.number)});
	};
	
	this.getStatus = function(){
		var confirmData = _function_argument("confirmData");
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getState", options:{tzid:taskId, msg_list:0, clean:1}, checkErrors:false})!
		var resp = _result_function();
		if(Array.isArray(resp)){
			resp = resp[0];
		};
		
		_function_return(resp);
	};
	
	this.setStatus = function(){
		fail(api.name + ': ' + (_K=="ru" ? 'Данный сервис не поддерживает установку статуса.' : 'This service does not support setting the status.'));
	};
	
	this.setReady = function(){
		
	};
	
	this.getCode = function(){
		var confirmData = _function_argument("confirmData");
		var code = null;
		
		_call_function(api.getStatus,{confirmData:confirmData})!
		var resp = _result_function();
		
		if(resp.response=='TZ_NUM_ANSWER'){
			code = resp.msg;
		}else{
			if(resp.response != 'TZ_NUM_WAIT'){
				api.errorHandler(resp.response);
			};
		};
			
		_function_return(code);
	};
});