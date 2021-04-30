_SMS.SmsActivateApi = _SMS.assignApi(function(config){
    const api = this;
	_SMS.BaseApi.call(this, config, 'sms-activate');
	
	this.apiRequest = function(){
		var action = _function_argument("action");
		var options = _avoid_nilb(_function_argument("options"), {});
		var method = _avoid_nilb(_function_argument("method"), "GET");
		var isJSON = _function_argument("isJSON");
		
		var url = api.url + '/stubs/handler_api.php';
		var params = api.combineParams({api_key:api.key, action:action}, options);
		
		_call_function(api.request,{url:url, method:method, params:params})!
		var content = _result_function();
		
		if(isJSON || (_is_nilb(isJSON) && _is_json_string(content))){
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
		};

		_function_return(resp);
	};
	
	this.getBalance = function(){
		_call_function(api.apiRequest,{action:"getBalance", isJSON:false})!
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
	
	this.getNumber = function(){
		var site = _function_argument("site");
		var country = _function_argument("country");
		var operator = _function_argument("operator");
		var phoneException = _function_argument("phoneException");
		
		_call_function(api.apiRequest,{action:"getNumber", options:{service:site, country:country, operator:operator, phoneException:phoneException}, isJSON:false})!
		var resp = _result_function();
		
		if(resp.status=="ACCESS_NUMBER"){
			_function_return({api:api, id:resp.id, lastId:resp.id, number:api.removePlus(resp.number)});
		}else{
			api.errorHandler(resp.status, resp.data);
		};
	};
	
	this.getStatus = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var taskId = confirmData.id;
		
		_call_function(api.apiRequest,{action:"getStatus", options:{id:taskId}, isJSON:false})!
		
		_function_return(_result_function());
	};
	
	this.setStatus = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var status = _function_argument("status").toString();
		var taskId = confirmData.id;
		
		if(status=="8" && api.service=="getsms.online"){
			status = "10";
		};
		
		_call_function(api.apiRequest,{action:"setStatus", options:{id:taskId, status:status}, isJSON:false})!
		var resp = _result_function();
		
		if(resp.status.indexOf('ACCESS_') != 0){
			api.errorHandler(resp.status, resp.data);
		};
	};
	
	this.getCode = function(){
		var number = _function_argument("number");
		var confirmData = _BAS_SMSCONFIRMDATA[number];
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
});