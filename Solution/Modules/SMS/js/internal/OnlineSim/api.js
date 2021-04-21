_SMS.OnlineSimApi = function(config){
	_SMS.BaseApi.call(this, config);
	this.type = 'onlinesim';
};
_SMS.OnlineSimApi.prototype = Object.create(_SMS.BaseApi.prototype);
_SMS.OnlineSimApi.prototype.constructor = _SMS.OnlineSimApi;

_SMS.OnlineSimApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var method = _avoid_nilb(_function_argument("method"), "GET");
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.url + '/api/' + action + '.php';
	var params = api.combineParams({apikey:api.key}, options);
	
	_call_function(api.request,{api:api,url:url,method:method,params:params})!
	var content = _result_function();
	
	var resp = api.parseJSON(content);
	
	if(checkErrors && resp.response!=1){
		api.errorHandler(resp.response);
	};

	_function_return(resp);
};
_SMS.OnlineSimApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"getBalance"})!
	var resp = _result_function();
	
	_function_return(resp.balance);
};
_SMS.OnlineSimApi.prototype.getNumbersCount = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	
	_call_function(api.apiRequest,{api:api,action:"getNumbersStats",options:{country:country},checkErrors:false})!
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
_SMS.OnlineSimApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	var operator = _function_argument("operator");
	var phoneException = _function_argument("phoneException");
	
	var options = {service:site,country:country};
	
	if(!_is_nilb(operator)){
		options.simoperator = operator;
	};
	if(!_is_nilb(phoneException)){
		options.reject = phoneException;
	};
	
	_call_function(api.apiRequest,{api:api,action:"getNum",options:options})!
	var resp = _result_function();
	
	var confirmData = {api: api, id: resp.tzid, origId: resp.tzid, number: null};
	
	var maxNumberWait = Date.now() + 600000;
	_do(function(){
		if(Date.now() > maxNumberWait){
			api.errorHandler("TIMEOUT_GET_STATE");
		};
		
		_call_function(api.apiRequest,{api:api,action:"getState",options:{tzid:confirmData.id},checkErrors:false})!
		var resp = _result_function();
		if(Array.isArray(resp)){
			resp = resp[0];
		};

		if(["TZ_NUM_PREPARE","TZ_NUM_WAIT","TZ_NUM_ANSWER"].indexOf(resp.response) > -1){
			confirmData.number = resp.number;
			_function_return(confirmData);
		};

		if(resp.response!="TZ_INPOOL"){
			api.errorHandler(resp.response);
		};
		
		sleep(1000)!
	})!
};