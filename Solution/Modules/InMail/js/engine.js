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
	
	configure: function(protocol, autoConfig, host, port, encrypt, username, password, box, timeout){
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
			config.port = port=="auto" ? (protocol=="imap" ? (encrypt=="ssl" ? 993 : 143) : encrypt=="ssl" ? 995 : 110) : Number(port);
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
		
		this.api.box = _InMail.paramClean(box);
		this.api.timeout = (parseInt(_InMail.paramClean(timeout)) || 5 * 60) * 1000;
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
					proxyObj["IsHttp"] = _starts_with(type, "http");
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
		var maxResults = parseInt(_InMail.paramClean(_function_argument("maxResults")));
		var offset = parseInt(_InMail.paramClean(_function_argument("offset")));
		var box = _InMail.prepareBox(_function_argument("box"));
		var errorNotFound = _avoid_nilb(_function_argument("errorNotFound"), true);
		
		var api = _InMail.getApi();
		
		_if_else(sorts, function(){
			_call_function(api.sort, {sorts: sorts, criteria: criteria, box: box})!
		}, function(){
			_call_function(api.search, {criteria: criteria, box: box})!
		})!
		
		var res = _result_function();
		
		if(res.length){
			if(maxResults){
				res = res.slice(0, maxResults);
			};
			
			if(offset){
				res = res.map(function(uid){return uid + offset});
			};
			
			_function_return(res);
		}else{
			if(errorNotFound){
				_InMail.error('Could not find any messages matching the specified criteria in the specified mailbox folder', 'Не удалось найти ни одного письма, соответствующего указанным критериям, в указанной папке почтового ящика', 'search');
			}else{
				_function_return([]);
			};
		};
	},
	
	wait: function(){
		var criteria = _function_argument("criteria");
		var sorts = _function_argument("sorts");
		var minResults = parseInt(_InMail.paramClean(_function_argument("minResults"))) || 1;
		var interval = 1000 * (parseInt(_InMail.paramClean(_function_argument("interval"))) || 5);
		var timeout = 1000 * (parseInt(_InMail.paramClean(_function_argument("timeout"))) || 300);
		var maxTime = _avoid_nilb(_function_argument("maxTime"), Date.now() + timeout);
		var maxResults = parseInt(_InMail.paramClean(_function_argument("maxResults")));
		var offset = parseInt(_InMail.paramClean(_function_argument("offset")));
		var box = _function_argument("box");
		var res = [];
		
		_do(function(){
			if(Date.now() > maxTime){
				_InMail.error('Failed to wait for the required number of messages matching the specified criteria in the specified mailbox folder', 'Не удалось дождаться нужного количества писем, соответствующих указанным критериям, в указанной папке почтового ящика', 'wait');
			};
			
			_call_function(_InMail.search, {criteria:criteria, sorts:sorts, box:box, errorNotFound: false})!
			res = _result_function();
			
			if(res.length >= minResults){
				_break();
			};
			
			sleep(interval)!
		})!
		
		if(maxResults){
			res = res.slice(0, maxResults);
		};
		
		if(offset){
			res = res.map(function(uid){return uid + offset});
		};
		
		_function_return(res);
	},
	
	searchLast: function(){
		var box = _InMail.prepareBox(_function_argument("box"));
		var errorNotFound = _avoid_nilb(_function_argument("errorNotFound"), true);
		
		var api = _InMail.getApi();
		
		_call_function(api.searchLast, {box: box})!
		var last = _result_function();
		
		if(last){
			_function_return(last);
		}else{
			if(errorNotFound){
				_InMail.error('Could not find the last message in the specified mailbox folder', 'Не удалось найти последнее письмо в указанной папке почтового ящика', 'searchLast');
			}else{
				_function_return(0);
			};
		};
	},
	
	searchOne: function(){
		var args = _function_arguments();
		
		_call_function(_InMail.search, args)!
		var res = _result_function();
		
		if(res.length){
			_function_return(res[0]);
		}else{
			_function_return(0);
		};
	},
	
	waitOne: function(){
		var args = _function_arguments();
		
		_call_function(_InMail.wait, args)!
		var res = _result_function();
		
		_function_return(res[0]);
	},
	
	count: function(){
		var criteria = _InMail.prepareCriteria(_function_argument("criteria"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.count, {criteria: criteria, box: box})!
		var count = _result_function();
		
		_function_return(count);
	},
	
	getFlags: function(){
		var uid = _InMail.uidsToOne(_function_argument("uid"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.getFlags, {uid: uid, box: box})!
		var flags = _result_function();
		
		_function_return(flags);
	},
	
	addFlags: function(){
		var uids = _function_argument("uids");
		var flags = _to_arr(_function_argument("flags"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.addFlags, {uids: uids, flags: flags, box: box})!
	},
	
	delFlags: function(){
		var uids = _function_argument("uids");
		var flags = _to_arr(_function_argument("flags"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.delFlags, {uids: uids, flags: flags, box: box})!
	},
	
	setFlags: function(){
		var uids = _function_argument("uids");
		var flags = _to_arr(_function_argument("flags"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.setFlags, {uids: uids, flags: flags, box: box})!
	},
	
	expunge: function(){
		var uids = _function_argument("uids");
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.expunge, {uids: uids, box: box})!
	},
	
	delMessages: function(){
		var uids = _function_argument("uids");
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.delMessages, {uids: uids, box: box})!
	},
	
	copyMessages: function(){
		var uids = _function_argument("uids");
		var toBox = _InMail.paramClean(_function_argument("toBox"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.copyMessages, {uids: uids, toBox: toBox, box: box})!
	},
	
	moveMessages: function(){
		var uids = _function_argument("uids");
		var toBox = _InMail.paramClean(_function_argument("toBox"));
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.moveMessages, {uids: uids, toBox: toBox, box: box})!
	},
	
	getMessages: function(){
		var uids = _function_argument("uids");
		var body = _avoid_nilb(_function_argument("body"), true);
		var headers = _avoid_nilb(_function_argument("headers"), false);
		var size = _avoid_nilb(_function_argument("size"), false);
		var flags = _avoid_nilb(_function_argument("flags"), false);
		var date = _avoid_nilb(_function_argument("date"), false);
		var attachnames = _avoid_nilb(_function_argument("attachnames"), false);
		var attachments = _avoid_nilb(_function_argument("attachments"), false);
		var markSeen = _avoid_nilb(_function_argument("markSeen"), false);
		var box = _InMail.prepareBox(_function_argument("box"));
		
		var api = _InMail.getApi();
		
		_call_function(api.getMessages, {uids: uids, body: body, headers: headers, size: size, flags: flags, date: date, attachnames: attachnames, attachments: attachments, markSeen: markSeen, box: box})!
		var messages = _result_function();
		
		_function_return(messages);
	},
	
	getMessage: function(){
		var args = _function_arguments();
		args.uids = _InMail.uidsToOne(args.uid);
		delete args.uid;
		
		_call_function(_InMail.getMessages, args)!
		var messages = _result_function();
		
		if(!messages.length){
			_InMail.error('Could not find a message matching the specified id in the specified mailbox folder', 'Не удалось найти письмо, соответствующее указанному идентификатору, в указанной папке почтового ящика', 'getMessages');
		};
		
		_function_return(messages[0]);
	},
	
	getLastMessage: function(){
		var args = _function_arguments();
		
		_call_function(_InMail.searchLast, {box: args.box})!
		var uid = _result_function();
		
		args.uid = uid;
		
		_call_function(_InMail.getMessage, args)!
		var message = _result_function();
		
		_function_return(message);
	},
	
	findMessage: function(){
		var args = _function_arguments();
		
		_call_function(_InMail.searchOne, args)!
		var uid = _result_function();
		
		args.uid = uid;
		
		_call_function(_InMail.getMessage, args)!
		var message = _result_function();
		
		_function_return(message);
	},
	
	waitMessage: function(){
		var args = _function_arguments();
		
		_call_function(_InMail.waitOne, args)!
		var uid = _result_function();
		
		args.uid = uid;
		
		_call_function(_InMail.getMessage, args)!
		var message = _result_function();
		
		_function_return(message);
	},
	
	uidsToOne: function(uids){
		if(typeof uids == "string" && uids.indexOf(',') > 0){
			uids.split(',');
		};
		
		if(Array.isArray(uids)){
			uids = uids[0];
		};
		return uids;
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
	
	prepareBox: function(box){
		return box ? this.paramClean(box) : box;
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
								var flags = _to_arr(value).map(function(flag){return flag.slice(0, 1) == '\\' ? flag.slice(1) : flag});
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