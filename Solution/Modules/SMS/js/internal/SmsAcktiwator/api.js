_SMS.SmsAcktiwatorApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'sms-acktiwator');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var checkErrors = _avoid_nilb(_function_argument("checkErrors"), true);
		
		var url = api.url + '/api/' + action + '/' + api.key;
		var params = api.combineParams({}, options);
		
		_call_function(api.request,{url:url, method:"GET", params:params})!
		var content = _result_function();
		
		if(_is_json_string(content)){
			var resp = api.parseJSON(content);
			
			if(checkErrors && (resp.name=="error" || resp.error)){
				api.errorHandler(resp.name=="error" ? resp.code : resp.error, resp.message);
			};	
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.apiRequest,{action:"getbalance"})!
		var resp = _result_function();
		
		_function_return(resp);
	};
	
	this.getNumbersCount = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		_call_function(api.apiRequest,{action:"numbersstatus", options:{code:country}})!
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
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		
		_call_function(api.apiRequest,{action:"getnumber", options:{service:site, code:country}})!
		var resp = _result_function();
		
		_function_return({api:api, id:resp.id, origId:resp.id, number:api.removePlus(resp.number)});
	};
	
	this.getStatus = function(){
		var confirmData = _function_argument("confirmData");
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getstatus", options:{id:taskId}})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var confirmData = _function_argument("confirmData");
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		if(["1","6"].indexOf(status) > -1){
			_function_return();
		};
		
		if(["-1","3","8"].indexOf(status) < 0){
			api.errorHandler('UNSUPPORTED_STATUS', status);
		};
		
		_if(status=="-1" || status=="8", function(){
			_call_function(api.apiRequest,{action:"setstatus", options:{id:taskId, status:"1"}})!
		})!
		
		_if(status=="3", function(){
			_call_function(api.apiRequest,{action:"play", options:{id:taskId}})!
		})!
	};
	
	this.getCode = function(){
		var confirmData = _function_argument("confirmData");
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getlatestcode", options:{id:taskId}})!
			
		_function_return(_result_function());
	};
});