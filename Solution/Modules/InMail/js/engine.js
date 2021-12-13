_L["Proxy"] = {"ru":"Прокси"};
_L["Config"] = {"ru":"Конфиг"};
_L["Proxy type"] = {"ru":"Тип прокси"};
_L["Folder name"] = {"ru":"Имя папки"};
_L["Proxy login"] = {"ru":"Логин прокси"};
_L["Proxy password"] = {"ru":"Пароль прокси"};
_L["New folder name"] = {"ru":"Новое имя папки"};
_L["Search criteria"] = {"ru":"Критерии поиска"};
_L["Old folder name"] = {"ru":"Старое имя папки"};
_L["Sorting criteria"] = {"ru":"Критерии сортировки"};

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
	
	error: function(enText, ruText, act){
		ruText = _avoid_nilb(ruText, enText);
		
		fail('_InMail' + (_is_nilb(act) ? '' : '.' + act) + ': ' + (_K==="en" ? enText : ruText));
	},
	
	paramClean: function(str){
		return _avoid_nil(str).toString().trim();
	},
	
	configure: function(protocol, autoConfig, host, port, encrypt, username, password, folder, timeout){
		protocol = this.paramClean(protocol).toLocaleLowerCase();
		if(["imap","pop3"].indexOf(protocol) < 0){
			this.error("Invalid protocol specified, mail module only supports imap and pop3 protocols", "Указан неверный протокол, почтовый модуль поддерживает только протоколы imap и pop3");
		};
		
		var config = {};
		
		if([true, "true", 1].indexOf(autoConfig) > -1){
			var split = username.split("@");
			var login = split[0];
			var domain = split[1];
			
			config = this.findConfig(domain, protocol);
			
			if(!config){
				this.error('Failed to configure ' + protocol + ' for mail "' + domain + '", please use manual configuration', 'Не удалось настроить ' + protocol + ' для почты "' + domain + '", пожалуйста используйте ручную настройку');
			};
			
			config.username = config.username.replace("%email%", username).replace("%login%", login).replace("%domain%", domain);
		}else{
			encrypt = this.paramClean(encrypt).toLocaleLowerCase();
			if(["none","ssl","starttls"].indexOf(encrypt) < 0){
				this.error("Invalid encryption type specified, mail module only supports ssl, starttls and none", "Указан неверный тип шифрования, почтовый модуль поддерживает только ssl, starttls и none");
			};
			config.host = this.paramClean(host);
			port = this.paramClean(port).toLocaleLowerCase();
			config.port = port=="auto" ? (protocol=="imap" ? (encrypt=="ssl" ? "993" : "143") : encrypt=="ssl" ? "995" : "110") : port;
			config.encrypt = encrypt;
			config.username = username;
		};

		config.password = password;
		
		var api = this.getApi(true);
		if(!api || protocol != api.protocol || JSON.stringify(config) != JSON.stringify(api.config)){
			try{
				this.api = new _InMail[protocol](config);
			}catch(e){
				die('_InMail: ' + _K==="en" ? ('Class of protocol ' + protocol + ' is corrupted or missing') : ('Класс протокола ' + protocol + ' поврежден или отсутствует'), true);
			};
		};
		
		this.api.folder = _InMail.paramClean(folder);
		this.api.timeout = timeout*1000;
	},
	
	getApi: function(noError){
		if(!_is_nilb(this.api) && typeof this.api==="object"){
			return this.api;
		}else{
			noError = _avoid_nil(noError, false);
			if(noError){
				return false;
			}else{
				this.error("Mail module configuration failed or incorrect", "Настройка почтового модуля не выполнена или выполнена неправильно");
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
			
			var api = this.getApi(true);
			if(api){
				api.setProxy(this.proxy);
			};
		}else{
			this.clearProxy();
		};
	},
	
	clearProxy: function(){
		this.proxy = null;
		var api = this.getApi(true);
		if(api){
			api.clearProxy();
		};
	},
	
	status: function(){
		var name = _function_argument("name");
		_validate_argument_type(name, 'string', 'Folder name', '_InMail.status');
		
		var api = _InMail.getApi();
		
		_call_function(api.status, {name: name})!
		var info = _result_function();
		
		_function_return(info);
	},
	
	getBoxes: function(){
		var format = _InMail.paramClean(_function_argument("format")).toLocaleLowerCase();
		
		var api = _InMail.getApi();
		
		_call_function(api.getBoxes, {})!
		var boxes = _result_function();
		
		if(format != 'object'){
			boxes = _InMail.boxesToList(boxes);
			if(_starts_with(format, 'csv')){
				boxes = boxes.map(function(box){return csv_generate([box.name, csv_generate(box.attribs, ','), box.delimiter], ':')});
				if(format == 'csv string'){
					boxes = boxes.join('\n');
				};
			};
		};
		
		_function_return(boxes);
	},
	
	addBox: function(){
		var name = _function_argument("name");
		_validate_argument_type(name, 'string', 'Folder name', '_InMail.addBox');
		
		var api = _InMail.getApi();
		
		_call_function(api.addBox, {name: name})!
	},
	
	delBox: function(){
		var name = _function_argument("name");
		_validate_argument_type(name, 'string', 'Folder name', '_InMail.delBox');
		
		var api = _InMail.getApi();
		
		_call_function(api.delBox, {name: name})!
	},
	
	renameBox: function(){
		var act = '_InMail.renameBox';
		var oldName = _function_argument("oldName");
		_validate_argument_type(oldName, 'string', 'Old folder name', act);
		var newName = _function_argument("newName");
		_validate_argument_type(newName, 'string', 'New folder name', act);
		
		var api = _InMail.getApi();
		
		_call_function(api.renameBox, {oldName: oldName, newName: newName})!
	},
	
	search: function(){
		var criteria = _InMail.prepareCriteria(_function_argument("criteria"));
		var sorts = _InMail.prepareSorts(_function_argument("sorts"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		var errorNotFound = _avoid_nilb(_function_argument("errorNotFound"), true);
		
		var api = _InMail.getApi();
		
		_if_else(sorts, function(){
			_call_function(api.sort, {sorts: sorts, criteria: criteria, folder: folder})!
		}, function(){
			_call_function(api.search, {criteria: criteria, folder: folder})!
		})!
		
		var res = _result_function();
		
		if(res.length){
			_function_return(res);
		}else{
			if(errorNotFound){
				_InMail.error('Could not find any letters matching the specified criteria in the specified mailbox folder', 'Не удалось найти ни одного письма, соответствующего указанным критериям, в указанной папке почтового ящика', 'search');
			}else{
				_function_return([]);
			};
		};
	},
	
	searchLast: function(){
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		var errorNotFound = _avoid_nilb(_function_argument("errorNotFound"), true);
		
		var api = _InMail.getApi();
		
		_call_function(api.searchLast, {folder: folder})!
		var last = _result_function();
		
		if(last){
			_function_return(last);
		}else{
			if(errorNotFound){
				_InMail.error('Could not find the last letter in the specified mailbox folder', 'Не удалось найти последнее письмо в указанной папке почтового ящика', 'searchLast');
			}else{
				_function_return(0);
			};
		};
	},
	
	searchOne: function(){
		var criteria = _InMail.prepareCriteria(_function_argument("criteria"));
		var sorts = _InMail.prepareSorts(_function_argument("sorts"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		var errorNotFound = _avoid_nilb(_function_argument("errorNotFound"), true);
		
		var api = _InMail.getApi();
		
		_if_else(sorts, function(){
			_call_function(api.sort, {sorts: sorts, criteria: criteria, folder: folder})!
		}, function(){
			_call_function(api.search, {criteria: criteria, folder: folder})!
		})!
		
		var res = _result_function();
		
		if(res.length){
			_function_return(res.shift());
		}else{
			if(errorNotFound){
				_InMail.error('Could not find a letter that matches the specified criteria in the specified mailbox folder', 'Не удалось найти письмо, соответствующее указанным критериям, в указанной папке почтового ящика', 'searchOne');
			}else{
				_function_return(0);
			};
		};
	},
	
	count: function(){
		var criteria = _InMail.prepareCriteria(_function_argument("criteria"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.count, {criteria: criteria, folder: folder})!
		var count = _result_function();
		
		_function_return(count);
	},
	
	addFlags: function(){
		var uids = _function_argument("uids");
		var flags = _to_arr(_function_argument("flags"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.addFlags, {uids: uids, flags: flags, folder: folder})!
	},
	
	delFlags: function(){
		var uids = _function_argument("uids");
		var flags = _to_arr(_function_argument("flags"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.delFlags, {uids: uids, flags: flags, folder: folder})!
	},
	
	setFlags: function(){
		var uids = _function_argument("uids");
		var flags = _to_arr(_function_argument("flags"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.setFlags, {uids: uids, flags: flags, folder: folder})!
	},
	
	delMsgs: function(){
		var uids = _function_argument("uids");
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.delMsgs, {uids: uids, folder: folder})!
	},
	
	copyMsgs: function(){
		var uids = _function_argument("uids");
		var toFolder = _InMail.paramClean(_function_argument("toFolder"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.copyMsgs, {uids: uids, toFolder: toFolder, folder: folder})!
	},
	
	moveMsgs: function(){
		var uids = _function_argument("uids");
		var toFolder = _InMail.paramClean(_function_argument("toFolder"));
		var folder = _InMail.prepareFolder(_function_argument("folder"));
		
		var api = _InMail.getApi();
		
		_call_function(api.moveMsgs, {uids: uids, toFolder: toFolder, folder: folder})!
	},
	
	boxesToList: function(boxes, parent){
		var api = this.getApi();
		var list = [];
		
		for(var name in boxes){
			var box = boxes[name];
			
			if(box.isChildren = !!parent){
				name = (parent.name + parent.delimiter) + name;
				parent.children.push(name);
				box.parent = parent.name;
			}else{
				box.parent = null;
			};
			
			box.name = name;
			
			list.push(box);
			
			if(box.children){
				var children = box.children;
				box.children = [];
				children = this.boxesToList(children, box);
				list = list.concat(children);
			};
		};
		
		return list;
	},
	
	prepareFolder: function(folder){
		return folder ? this.paramClean(folder) : folder;
	},
	
	prepareCriteria: function(criteria){
		if(!_is_nilb(criteria)){
			_validate_argument_type(criteria, ['array','string','object'], 'Search criteria', '_InMail.prepareCriteria');
			
			if(Array.isArray(criteria)){
				return criteria;
			}else{
				if(typeof criteria == 'string'){
					if(criteria.trim().length){
						return [criteria];
					};
				}else{
					var keys = Object.keys(criteria).filter(function(key){
						if(!_is_nilb(key)){
							var value = criteria[key];
							if(!_is_nilb(value)){
								return (typeof value != "string" || !!value.trim().length);
							};
						};
						return false;
					});
					
					if(keys.length){
						var arr = [];
						for(var i = 0; i < keys.length; i++){
							var key = keys[i];
							var keyLow = key.toLocaleLowerCase();
							var value = criteria[key];
							if(['flags', '!flags'].indexOf(keyLow) > -1){
								var flags = _to_arr(value);
								if(keyLow=='!flags'){
									flags = flags.map(function(flag){return flag.slice(0, 1) != '!' ? '!' + flag : flag});
								};
								arr = arr.concat(flags);
							}else{
								arr.push([key, value]);
							};
						};
						return arr;
					};
				};
			};
		};
		
		return ['ALL'];
	},
	
	prepareSorts: function(sorts){
		if(!_is_nilb(sorts)){
			_validate_argument_type(sorts, ['array','string','object'], 'Sorting criteria', '_InMail.prepareSorts');
			
			if(Array.isArray(sorts)){
				return sorts;
			}else{
				if(typeof sorts == 'string'){
					sorts = sorts.trim();
					if(sorts.length){
						return [sorts];
					};
				}else{
					var type = sorts.type.trim();
					var field = sorts.field.trim();
					if(!_is_nilb(type) && type != 'no sorting' && !_is_nilb(field)){
						return [(type=='descending' ? '-' : '') + field];
					};
				};
			};
		};
		
		return false;
	}
};