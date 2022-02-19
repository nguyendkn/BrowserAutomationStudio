_InMail.baseApi = function(isCurl, protocol, config){
	const api = this;
	this.protocol = protocol;
	this.config = config;
	
	if(isCurl){
		
		if(_InMail.curl.isInit()){
			_InMail.curl.clearTimeout();
			_InMail.curl.cleanup();
		};
		
		this.curlOpts = {
			url: api.protocol + (api.config.encrypt=="ssl" ? 's' : '') + '://' + api.config.host,
			port: api.config.port,
			username: api.config.username,
			password: api.config.password,
			use_ssl: api.config.encrypt=="none" ? 0 : 3,
			ssl_verifypeer: false,
			login_options: 'AUTH=PLAIN'
		};
		
		this.setOptions = function(opts){
			var resp = _InMail.curl.setOptions(opts);
			if(!resp.success){
				_InMail.error(resp.error, api.protocol);
			};
		};
		
		this.init = function(){
			_InMail.curl.init();
			api.setOptions(api.curlOpts);
		};
		
		this.setProxy = function(proxy){
			api.curlOpts.proxy = (proxy.type=="socks5" ? "socks5h" : proxy.type) + '://' + proxy.host + ':' + proxy.port;
			api.curlOpts.proxyusername = _is_nilb(proxy.username) ? "" : proxy.username;
			api.curlOpts.proxypassword = _is_nilb(proxy.password) ? "" : proxy.password;
			if(_InMail.curl.isInit()){
				_InMail.curl.cleanup();
			};
		};
		
		this.clearProxy = function(){
			delete api.curlOpts.proxy;
			delete api.curlOpts.proxyusername;
			delete api.curlOpts.proxypassword;
			if(_InMail.curl.isInit()){
				_InMail.curl.cleanup();
			};
		};
		
		this.setConnectTimeout = function(ms){
			api.curlOpts.connecttimeout_ms = ms;
		};
		
		this.request = function(){
			var path = _function_argument("path");
			var query = _function_argument("query");
			var isFetch = _avoid_nilb(_function_argument("isFetch"), false);
			
			var options = {};
			
			if(_is_nilb(path)){
				options.url = api.curlOpts.url;
			}else{
				options.url = api.curlOpts.url + (path.slice(0, 1) != '/' ? '/' : '') + path;
			};
			
			options.customrequest = _is_nilb(query) ? "" : query;
			
			_InMail.log(api.protocol + ' ' + (_K=="ru" ? 'запрос' : 'request') + ': «‎' + query + '»');
			
			_InMail.curl.clearTimeout();
			
			if(!_InMail.curl.isInit()){
				api.init();
			};
			
			_call_function(_InMail.curl.request, {options: options, isFetch: isFetch, timeout: (api.timeout || 5 * 60 * 1000)})!
			var resp = _result_function();
			
			__RESP = resp;			
			
			var msg = api.protocol + ' ' + (_K=="ru" ? 'ответ' : 'response') + ': «‎' + resp.code + '»';
			
			if(resp.result){
				resp.result = resp.result.trim();
				msg += (', ' + (_K=="ru" ? 'результат' : 'result') + ': «‎' + resp.result + '»');
			};
			
			if(resp.error){
				resp.error = resp.error.trim();
				msg += (', ' + (_K=="ru" ? 'ошибка' : 'error') + ': «‎' + resp.error + '»');
			};
			
			_InMail.log(msg);
			
			if(resp.success){
				_function_return(resp);
			}else{
				var error = resp.error;
				
				if(resp.code == "QUOTE_ERROR" && error == "Quote command returned error"){
					var debug = resp.debug.trim().split(/\r?\n/);
					for(var i = debug.length - 1; i > -1; i--){
						var ell = debug[i];
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
				"ru": "Сортировка не поддерживается на сервере, используйте поиск без сортировки",
				"en": "Sort is not supported on the server, use non-sorting search"
			},
			"ESEARCH_NOT_SUPPORT": {
				"ru": "ESEARCH не поддерживается на сервере",
				"en": "ESEARCH is not supported on the server"
			},
			"MOVE_NOT_SUPPORT": {
				"ru": "Перемещение не поддерживается на сервере",
				"en": "Move is not supported on the server"
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
			"TOBOX_NOT_SPECIFIED": {
				"ru": "Конечный почтовый ящик не указан или указан неправильно",
				"en": "Destination mailbox not specified or specified incorrectly"
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
			},
			"UNKNOWN_ENCODING": {
				"ru": 'Неизвестная кодировка' + data,
				"en": 'Unknown encoding ' + data
			},
			"UEE_INVALID_DATA": {
				"ru": 'Неверные UUE данные',
				"en": 'Invalid UUE data'
			},
			"EMPTY_MSGS_LIST": {
				"ru": 'Не удалось найти письмо, соответствующее указанному идентификатору, в указанной папке почтового ящика',
				"en": 'Could not find a message matching the specified id in the specified mailbox folder'
			},
			"NOT_AVAILABLE_ON_POP3": {
				"ru": 'Функция "' + data + '" недоступна по pop3',
				"en": '"' + data + '" function is not available on pop3'
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