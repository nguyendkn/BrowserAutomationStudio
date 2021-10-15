_InMail.baseApi = function(isCurl, protocol, autoConfig, host, port, encrypt, username, password, folder){
	const api = this;
	this.protocol = protocol;
	
	if([true, "true", 1].indexOf(autoConfig) > -1){
		var split = username.split("@");
		var login = split[0];
		var domain = split[1];
		var configs = this.configs();
		var config = configs[domain];
		if(_is_nil(config)){
			_InMail.error('Failed to configure ' + protocol + ' for mail "' + domain + '", please use manual configuration', 'Не удалось настроить ' + protocol + ' для почты "' + domain + '", пожалуйста используйте ручную настройку');
		};
		if(!_is_nil(config.main)){
			config = configs[config.main];
		};
		this.host = config.host;
		this.port = config.port;
		this.encrypt = config.encrypt;
		this.username = config.username.replace("%email%", username).replace("%login%", login).replace("%domain%", domain);
	}else{
		this.host = _InMail.paramClean(host);
		port = _InMail.paramClean(port).toLocaleLowerCase();
		encrypt = _InMail.paramClean(encrypt).toLocaleLowerCase();
		if(["none","ssl","starttls"].indexOf(encrypt) < 0){
			_InMail.error("Invalid encryption type specified, mail module only supports ssl, starttls and none", "Указан неверный тип шифрования, почтовый модуль поддерживает только ssl, starttls и none");
		};
		if(port=="auto"){
			if(protocol=="imap"){
				this.port = encrypt=="ssl" ? "993" : "143";
			}else{
				this.port = encrypt=="ssl" ? "995" : "110";
			};
		}else{
			this.port = port;
		};
		this.encrypt = encrypt;
		this.username = username;
	};
	
	this.password = password;
	this.folder = folder;
	
	if(isCurl){
		this.options = {
			CURLOPT_URL: api.protocol + (api.encrypt=="ssl" ? 's' : '') + '://' + api.host,
			CURLOPT_PORT: api.port,
			CURLOPT_USERNAME: api.username,
			CURLOPT_PASSWORD: api.password,
			CURLOPT_USE_SSL: api.encrypt=="none" ? 0 : 3,
			CURLOPT_SSL_VERIFYPEER: false
		};
		
		this.setProxy = function(proxy){
			api.options["CURLOPT_PROXY"] = (proxy.type=="socks5" ? "socks5h" : proxy.type) + '://' + proxy.host + ':' + proxy.port;
			if(!_is_nilb(proxy.username) && !_is_nilb(proxy.password)){
				api.options["CURLOPT_PROXYUSERNAME"] = proxy.username;
				api.options["CURLOPT_PROXYPASSWORD"] = proxy.password;
			};
		};
		
		this.clearProxy = function(){
			delete api.options["CURLOPT_PROXY"];
			delete api.options["CURLOPT_PROXYUSERNAME"];
			delete api.options["CURLOPT_PROXYPASSWORD"];
		};
		
		this.wrapper = function(){
			var options = _function_argument("options");
			var trace = _function_argument("trace");
			
			native_async("curlwrapper","easyperform", JSON.stringify({
				write_to_string: true,
				options: options,
				trace: trace
			}))!
			
			_function_return(JSON.parse(_result()));
		};
		
		this.request = function(){
			var path = _function_argument("path");
			var query = _function_argument("query");
			
			var options = {};
			
			for(var key in api.options){
				if(!_is_nilb(api.options[key])){
					options[key] = api.options[key];
				};
			};
			
			if(!_is_nilb(path)){
				options["CURLOPT_URL"] += (path.slice(0, 1) != '/' ? '/' : '') + path;
			};
			
			if(!_is_nilb(query)){
				options["CURLOPT_CUSTOMREQUEST"] = query;
			};
			
			_call_function(api.wrapper, {options: options, trace: true})!
			var resp = _result_function();
			
			if(resp.code == "CURLE_OK"){
				_function_return(resp.result.trim());
			}else{
				if(!_is_nilb(query) && resp.error == "Quote command returned error"){
					var error = "";
					var trace = resp.trace.trim().split(/\r?\n/);
					for(var i = trace.length - 1; i > -1; i--){
						var ell = trace[i];
						ell = ell.slice(ell.indexOf(" ") + 1);
						if(ell==query){
							error = trace[i + 1];
							error = error.slice(error.indexOf(" ") + 1).trim();
							break;
						};
					};
					if(error){
						_InMail.error(resp.code + ' - ' + error);
					};
				};
				
				_InMail.error(resp.code + ' - ' + resp.error);
			};
		};
	};
	
	if(!_is_nilb(_InMail.proxy) && typeof _InMail.proxy==="object"){
		api.setProxy(_InMail.proxy);
	};
};
_InMail.assignApi = function(fn){
	fn.prototype = Object.create(this.baseApi.prototype);
	fn.prototype.constructor = fn;
	return fn;
};