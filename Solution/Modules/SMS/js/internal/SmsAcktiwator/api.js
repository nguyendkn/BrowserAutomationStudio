_SMS.SmsAcktiwatorApi = function(config){
	_SMS.base.call(this, config);
	this.type = 'sms-acktiwator';
};
_SMS.SmsAcktiwatorApi.prototype = Object.create(_SMS.base.prototype);
_SMS.SmsAcktiwatorApi.prototype.constructor = _SMS.SmsAcktiwatorApi;

_SMS.SmsAcktiwatorApi.prototype.apiRequest = function(){
	var api = _function_argument("api");
	var action = _function_argument("action");
	var options = _avoid_nilb(_function_argument("options"), {});
	var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
	
	var url = api.url + '/api/' + action + '/' + api.key;
	var params = api.combineParams({}, options);
	
	_call_function(api.request,{api:api,url:url,method:"GET",params:params})!
	var content = _result_function();
	
	var resp = api.parseJSON(content);
	
	if(checkErrors && (resp.name=="error" || resp.error)){
		api.errorHandler(resp.name=="error" ? resp.code : resp.error, resp.message);
	};

	_function_return(resp);
};
_SMS.SmsAcktiwatorApi.prototype.getBalance = function(){
	var api = _function_argument("api");
	
	_call_function(api.apiRequest,{api:api,action:"getbalance"})!
	var resp = _result_function();
	
	_function_return(resp);
};
_SMS.SmsAcktiwatorApi.prototype.getNumbersCount = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	
	_call_function(api.apiRequest,{api:api,action:"numbersstatus",options:{code:country}})!
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
_SMS.SmsAcktiwatorApi.prototype.getNumber = function(){
	var api = _function_argument("api");
	var site = _function_argument("site");
	var country = _function_argument("country");
	
	_call_function(api.apiRequest,{api:api,action:"getnumber",options:{service:site,code:country}})!
	var resp = _result_function();
	
	_function_return({api: api, id: resp.id, origId: resp.id, number: resp.number});
};