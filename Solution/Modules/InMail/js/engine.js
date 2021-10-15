_L["Proxy"] = {"ru":"Прокси"};
_L["Proxy type"] = {"ru":"Тип прокси"};
_L["Proxy login"] = {"ru":"Логин прокси"};
_L["Proxy password"] = {"ru":"Пароль прокси"};

_InMail = {
	api: null,
	proxy: null,
	debug: false,
	
	setDebug: function(enable){
		this.debug = [true, "true", 1].indexOf(enable) > -1;
	},
	
	log: function(enText, ruText){
		if(this.debug){
			ruText = _avoid_nilb(ruText, enText);
			
			_info('[InMail debug] ' + (_K==="en" ? enText : ruText));
		};
	},
	
	error: function(enText, ruText){
		ruText = _avoid_nilb(ruText, enText);
		
		fail('_InMail: ' + (_K==="en" ? enText : ruText));
	},
	
	paramClean: function(str){
		return _avoid_nil(str).toString().trim();
	},
	
	configure: function(protocol, autoConfig, host, port, encrypt, username, password, folder, timeout){
		protocol = this.paramClean(protocol).toLocaleLowerCase();
		if(["imap","pop3"].indexOf(protocol) < 0){
			this.error("Invalid protocol specified, mail module only supports imap and pop3 protocols", "Указан неверный протокол, почтовый модуль поддерживает только протоколы imap и pop3");
		};
		
		try{
			this.api = new _InMail[protocol](autoConfig, host, port, encrypt, username, password, folder);
		}catch(e){
			log(e);
			die('_InMail: ' + _K==="en" ? ('Class of protocol ' + protocol + ' is corrupted or missing') : ('Класс протокола ' + protocol + ' поврежден или отсутствует'), true);
		};
	},
	
	getApi: function(error){
		if(!_is_nilb(this.api) && typeof this.api==="object"){
			return this.api;
		}else{
			error = _avoid_nil(error, true);
			if(error){
				this.error("Mail module configuration failed or incorrect", "Настройка почтового модуля не выполнена или выполнена неправильно");
			}else{
				return false;
			};
		};
	},
	
	setProxy: function(proxyString, type, username, password){
		if(proxyString){
			var act = '_InMail.setProxy';
			_validate_argument_type(proxyString, 'string', 'Proxy', act);
			
			var proxyObj = proxy_parse(proxyString);
			
			if(!_is_nilb(type)){
				_validate_argument_type(type, 'string', 'Proxy type', act);
				
				type = this.paramClean(type);
				if(!_is_nilb(type) && type != "auto"){
					proxyObj["IsHttp"] = type == "http";
				};
			};
			
			if(!_is_nilb(username) && !_is_nilb(password)){
				_validate_argument_type(username, 'string', 'Proxy login', act);
				_validate_argument_type(password, 'string', 'Proxy password', act);
				
				proxyObj["name"] = username;
				proxyObj["password"] = password;
			};
			
			this.proxy = {
				host: proxyObj["server"],
				port: proxyObj["Port"],
				type: proxyObj["IsHttp"] ? "http" : "socks5",
				username: proxyObj["name"],
				password: proxyObj["password"]
			};
			
			var api = this.getApi(false);
			if(api){
				api.setProxy(this.proxy);
			};
		}else{
			this.clearProxy();
		};
	},
	
	clearProxy: function(){
		this.proxy = null;
		var api = this.getApi(false);
		if(api){
			api.clearProxy();
		};
	}
};