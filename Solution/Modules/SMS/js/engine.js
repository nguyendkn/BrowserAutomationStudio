_BAS_SMSAPISDATA = {};
_BAS_SMSCONFIRMDATA = {};
_SMS_DEBUG = false;

_SMS = {
	init: function(service, apiKey, serverUrl){
		var data = {service:service, apiKey:apiKey};
		if(!_is_nilb(serverUrl)){
			data.serverUrl = serverUrl;
		};
		
		var id = md5(JSON.stringify(data));
		if(_is_nilb(_BAS_SMSAPISDATA)){
			_BAS_SMSAPISDATA = {};
		};
		
		if(_is_nilb(_BAS_SMSAPISDATA[id])){
			_BAS_SMSAPISDATA[id] = _SMS.getServiceApi(data);
		};
		
		return _BAS_SMSAPISDATA[id];
	},
	
	getBalance: function(){
		var service = _function_argument("service");
		var apiKey = _function_argument("apiKey");
		var serverUrl = _function_argument("serverUrl");
		
		api = _SMS.init(service, apiKey, serverUrl);
		
		_call_function(api.getBalance,{})!
		var balance = _result_function();
		
		_function_return(_is_nilb(balance) ? null : parseFloat(balance));
	},
	
	getNumbersCount: function(){
		var service = _function_argument("service");
		var apiKey = _function_argument("apiKey");
		var serverUrl = _function_argument("serverUrl");
		var site = _function_argument("site");
		var country = _function_argument("country");
		var customSite = _function_argument("customSite");
		var customCountry = _function_argument("customCountry");
		var operator = _function_argument("operator");
		
		api = _SMS.init(service, apiKey, serverUrl);
		
		site = _is_nilb(customSite) ? (site=="All" ? "All" : api.getRawSite(site)) : customSite;
		country = _is_nilb(customCountry) ? (country=="" ? "" : api.getRawCountry(country)) : customCountry;
		
		_call_function(api.getNumbersCount,{site:site, country:country, operator:operator})!
		var count = _result_function();
		
		_function_return(site=="All" ? (_is_nilb(count) ? {} : count) : (_is_nilb(count) ? 0 : parseInt(count)));
	},
	
	getNumber: function(){
		var service = _function_argument("service");
		var apiKey = _function_argument("apiKey");
		var serverUrl = _function_argument("serverUrl");
		var site = _function_argument("site");
		var country = _function_argument("country");
		var customSite = _function_argument("customSite");
		var customCountry = _function_argument("customCountry");
		var operator = _function_argument("operator");
		var phoneException = _function_argument("phoneException");
		
		if(_is_nilb(_BAS_SMSCONFIRMDATA)){
			_BAS_SMSCONFIRMDATA = {};
		};
		
		api = _SMS.init(service, apiKey, serverUrl);
		
		site = _is_nilb(customSite) ? api.getRawSite(site) : customSite;
		country = _is_nilb(customCountry) ? api.getRawCountry(country) : customCountry;
		
		_call_function(api.getNumber,{site:site, country:country, operator:operator, phoneException:phoneException})!
		var confirmData = _result_function();
		var number = confirmData.number;
		
		_BAS_SMSCONFIRMDATA[number] = confirmData;
		
		_function_return(number);
	},
	
	waitCode: function(){
		var number = _function_argument("number");
		var maxTime = Date.now() + 60000 * _function_argument("timeout");
		var delay = 1000 * _function_argument("delay");
		
		if(_is_nilb(_BAS_SMSCONFIRMDATA) || _is_nilb(_BAS_SMSCONFIRMDATA[number])){
			fail((_K=="ru" ? 'Нет информации об номере' : 'No information about the number') + ' "' + number + '"');
		};
		
		var confirmData = _BAS_SMSCONFIRMDATA[number];
		var api = confirmData.api;
		var code = null;
		
		_if(!api.ready, function(){
			_call_function(api.setReady,{confirmData:confirmData})!
			api.ready = true;
		})!
		
		_do(function(){
			if(Date.now() > maxTime){
				api.errorHandler("ACTION_TIMEOUT", _K=="ru" ? "Получить код активации" : "Get activation code");
			};
			
			_call_function(api.getCode,{confirmData:confirmData})!
			code = _result_function();
			
			if(!_is_nilb(code)){
				_break();
			};
			
			sleep(delay)!
		})!
		
		_function_return(code);
	},
	
	debug: function(enable){
		_SMS_DEBUG = (enable==true || enable=="true" || enable==1);
	}
};