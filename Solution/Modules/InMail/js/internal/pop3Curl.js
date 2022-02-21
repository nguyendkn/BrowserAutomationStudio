_InMail.pop3 = _InMail.assignApi(function(config){
	const api = this;
	_InMail.baseApi.call(this, true, "pop3", config);
	
	this.validateCriteria = function(criteria){
		_validate_argument_type(criteria, ['array','string'], 'Search criteria', '_InMail.pop3');
		if(typeof criteria === 'string'){
			criteria = [criteria];
		};
		if(typeof criteria[0] === 'string'){
			criteria[0] = criteria[0].toUpperCase();
		};
		if(criteria[0] != "ALL" || criteria.length > 1){
			api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Фильтрация' : 'Filtration');
		};
	};
	
	this.validateUIDList = function(uids){
		for(var i = 0, len = uids.length, intval; i < len; ++i){			
			intval = parseInt('' + uids[i], 10);
			
			if(isNaN(intval)){
				api.errorHandler('WRONG_FORMAT_UID', uids[i]);
			}else if (intval <= 0){
				api.errorHandler('UID_IS_SMALLER');
			}else if(typeof uids[i] !== 'number'){
				uids[i] = intval;
			};
		};
	};
	
	this.prepareUIDs = function(uids){
		if(_is_nilb(uids) || (Array.isArray(uids) && uids.length === 0)){
			api.errorHandler('EMPTY_UID_LIST');
		};
		
		if(!Array.isArray(uids)){
			if(typeof uids == "string"){
				uids = _to_arr(uids);
			}else{
				uids = [uids];
			};
		};
		
		api.validateUIDList(uids);
		
		if(uids.length === 0){
			api.errorHandler('EMPTY_UID_LIST');
		};
		
		return uids;
	};
	
	this.status = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Информация о папке' : 'Folder info');
	};
	
	this.getBoxes = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Получить список папок' : 'Get list of folders');
	};
	
	this.addBox = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Создать папку' : 'Create folder');
	};
	
	this.delBox = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Удалить папку' : 'Delete folder');
	};
	
	this.renameBox = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Переименовать папку' : 'Rename folder');
	};
	
	this.sort = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Сортировка' : 'Sorting');
	};
	
	this.getFlags = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Получить флаги' : 'Get flags');
	};
	
	this.setFlags = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Установить флаги' : 'Set flags');
	};
	
	this.addFlags = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Добавить флаги' : 'Add Flags');
	};
	
	this.delFlags = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Удалить флаги' : 'Remove flags');
	};
	
	this.expunge = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', 'Expunge');
	};
	
	this.copyMessages = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Копировать письмо' : 'Copy message');
	};
	
	this.moveMessages = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Переместить письмо' : 'Move message');
	};
	
	this.search = function(){
		api.validateCriteria(_function_argument("criteria"));
		
		_call_function(api.request, {path: "", query: "LIST"})!
		var result = _result_function().result;
		
		result = result.split("\r\n").filter(function(ell){return ell});
		
		result = result.map(function(ell){return parseInt(ell.slice(0, ell.indexOf(' ')))});
		
		_function_return(result);
	};
	
	this.searchLast = function(){
		_call_function(api.request, {path: "", query: "LIST"})!
		var result = _result_function().result;
		
		var last = 0;
		
		var indexStart = result.lastIndexOf('\r\n') + 2;
		
		if(indexStart > 1){
			var indexEnd = result.indexOf(' ', indexStart);
			last = parseInt(result.slice(indexStart, indexEnd));
		};
		
		_function_return(last);
	};
	
	this.count = function(){
		api.validateCriteria(_function_argument("criteria"));
		
		_call_function(api.request, {path: "", query: "STAT", noBody: true})!
		var trace = _result_function().trace;
		
		var count = 0;
		
		var indexStart = trace.lastIndexOf('STAT\r\n+OK') + 10;
		if(indexStart > 9){
			var indexEnd = trace.indexOf(' ', indexStart);
			count = parseInt(trace.slice(indexStart, indexEnd));
		};
		
		_function_return(count);
	};
	
	this.delMessages = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		
		_do_with_params({uids:uids}, function(){
			var uid_index = _iterator() - 1;
			if(uid_index > _cycle_param("uids").length - 1){
				_break();
			};
			_call_function(api.request, {path: _cycle_param("uids")[uid_index], query: "DELE", noBody: true})!
			var resp = _result_function();
		})!
		
		_call_function(api.request, {path: "", query: "QUIT", noBody: true})!
		var resp = _result_function();
	};
	
	this.getParamInfo = function(data){
		data = _avoid_nilb(data, []);
		if(!Array.isArray(data)){
			data = [data];
		};
		var raw = false;
		data = data.filter(function(d){return !(raw = (d === 'raw'))}).map(function(d){return d.toLowerCase()});
		var base = data.length > 0;
		return {
			base: base,
			raw: raw,
			any: base || raw,
			data: data
		};
	};
	
	this.processHeaders = function(data, message, headers, date){
		var parsed = api.parseHeader(data.trim());
		for(var key in parsed){
			var value = parsed[key];
			value = Array.isArray(value) && value.length < 2 ? value[0] : value;
			if(headers.raw){
				message.headers.raw[key] = value;
			};
			if(headers.base && headers.data.indexOf(key) > -1){
				message.headers[key] = value;
			};
			if(date && key == "date"){
				message.date = new Date(value);
			};
		};
	};
	
	this.getMessages = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var body = api.getParamInfo(_function_argument("body"));
		var headers = api.getParamInfo(_function_argument("headers"));
		var attachments = _function_argument("attachments");
		var size = _avoid_nilb(_function_argument("size"), false);
		var date = _avoid_nilb(_function_argument("date"), false);
		var attachnames = _avoid_nilb(_function_argument("attachnames"), false);
		
		if(_function_argument("flags")){
			api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Получить флаги' : 'Get flags');
		};
		
		var messages = [];
		
		_do_with_params({uids:uids}, function(){
			var uid_index = _iterator() - 1;
			if(uid_index > _cycle_param("uids").length - 1){
				_break();
			};
			var uid = _cycle_param("uids")[uid_index];
			var message = {uid:uid};
			if(body.any){
				message.body = {};
			};
			if(headers.any){
				message.headers = {};
				if(headers.raw){
					message.headers.raw = {};
				};
			};
			messages.push(message);
			
			_if(size, function(){
				_call_function(api.request, {path: uid, query: "LIST", noBody: true})!
				var trace = _result_function().trace;
				
				message.size = 0;
		
				var indexStart = trace.lastIndexOf('LIST');
				if(indexStart > -1){
					indexStart = trace.indexOf('+OK', indexStart);
					var indexEnd = trace.indexOf('\r\n', indexStart);
					var temp = trace.slice(indexStart, indexEnd);
					message.size = parseInt(temp.slice(temp.lastIndexOf(' ')));
				};
			})!
			
			_if((headers.any || date) && !(body.any || attachnames || attachments), function(){
				_call_function(api.request, {path: "", query: "TOP " + uid + " 0"})!
				var resp = _result_function();
				
				api.processHeaders(resp.result, message, headers, date);
			}, function(){
				_call_function(api.request, {path: uid, query: "RETR"})!
				var resp = _result_function();
				
				var temp = resp.result.split('\r\n\r\n');
				var headerData = temp[0];
				var bodyData = temp.slice(1).join('\r\n\r\n').trim();
				delete temp;
				
				api.processHeaders(headerData, message, headers, date);
				
				if(body.base || attachnames || attachments){
					
				};
				
				if(body.raw){
					message.body.raw = bodyData;
				};
			})!
		})!
		
		_function_return(messages);
	};
});