_InMail.baseApi = function(isCurl, protocol, autoConfig, host, port, encrypt, username, password, folder, timeout){
	const api = this;
	this.protocol = protocol;
	
	if([true, "true", 1].indexOf(autoConfig) > -1){
		var split = username.split("@");
		var login = split[0];
		var domain = split[1];
		
		var configs = _InMail.configs();
		var domainObj = configs[domain];
		if(_is_nil(domainObj)){
			for(var key in configs){
				var obj = configs[key];
				if(obj.domains && obj.domains.indexOf(domain) > -1){
					domainObj = obj;
					break;
				};
			};
		};
		
		if(_is_nil(domainObj) || _is_nil(domainObj[protocol])){
			_InMail.error('Failed to configure ' + protocol + ' for mail "' + domain + '", please use manual configuration', 'Не удалось настроить ' + protocol + ' для почты "' + domain + '", пожалуйста используйте ручную настройку');
		};
		
		var config = domainObj[protocol];
		
		this.config = config;
		
		this.config.username = config.username.replace("%email%", username).replace("%login%", login).replace("%domain%", domain);
	}else{
		encrypt = _InMail.paramClean(encrypt).toLocaleLowerCase();
		if(["none","ssl","starttls"].indexOf(encrypt) < 0){
			_InMail.error("Invalid encryption type specified, mail module only supports ssl, starttls and none", "Указан неверный тип шифрования, почтовый модуль поддерживает только ssl, starttls и none");
		};
		this.config = {};
		this.config.host = _InMail.paramClean(host);
		port = _InMail.paramClean(port).toLocaleLowerCase();
		this.config.port = port=="auto" ? (protocol=="imap" ? (encrypt=="ssl" ? "993" : "143") : encrypt=="ssl" ? "995" : "110") : port;
		this.config.encrypt = encrypt;
		this.config.username = username;
	};
	
	this.config.password = password;
	this.folder = _InMail.paramClean(folder);
	this.timeout = timeout;
	
	this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	if(isCurl){
		this.options = {
			CURLOPT_URL: api.protocol + (api.config.encrypt=="ssl" ? 's' : '') + '://' + api.config.host,
			CURLOPT_PORT: api.config.port,
			CURLOPT_USERNAME: api.config.username,
			CURLOPT_PASSWORD: api.config.password,
			CURLOPT_USE_SSL: api.config.encrypt=="none" ? 0 : 3,
			CURLOPT_SSL_VERIFYPEER: false,
			CURLOPT_LOGIN_OPTIONS: 'AUTH=PLAIN'
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
			var trace = _avoid_nilb(_function_argument("trace"), false);
			var saveHeader = _avoid_nilb(_function_argument("saveHeader"), false);
			var multiple = _avoid_nilb(_function_argument("multiple"), false);
			var saveOnlyLast = _avoid_nilb(_function_argument("saveOnlyLast"), false);
			
			native_async("curlwrapper","easyperform", JSON.stringify({
				write_to_string: true,
				options: options,
				trace: trace,
				header_to_string: saveHeader,
				multiple: multiple,
				save_only_last: saveOnlyLast
			}))!
			
			_function_return(JSON.parse(_result()));
		};
		
		this.request = function(){
			var path = _function_argument("path");
			var query = _function_argument("query");
			var saveHeader = _avoid_nilb(_function_argument("saveHeader"), false);
			var multiple = _avoid_nilb(_function_argument("multiple"), false);
			var saveOnlyLast = _avoid_nilb(_function_argument("saveOnlyLast"), false);
			
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
			
			_call_function(api.wrapper, {options: options, trace: true, saveHeader: saveHeader, multiple: multiple, saveOnlyLast: saveOnlyLast})!
			var resp = _result_function();
			
			__RESP = resp;
			
			if(resp.code == "CURLE_OK"){
				resp.result = resp.result.trim();
				_function_return(resp);
			}else{
				var error = resp.error;
				
				if(resp.code == "CURLE_QUOTE_ERROR" && error == "Quote command returned error"){
					var trace = resp.trace.trim().split(/\r?\n/);
					for(var i = trace.length - 1; i > -1; i--){
						var ell = trace[i];
						ell = ell.slice(ell.indexOf(" ") + 1);
						if(_starts_with(ell, "BAD") || _starts_with(ell, "NO")){
							error = ell;
							error = error.slice(error.indexOf(" ") + 1).trim();
							break;
						};
					};
				};
				
				_InMail.error(resp.code + ' - ' + error, null, api.protocol);
			};
		};
	};
	
	if(!_is_nilb(_InMail.proxy) && typeof _InMail.proxy==="object"){
		api.setProxy(_InMail.proxy);
	};
	
	// Decode Quoted-Printable
	this.decodeQS = function(str){
		return str
			// https://tools.ietf.org/html/rfc2045#section-6.7, rule 3:
			// “Therefore, when decoding a `Quoted-Printable` body, any trailing white
			// space on a line must be deleted, as it will necessarily have been added
			// by intermediate transport agents.”
			.replace(/[\t\x20]$/gm, '')
			// Remove hard line breaks preceded by `=`. Proper `Quoted-Printable`-
			// encoded data only contains CRLF line  endings, but for compatibility
			// reasons we support separate CR and LF too.
			.replace(/=(?:\r\n?|\n|$)/g, '')
			// Decode escape sequences of the form `=XX` where `XX` is any
			// combination of two hexidecimal digits. For optimal compatibility,
			// lowercase hexadecimal digits are supported as well. See
			// https://tools.ietf.org/html/rfc2045#section-6.7, note 1.
			.replace(/=([a-fA-F0-9]{2})/g, function($0, $1) {
				var codePoint = parseInt($1, 16);
				return String.fromCharCode(codePoint);
			});
	};
	
	this.errorHandler = function(error, data){
		error = error.toString();
		data = _avoid_nil(data).toString();
		
		var errors = {
			"INVALID_VALUE": {
				"ru": "Неверное значение аргумента: " + data,
				"en": "Invalid argument value: " + data
			},
			"INCORRECT_ARGS_NUM": {
				"ru": "Неверное количество аргументов для параметра поиска: " + data,
				"en": "Incorrect number of arguments for search option: " + data
			},
			"ARG_NOT_DATE": {
				"ru": 'Аргумент параметра поиска "' + data + '" должен быть Объектом даты или строкой даты, доступной для синтаксического анализа',
				"en": 'Search option "' + data + '" argument must be a Date object or a parseable date string'
			},
			"ARG_NOT_NUM": {
				"ru": 'Аргумент параметра поиска "' + data + '" должен быть числом',
				"en": 'Search option "' + data + '" argument must be a number'
			},
			"OR_NOT_TWO_ARGS": {
				"ru": "ИЛИ должно иметь ровно два аргумента",
				"en": "OR must have exactly two arguments"
			},
			"SERVER_NOT_SUPPORT": {
				"ru": data + " не поддерживается сервером",
				"en": data + " is not supported by the server"
			},
			"SORT_NOT_SUPPORT": {
				"ru": "Сортировка не поддерживается на сервере",
				"en": "Sort is not supported on the server"
			},
			"UNEXPECTED_OPTION": {
				"ru": "Неожиданный параметр поиска: " + data,
				"en": "Unexpected search option: " + data
			},
			"UNEXPECTED_OPTION_TYPE": {
				"ru": "Неожиданный тип данных параметра поиска. Ожидалась строка или массив. Получено: " + data,
				"en": "Unexpected search option data type. Expected string or array. Received: " + data
			},
			"UNEXPECTED_CRITERION": {
				"ru": "Неожиданный критерий сортировки: " + data,
				"en": "Unexpected sort criterion: " + data
			},
			"UNEXPECTED_CRITERION_TYPE": {
				"ru": "Неожиданный тип данных критерия сортировки. Ожидалась строка. Получено: " + data,
				"en": "Unexpected sort criterion data type. Expected string. Received: " + data
			},
			"MAILBOX_NOT_SELECTED": {
				"ru": "Почтовый ящик не выбран или выбран неправильно",
				"en": "Mailbox not selected or selected incorrectly"
			},
			"EMPTY_SORT_CRITERIA": {
				"ru": "Ожидается массив хотя бы с одним критерием сортировки",
				"en": "Expected array with at least one sort criteria"
			},
			"EMPTY_UID_LIST": {
				"ru": "Пустой список uid",
				"en": "Empty uid list"
			},
			"EMPTY_SEQUENCE_LIST": {
				"ru": "Пустой список порядковых номеров",
				"en": "Empty sequence number list"
			},
			"UID_IS_SMALLER": {
				"ru": "UID должен быть больше нуля",
				"en": "UID must be greater than zero"
			},
			"WRONG_FORMAT_UID": {
				"ru": 'UID должен быть целым числом, "*" или диапазоном: ' + data,
				"en": 'UID must be an integer, "*", or a range: ' + data
			},
			"NOT_FLAGS_KEYWORDS": {
				"ru": 'Не Флаги не Ключевые слова не указаны',
				"en": 'No Flags no Keywords are not specified'
			},
			"KEYWORD_INVALID_CHARS": {
				"ru": 'Ключевое слово "' + data + '" содержит недопустимые символы.',
				"en": 'The keyword "' + data + '" contains invalid characters'
			},
			"KEYWORDS_INVALID_ARGS": {
				"ru": 'Аргумент ключевых слов должен быть строкой или непустым массивом',
				"en": 'Keywords argument must be a string or a non-empty Array'
			},
			"FLAGS_INVALID_ARGS": {
				"ru": 'Аргумент флагов должен быть строкой или непустым массивом',
				"en": 'Flags argument must be a string or a non-empty Array'
			}
		};
		
		var errorObj = errors[error];
		
		var message = '_InMail.' + api.protocol + ' : ' + error;
		if(_is_nilb(errorObj)){
			if(error==data || _is_nilb(data)){
				fail(message);
			}else{
				fail(message + ", " + data);
			};
		}else{
			fail(message + " - " + errorObj[_K]);
		};
	};
};
_InMail.assignApi = function(fn){
	fn.prototype = Object.create(this.baseApi.prototype);
	fn.prototype.constructor = fn;
	return fn;
};