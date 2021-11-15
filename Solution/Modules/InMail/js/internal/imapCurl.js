_InMail.imap = _InMail.assignApi(function(autoConfig, host, port, encrypt, username, password, folder, timeout){
	const api = this;
	_InMail.baseApi.call(this, true, "imap", autoConfig, host, port, encrypt, username, password, folder, timeout);
	
	this.caps = null;

	this.escape = function(str){
		return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	};
	
	this.parseCaps = function(str){
		var start = str.lastIndexOf('CAPABILITY');
		if(start > -1){
			var end = start;
			for(; end < str.length; end++){
				var code = str.charCodeAt(end);
				if(code === 10 || code === 13 || code === 93){
					break;
				};
			};
			if(end != start){
				return str.slice(start, end).split(' ').slice(1).filter(function(cap){return !_is_nilb(cap)});
			};
		};
		return [];
	};
	
	this.capability = function(){
		_if(_is_nilb(api.caps), function(){
			_call_function(api.request, {query: 'CAPABILITY'})!
			var resp = _result_function();
			
			api.caps = api.parseCaps(resp.result);
		})!;
		
		_function_return(api.caps);
	};
	
	this.serverSupports = function(cap){
		return (api.caps && api.caps.indexOf(cap) > -1);
	};
	
	this.makeRequest = function(){
		var path = _function_argument("path");
		var query = _function_argument("query");
		var isUTF8 = _avoid_nilb(_function_argument("isUTF8"), false);
		var folder = _avoid_nilb(_function_argument("folder"), api.folder);
		
		if(isUTF8){
			query = 'ENABLE UTF8=ACCEPT\r\nSELECT "' + api.escape(folder) + '"\r\n' + query;
		}else{
			path = _avoid_nil(path, folder);
		};
		
		_call_function(api.request, {path: path, query: query, multiple: isUTF8, saveOnlyLast: isUTF8})!
		var resp = _result_function();
		
		try{
			
			if(_is_nilb(api.caps)){
				var caps = api.parseCaps(resp.trace);
				if(caps.length){
					api.caps = caps;
				};
			};
		}catch(_){}
		
		_function_return(resp.result);
	};

	this.validateUIDList = function(uids, noError){
		for(var i = 0, len = uids.length, intval; i < len; ++i){
			if(typeof uids[i] === 'string'){
				if(uids[i] === '*' || uids[i] === '*:*'){
					if (len > 1){
						uids = ['*'];
					};
					break;
				}else if(/^(?:[\d]+|\*):(?:[\d]+|\*)$/.test(uids[i])){
					continue;
				};
			};
			
			intval = parseInt('' + uids[i], 10);
			
			if(isNaN(intval)){
				var err = 'WRONG_FORMAT_UID';
				if(noError){
					return err;
				}else{
					api.errorHandler(err, uids[i]);
				};
			}else if (intval <= 0){
				var err = 'UID_IS_SMALLER';
				if(noError){
					return err;
				}else{
					api.errorHandler(err);
				};
			}else if(typeof uids[i] !== 'number'){
				uids[i] = intval;
			};
		};
	};

	this.hasNonASCII = function(str){
		for(var i = 0; i < str.length; ++i){
			if(str.charCodeAt(i) > 0x7F){
				return true;
			};
		};
		return false;
	};
	
	/*this.toLatin1 = function(str){
		var ret = '';
		
		for(var i = 0; i < str.length; i++){
			var charcode = str.charCodeAt(i);
			if(charcode < 0x80){
				ret += String.fromCharCode(charcode);
			}else if(charcode < 0x800){
				ret += String.fromCharCode(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
			}else if(charcode < 0xd800 || charcode >= 0xe000){
				ret += String.fromCharCode(0xe0 | (charcode >> 12), 0x80 | ((charcode>>6) & 0x3f), 0x80 | (charcode & 0x3f));
			}else{
				i++;
				charcode = 0x10000 + (((charcode & 0x3ff)<<10) | (str.charCodeAt(i) & 0x3ff));
				ret += String.fromCharCode(0xf0 | (charcode >>18), 0x80 | ((charcode>>12) & 0x3f), 0x80 | ((charcode>>6) & 0x3f), 0x80 | (charcode & 0x3f));
			};
		};
		
		return ret;
	};*/

	this.buildString = function(str, info){
		if(typeof str !== 'string'){
			str = '' + str;
		};
		
		if(info && !info.hasUTF8 && api.hasNonASCII(str)){
			info.hasUTF8 = true;
		};
		
		return '"' + api.escape(str) + '"';
		
		/*if(api.hasNonASCII(str)){
			if(info){
				info.hasUTF8 = true;
			};
			var latin1 = api.toLatin1(str);
			return '{' + latin1.length + '}\r\n' + latin1;
		}else{
			return '"' + api.escape(str) + '"';
		};*/
	};

	this.buildSearchQuery = function(options, info, isOrChild){
		var searchargs = '';
		
		for(var i = 0, len = options.length; i < len; ++i){
			var criteria = (isOrChild ? options : options[i]);
			var args = null;
			var modifier = (isOrChild ? '' : ' ');
			
			if(typeof criteria === 'string'){
				criteria = criteria.toUpperCase();
			}else if(Array.isArray(criteria)){
				if(criteria.length > 1){
					args = criteria.slice(1);
				};
				if(criteria.length > 0){
					criteria = criteria[0].toUpperCase();
				};
			}else{
				api.errorHandler('UNEXPECTED_OPTION_TYPE', typeof criteria);
			};
			
			if(criteria === 'OR'){
				if(args.length !== 2){
					api.errorHandler('OR_NOT_TWO_ARGS');
				};
				
				if(isOrChild){
					searchargs += 'OR (';
				}else{
					searchargs += ' OR (';
				};
				
				searchargs += api.buildSearchQuery(args[0], info, true);
				searchargs += ') (';
				searchargs += api.buildSearchQuery(args[1], info, true);
				searchargs += ')';
			}else{
				if(criteria[0] === '!'){
					modifier += 'NOT ';
					criteria = criteria.substr(1);
				};
				
				switch (criteria) {
					// -- Standard criteria --
					case 'ALL':
					case 'ANSWERED':
					case 'DELETED':
					case 'DRAFT':
					case 'FLAGGED':
					case 'NEW':
					case 'SEEN':
					case 'RECENT':
					case 'OLD':
					case 'UNANSWERED':
					case 'UNDELETED':
					case 'UNDRAFT':
					case 'UNFLAGGED':
					case 'UNSEEN':
						searchargs += modifier + criteria;
						break;
					case 'BCC':
					case 'BODY':
					case 'CC':
					case 'FROM':
					case 'SUBJECT':
					case 'TEXT':
					case 'TO':
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						searchargs += modifier + criteria + ' ' + api.buildString(args[0], info);
						break;
					case 'BEFORE':
					case 'ON':
					case 'SENTBEFORE':
					case 'SENTON':
					case 'SENTSINCE':
					case 'SINCE':
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						}else if(!(args[0]instanceof Date)){
							if((args[0] = new Date(args[0])).toString() === 'Invalid Date'){
								api.errorHandler('ARG_NOT_DATE', criteria);
							};
						};
						searchargs += modifier + criteria + ' ' + args[0].getDate() + '-' + api.months[args[0].getMonth()] + '-' + args[0].getFullYear();
						break;
					case 'KEYWORD':
					case 'UNKEYWORD':
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						searchargs += modifier + criteria + ' ' + args[0];
						break;
					case 'LARGER':
					case 'SMALLER':
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						var num = parseInt(args[0], 10);
						if(isNaN(num)){
							api.errorHandler('ARG_NOT_NUM', criteria);
						};
						searchargs += modifier + criteria + ' ' + args[0];
						break;
					case 'HEADER':
						if(!args || args.length !== 2){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						searchargs += modifier + criteria + ' "' + api.escape('' + args[0]) + '" ' + api.buildString(args[1], info);
						break;
					case 'UID':
						if(!args){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						api.validateUIDList(args);
						if(args.length === 0){
							api.errorHandler('EMPTY_UID_LIST');
						};
						searchargs += modifier + criteria + ' ' + args.join(',');
						break;
						// Extensions ==========================================================
					case 'X-GM-MSGID': // Gmail unique message ID
					case 'X-GM-THRID': // Gmail thread ID
						if(!api.serverSupports('X-GM-EXT-1')){
							api.errorHandler('SERVER_NOT_SUPPORT', criteria);
						};
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						}else{
							if(!(/^\d+$/.test(args[0]))){
								api.errorHandler('INVALID_VALUE', criteria);
							};	
						};
						searchargs += modifier + criteria + ' ' + args[0];
						break;
					case 'X-GM-RAW': // Gmail search syntax
						if(!api.serverSupports('X-GM-EXT-1')){
							api.errorHandler('SERVER_NOT_SUPPORT', criteria);
						};
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						searchargs += modifier + criteria + ' ' + api.buildString(args[0], info);
						break;
					case 'X-GM-LABELS': // Gmail labels
						if(!api.serverSupports('X-GM-EXT-1')){
							api.errorHandler('SERVER_NOT_SUPPORT', criteria);
						};
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						searchargs += modifier + criteria + ' ' + args[0];
						break;
					case 'MODSEQ':
						if(!api.serverSupports('CONDSTORE')){
							api.errorHandler('SERVER_NOT_SUPPORT', criteria);
						};
						if(!args || args.length !== 1){
							api.errorHandler('INCORRECT_ARGS_NUM', criteria);
						};
						searchargs += modifier + criteria + ' ' + args[0];
						break;
					default:
						// last hope it's a seqno set
						// http://tools.ietf.org/html/rfc3501#section-6.4.4
						var seqnos = (args ? [criteria].concat(args) : [criteria]);
						if(!api.validateUIDList(seqnos, true)){
							if(seqnos.length === 0){
								api.errorHandler('EMPTY_SEQUENCE_LIST');
							};
							searchargs += modifier + seqnos.join(',');
						}else{
							api.errorHandler('UNEXPECTED_OPTION', criteria);
						};	
				};
			};
			
			if(isOrChild){
				break;
			};
		};
		
		return searchargs;
	};
	
	this.parseUIDs = function(resp){
		return _avoid_nil(resp.match(/\d+/g), []).map(function(uid){return parseInt(uid)});
	};
	
	this.search = function(){
		var criteria = _function_argument("criteria");
		var folder = _avoid_nilb(_function_argument("folder"), api.folder);
		
		var act = '_InMail.imap.search';
		_validate_argument_type(criteria, ['array','string'], 'Search criteria', act);
		if(typeof criteria === 'string'){
			criteria = [criteria];
		};
		_validate_argument_type(folder, 'string', 'Folder name', act);
		if(!folder.length){
			api.errorHandler('MAILBOX_NOT_SELECTED');
		};
		
		var cmd = 'UID SEARCH';
		var info = {
			hasUTF8: false
		};
		
		_call_function(api.capability, {})!
		
		var query = api.buildSearchQuery(criteria, info);
		
		if(info.hasUTF8){
			cmd += ' CHARSET UTF-8';
		};
		
		cmd += query;
		
		_call_function(api.makeRequest, {query: cmd, folder: folder, isUTF8: info.hasUTF8})!
		var resp = _result_function();
		
		var result = api.parseUIDs(resp);
		
		_function_return(result);
	};
	
	this.sort = function(){
		var sorts = _function_argument("sorts");
		var criteria = _function_argument("criteria");
		var folder = _avoid_nilb(_function_argument("folder"), api.folder);
		
		var act = '_InMail.imap.sort';
		_validate_argument_type(sorts, ['array','string'], 'Sorting criteria', act);
		if(typeof sorts === 'string'){
			sorts = [sorts];
		};
		if(!sorts.length){
			api.errorHandler('EMPTY_SORT_CRITERIA');
		};
		_validate_argument_type(criteria, ['array','string'], 'Search criteria', act);
		if(typeof criteria === 'string'){
			criteria = [criteria];
		};
		_validate_argument_type(folder, 'string', 'Folder name', act);
		if(!folder.length){
			api.errorHandler('MAILBOX_NOT_SELECTED');
		};
		
		_call_function(api.capability, {})!
		
		if(!api.serverSupports('SORT')){
			api.errorHandler('SORT_NOT_SUPPORT');
		};
		
		sorts = sorts.map(function(c){
			if(typeof c !== 'string'){
				api.errorHandler('UNEXPECTED_CRITERION_TYPE', typeof c);
			};
			
			var modifier = '';
			if(c[0] === '-'){
				modifier = 'REVERSE ';
				c = c.substring(1);
			};
			
			switch (c.toUpperCase()) {
				case 'ARRIVAL':
				case 'CC':
				case 'DATE':
				case 'FROM':
				case 'SIZE':
				case 'SUBJECT':
				case 'TO':
					break;
				default:
					api.errorHandler('UNEXPECTED_CRITERION', c);
			}
			
			return modifier + c;
		});
		
		sorts = sorts.join(' ');
		
		var info = {
			hasUTF8: false
		};
		
		var query = api.buildSearchQuery(criteria, info);
		
		var cmd = 'UID SORT (' + sorts + ') ' + (info.hasUTF8 ? 'UTF-8' : 'US-ASCII') + query;
		
		_call_function(api.makeRequest, {query: cmd, folder: folder, isUTF8: info.hasUTF8})!
		var resp = _result_function();
		
		var result = api.parseUIDs(resp);
		
		_function_return(result);
	};
	
	this.store = function(){
		var uids = _function_argument("uids");
		var config = _function_argument("config");
		var folder = _avoid_nilb(_function_argument("folder"), api.folder);
		
		var act = '_InMail.imap.store';
		_validate_argument_type(config, 'object', 'Config', act);
		if(_is_nilb(config.flags) && _is_nilb(config.keywords)){
			api.errorHandler('NOT_FLAGS_KEYWORDS');
		};
		_validate_argument_type(folder, 'string', 'Folder name', act);
		if(!folder.length){
			api.errorHandler('MAILBOX_NOT_SELECTED');
		};
		
		var isFlags = !_is_nilb(config.flags);
		var items = (isFlags ? config.flags : config.keywords);
		
		if(!Array.isArray(uids)){
			uids = [uids];
		};
		
		api.validateUIDList(uids);
		
		if(uids.length === 0){
			api.errorHandler('EMPTY_UID_LIST');
		};
		
		if((!Array.isArray(items) && typeof items !== 'string') || (Array.isArray(items) && items.length === 0)){
			if(isFlags){
				api.errorHandler('FLAGS_INVALID_ARGS');
			}else{
				api.errorHandler('KEYWORDS_INVALID_ARGS');
			};
		};
		
		if(!Array.isArray(items)){
			items = [items];
		};
		
		for(var i = 0, len = items.length; i < len; ++i){
			if(isFlags){
				if(items[i][0] !== '\\'){
					items[i] = '\\' + items[i];
				};
			}else{
				// keyword contains any char except control characters (%x00-1F and %x7F)
				// and: '(', ')', '{', ' ', '%', '*', '\', '"', ']'
				if(/[\(\)\{\\\"\]\%\*\x00-\x20\x7F]/.test(items[i])){
					api.errorHandler('KEYWORD_INVALID_CHARS', items[i]);
				};
			};
		};
		
		items = items.join(' ');
		uids = uids.join(',');
		
		var cmd = 'UID STORE ' + uids + ' ' + config.mode + 'FLAGS.SILENT (' + items + ')';
		
		_call_function(api.makeRequest, {query: cmd, folder: folder})!
		var resp = _result_function();
	};
	
	this.addFlags = function(){
		var args = _function_arguments();
		
		_call_function(api.store, {
			uids: args.uids,
			config: {
				mode: '+',
				flags: args.flags
			},
			folder: args.folder
		})!
	};
	
	this.delFlags = function(){
		var args = _function_arguments();
		
		_call_function(api.store, {
			uids: args.uids,
			config: {
				mode: '-',
				flags: args.flags
			},
			folder: args.folder
		})!
	};
	
	this.setFlags = function(){
		var args = _function_arguments();
		
		_call_function(api.store, {
			uids: args.uids,
			config: {
				mode: '',
				flags: args.flags
			},
			folder: args.folder
		})!
	};
	
	this.addKeywords = function(){
		var args = _function_arguments();
		
		_call_function(api.store, {
			uids: args.uids,
			config: {
				mode: '+',
				keywords: args.keywords
			},
			folder: args.folder
		})!
	};
	
	this.delKeywords = function(){
		var args = _function_arguments();
		
		_call_function(api.store, {
			uids: args.uids,
			config: {
				mode: '-',
				keywords: args.keywords
			},
			folder: args.folder
		})!
	};
	
	this.setKeywords = function(){
		var args = _function_arguments();
		
		_call_function(api.store, {
			uids: args.uids,
			config: {
				mode: '',
				keywords: args.keywords
			},
			folder: args.folder
		})!
	};
	
	this.fetch = function(){
		var uids = _function_argument("uids");
		var options = _function_argument("options");
		var folder = _avoid_nilb(_function_argument("folder"), api.folder);
		
		var act = '_InMail.imap.fetch';
		if(options){
			_validate_argument_type(options, 'object', 'Options', act);
		};
		_validate_argument_type(folder, 'string', 'Folder name', act);
		if(!folder.length){
			api.errorHandler('MAILBOX_NOT_SELECTED');
		};
		
		if(_is_nilb(uids) || (Array.isArray(uids) && uids.length === 0)){
			api.errorHandler('EMPTY_UID_LIST');
		};
		
		if(!Array.isArray(uids)){
			uids = [uids];
		};
		
		api.validateUIDList(uids);
		
		if(uids.length === 0){
			api.errorHandler('EMPTY_UID_LIST');
		};
		
		_call_function(api.capability, {})!
		
		uids = uids.join(',');
		
		var cmd = 'UID FETCH ' + uids + ' (';
		var fetching = [];
			
		if(api.serverSupports('X-GM-EXT-1')){
			fetching.push('X-GM-THRID');
			fetching.push('X-GM-MSGID');
			fetching.push('X-GM-LABELS');
		};
		
		fetching.push('UID');
		fetching.push('FLAGS');
		fetching.push('INTERNALDATE');
		
		if(options){
			if(options.envelope){
				fetching.push('ENVELOPE');
			};
			if(options.struct){
				fetching.push('BODYSTRUCTURE');
			};
			if (options.size){
				fetching.push('RFC822.SIZE');
			};
			if(Array.isArray(options.extensions)){
				options.extensions.forEach(function(extension){
					fetching.push(extension.toUpperCase());
				});
			};
			
			cmd += fetching.join(' ');
			
			if(!_is_nilb(options.bodies)){
				var bodies = options.bodies;
				var prefix = (options.markSeen ? '' : '.PEEK');
				if(!Array.isArray(bodies)){
					bodies = [bodies];
				};
				for(var i = 0, len = bodies.length; i < len; ++i){
					cmd += ' BODY' + prefix + '[' + bodies[i] + ']';
				};
			}
		}else{
			cmd += fetching.join(' ');
		};
		
		cmd += ')';
		
		_call_function(api.request, {path: folder, query: cmd})!
		var resp = _result_function();
		
		var reg = /{(\d+)}\r?\n?$/;
		var result = resp.result;
		
		if(reg.test(result)){
			var start = resp.trace.lastIndexOf(resp.result);
			if(start > -1){
				start += resp.result.length;
				var temp = _avoid_nil(resp.result.match(reg), []);
				if(temp.length > 0){
					result = resp.trace.substr(start, Number(temp[1])).trim();
					var i = result.indexOf("\r\n");
					var firstLine = result.slice(0, i + 2);
					if(firstLine.indexOf("_Part_") > -1){
						result = result.slice(i + 2);
					};
					i = result.lastIndexOf("\r\n");
					var lastLine = result.slice(i);
					if(lastLine.indexOf("_Part_") > -1){
						result = result.slice(0, i);
					};
					result = api.decodeQS(result);
				};
			};
		};
		
		_function_return(result);
	};
});