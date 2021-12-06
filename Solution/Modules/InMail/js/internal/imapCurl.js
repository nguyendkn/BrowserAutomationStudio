_InMail.imap = _InMail.assignApi(function(config){
	const api = this;
	_InMail.baseApi.call(this, true, "imap", config);
	
	this.caps = null;

	this.escape = function(str){
		return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
	};
	
	// RFC 4648, section 4 Base64 encoding/decoding.
	this.base64 = {
		table: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode: function(str){
			var padding = str.length % 3;
			var ret = '';
			var position = -1;
			var a = undefined;
			var b = undefined;
			var c = undefined;
			var buffer = undefined;
			// Make sure any padding is handled outside of the loop.
			var length = str.length - padding;
			
			while(++position < length){
				// Read three bytes, i.e. 24 bits.
				a = str.charCodeAt(position) << 16;
				b = str.charCodeAt(++position) << 8;
				c = str.charCodeAt(++position);
				buffer = a + b + c;
				// Turn the 24 bits into four chunks of 6 bits each, and append the
				// matching character for each of them to the ret.
				ret += (this.table.charAt(buffer >> 18 & 0x3F) + this.table.charAt(buffer >> 12 & 0x3F) + this.table.charAt(buffer >> 6 & 0x3F) + this.table.charAt(buffer & 0x3F));
			};
			
			if(padding == 2){
				a = str.charCodeAt(position) << 8;
				b = str.charCodeAt(++position);
				buffer = a + b;
				ret += (this.table.charAt(buffer >> 10) + this.table.charAt((buffer >> 4) & 0x3F) + this.table.charAt((buffer << 2) & 0x3F) + '=');
			}else if(padding == 1){
				buffer = str.charCodeAt(position);
				ret += (this.table.charAt(buffer >> 2) + this.table.charAt((buffer << 4) & 0x3F) + '==');
			};
			
			return ret;
		},
		decode: function(str){
			str = str.replace(/==?$/, '');
			var length = str.length;
			var bitCounter = 0;
			var bitStorage = undefined;
			var buffer = undefined;
			var ret = '';
			var position = -1;
			while(++position < length){
				buffer = this.table.indexOf(str.charAt(position));
				bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer;
				// Unless this is the first of a group of 4 characters…
				if(bitCounter++ % 4){
					// …convert the first 8 bits to a single ASCII character.
					ret += String.fromCharCode(0xFF & bitStorage >> (-2 * bitCounter & 6));
				};
			};
			return ret;
		}
	};
	
	// RFC 3501, section 5.1.3 UTF-7 encoding/decoding.
	this.utf7 = {
		encode: function(str){
			// All printable ASCII chars except for & must be represented by themselves.
			// We replace subsequent non-representable chars with their escape sequence.
			return str.replace(/&/g, '&-').replace(/[^\x20-\x7e]+/g, function(chunk){
				// & is represented by an empty sequence &-, otherwise the encoding is performed.
				if(chunk === '&'){
					chunk = '';
				}else{
					var b = '';
					for(var i = 0; i < chunk.length; i++){
						// Note that we can't simply convert a UTF-8 string to Base64 because
						// UTF-8 uses a different encoding. In modified UTF-7, all characters
						// are represented by their two byte Unicode ID.
						var c = chunk.charCodeAt(i);
						// Upper 8 bits shifted into lower 8 bits so that they fit into 1 byte.
						b += String.fromCharCode(c >> 8);
						// Lower 8 bits. Cut off the upper 8 bits so that they fit into 1 byte.
						b += String.fromCharCode(c & 0xFF);
					};
					// Modified Base64 uses , instead of / and omits trailing =.
					chunk = api.base64.encode(b).replace(/=+$/, '');
					
					chunk = chunk.replace(new RegExp('\\/', 'g'), ',');
				};
				return '&' + chunk + '-';
			});
		},
		
		decode: function(str){
			return str.replace(/&([^-]*)-/g, function(_, chunk){
				// &- represents &.
				if(chunk === ''){
					return '&';
				};
				var b = api.base64.decode(chunk.replace(/,/g, '/'));
				var ret = '';
				for(var i = 0; i < b.length;){
					// Calculate charcode from two adjacent bytes.
					ret += (String.fromCharCode(b.charCodeAt(i++) << 8 | b.charCodeAt(i++)));
				};
				return ret;
			});
		}
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
	
	this.prepareFolder = function(folder, allowBlank){
		folder = allowBlank ? _avoid_nil(folder, api.folder) : _avoid_nilb(folder, api.folder);
		
		_validate_argument_type(folder, 'string', 'Folder name', '_InMail.imap');
		if(!allowBlank && !folder.length){
			api.errorHandler('MAILBOX_NOT_SELECTED');
		};
		
		return folder;
	};
	
	this.parseExpr = function(o, result, start, useBrackets){
		result = _avoid_nilb(result, []);
		start = _avoid_nilb(start, 0);
		useBrackets = _avoid_nilb(useBrackets, true);
		var inQuote = false;
		var lastPos = start - 1;
		var isTop = false;
		var isBody = false;
		var escaping = false;
		var val = undefined;
		
		if(typeof o === 'string'){
			o = {str: o};
			isTop = true;
		};
		
		for(var i = start, len = o.str.length; i < len; ++i){
			if(!inQuote){
				if(isBody){
					if (o.str[i] === ']') {
						val = api.convStr(o.str.substring(lastPos + 1, i + 1));
						result.push(val);
						lastPos = i;
						isBody = false;
					};
				}else if(o.str[i] === '"'){
					inQuote = true;
				}else if (o.str[i] === ' ' || o.str[i] === ')' || (useBrackets && o.str[i] === ']')){
					if(i - (lastPos + 1) > 0){
						val = api.convStr(o.str.substring(lastPos + 1, i));
						result.push(val);
					};
					if((o.str[i] === ')' || (useBrackets && o.str[i] === ']')) && !isTop){
						return i;
					};
					lastPos = i;
				}else if((o.str[i] === '(' || (useBrackets && o.str[i] === '['))){
					if(o.str[i] === '[' && i - 4 >= start && o.str.substring(i - 4, i).toUpperCase() === 'BODY'){
						isBody = true;
						lastPos = i - 5;
					}else{
						var innerResult = [];
						i = api.parseExpr(o, innerResult, i + 1, useBrackets);
						lastPos = i;
						result.push(innerResult);
					};
				};
			}else if(o.str[i] === '\\'){
				escaping = !escaping;
			}else if(o.str[i] === '"'){
				if(!escaping){
					inQuote = false;
				};
				escaping = false;
			};
			if(i + 1 === len && len - (lastPos + 1) > 0){
				result.push(api.convStr(o.str.substring(lastPos + 1)));
			};
		};
		
		return (isTop ? result : start);
	};

	this.convStr = function(str){
		if(str[0] === '"'){
			str = str.substring(1, str.length - 1);
			var newstr = '';
			var isEscaping = false;
			var p = 0;
			for(var i = 0, len = str.length; i < len; ++i){
				if(str[i] === '\\'){
					if(!isEscaping){
						isEscaping = true;
					}else{
						isEscaping = false;
						newstr += str.substring(p, i - 1);
						p = i;
					};
				}else if(str[i] === '"'){
					if(isEscaping){
						isEscaping = false;
						newstr += str.substring(p, i - 1);
						p = i;
					};
				};
			};
			if(p === 0){
				return str;
			}else{
				newstr += str.substring(p);
				return newstr;
			};
		}else if(str === 'NIL'){
			return null;
		}else if(/^\d+$/.test(str)){
			// some IMAP extensions utilize large (64-bit) integers, which JavaScript
			// can't handle natively, so we'll just keep it as a string if it's too big
			var val = parseInt(str, 10);
			return (val.toString() === str ? val : str);
		};

		return str;
	};
	
	this.parser = function(str, boxes){
		var info = api.parseUntagged(str);
		var type = info.type;
		var specialAttrs = [
			'\\All',
			'\\Archive',
			'\\Drafts',
			'\\Flagged',
			'\\Important',
			'\\Junk',
			'\\Sent',
			'\\Trash'
		];
		
		if(type == 'capability'){
			return info.text.map(function(v){return v.toUpperCase()});
		}else if (type == 'sort' || type == 'thread' || type == 'esearch'){
			return info.text;
		}else if(type == 'search'){
			if(typeof info.text.results != "undefined"){
				// CONDSTORE-modified search results
				return info.text.results;
			}else{
				return info.text;
			};
		}else if(type == 'list') {
			var box = {
				attribs: info.text.flags,
				delimiter: info.text.delimiter,
				children: null
			};
			
			for(i = 0, len = specialAttrs.length; i < len; ++i){
				if (box.attribs.indexOf(specialAttrs[i]) > -1){
					box.special_use_attrib = specialAttrs[i];
				};
			};
			
			var name = info.text.name;
			var curChildren = boxes;
			
			if(box.delimiter){
				var path = name.split(box.delimiter);
				name = path.pop();
				for(i = 0, len = path.length; i < len; ++i){
					if(!curChildren[ path[i] ]){
						curChildren[ path[i] ] = {};
					};
					if(!curChildren[ path[i] ].children){
						curChildren[ path[i] ].children = {};
					};
					curChildren = curChildren[ path[i] ].children;
				};
			};
			if(curChildren[name]){
				box.children = curChildren[name].children;
			};
			curChildren[name] = box;
			return;
		}else if(type == 'status'){
			var box = {
				name: info.text.name,
				uidnext: 0,
				uidvalidity: 0,
				messages: {
					total: 0,
					'new': 0,
					unseen: 0
				}
			};
			var attrs = info.text.attrs;
			if(attrs){
				if(typeof attrs.recent != "undefined"){
					box.messages['new'] = attrs.recent;
				};
				if(typeof attrs.unseen != "undefined"){
					box.messages.unseen = attrs.unseen;
				};
				if(typeof attrs.messages != "undefined"){
					box.messages.total = attrs.messages;
				};
				if(typeof attrs.uidnext != "undefined"){
					box.uidnext = attrs.uidnext;
				};
				if(typeof attrs.uidvalidity != "undefined"){
					box.uidvalidity = attrs.uidvalidity;
				};
				if(typeof attrs.highestmodseq != "undefined"){ // CONDSTORE
					box.highestmodseq = ''+attrs.highestmodseq;
				};
			};
			return box;
		}else{
			return info.text;
		};
	};
	
	this.parseUntagged = function(str){
		var m = /^\* (?:(OK|NO|BAD|BYE|FLAGS|ID|LIST|XLIST|LSUB|SEARCH|STATUS|CAPABILITY|NAMESPACE|PREAUTH|SORT|THREAD|ESEARCH|QUOTA|QUOTAROOT)|(\d+) (EXPUNGE|FETCH|RECENT|EXISTS))(?:(?: \[([^\]]+)\])?(?: (.+))?)?$/i.exec(str);
		
		var type, val;
		
		type = (m[1] || m[3]).toLowerCase();
		
		if(type === 'search' || type === 'capability' || type === 'sort'){
			val = api.parse.search(type, m[5]);
		}else if(type === 'thread'){
			val = api.parse.thread(m[5]);
		}else if(type === 'list'){
			val = api.parse.list(m[5]);
		}else if(type === 'status'){
			val = api.parse.status(m[5]);
		}else if(type === 'esearch'){
			val = api.parse.esearch(m[5]);
		}else{
			val = m[5];
		};
		
		return {
			type: type,
			text: val
		};
	};
	
	this.parse = {
		search: function(type, text){
			if(text){
				var regSearchModseq = /^(.+) \(MODSEQ (.+?)\)$/i;
				if(type === 'search' && regSearchModseq.test(text)){
					// CONDSTORE search response
					var p = regSearchModseq.exec(text);
					return {
						results: p[1].split(' '),
						modseq: p[2]
					};
				}else{
					var val = [];
					if(text[0] === '('){
						val = /^\((.*)\)$/.exec(text)[1].split(' ');
					}else{
						val = text.split(' ');
					};
					
					if(type === 'search' || type === 'sort'){
						val = val.map(function(v){return parseInt(v, 10)});
					};
					return val;
				};
			}else{
				return [];
			};
		},
		thread: function(text){
			if(text){
				return api.parseExpr(text);
			}else{
				return [];
			};
		},
		list:  function(text){
			var r = api.parseExpr(text);
			return {
				flags: r[0],
				delimiter: r[1],
				name: api.utf7.decode(''+r[2])
			};
		},
		status:  function(text){
			var r = api.parseExpr(text), attrs = {};
			// r[1] is [KEY1, VAL1, KEY2, VAL2, .... KEYn, VALn]
			for (var i = 0, len = r[1].length; i < len; i += 2){
				attrs[r[1][i].toLowerCase()] = r[1][i + 1];
			};
			return {
				name: api.utf7.decode(''+r[0]),
				attrs: attrs
			};
		},
		esearch:  function(text){
			var r = api.parseExpr(text.toUpperCase().replace('UID', '')), attrs = {};
			
			// RFC4731 unfortunately is lacking on documentation, so we're going to
			// assume that the response text always begins with (TAG "A123") and skip that
			// part ...
			
			for(var i = 1, len = r.length, key, val; i < len; i += 2){
				key = r[i].toLowerCase();
				val = r[i + 1];
				if(key === 'all'){
					val = val.toString().split(',');
				};
				attrs[key] = val;
			};
			return attrs;
		}
	};
	
	this.makeRequest = function(){
		var path = _function_argument("path");
		var query = _function_argument("query");
		var isUTF8 = _avoid_nilb(_function_argument("isUTF8"), false);
		var multiple = _avoid_nilb(_function_argument("multiple"), false);
		var saveOnlyLast = _avoid_nilb(_function_argument("saveOnlyLast"), false);
		var folder = api.prepareFolder(_function_argument("folder"), true);
		
		if(isUTF8){
			query = 'ENABLE UTF8=ACCEPT\r\nSELECT "' + api.escape(api.utf7.encode(folder)) + '"\r\n' + query;
		}else{
			path = _avoid_nil(path, folder);
		};
		
		_call_function(api.request, {path: path, query: query, multiple: (multiple || isUTF8), saveOnlyLast: (saveOnlyLast || isUTF8)})!
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
	
	this.prepareUIDs = function(uids){
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
		
		return uids.join(',');
	};
	
	this.prepareCriteria = function(criteria){
		_validate_argument_type(criteria, ['array','string'], 'Search criteria', '_InMail.imap');
		if(typeof criteria === 'string'){
			criteria = [criteria];
		};
		return criteria;
	};
	
	this.status = function(){
		var name = _function_argument("name");
		
		var info = [ 'MESSAGES', 'RECENT', 'UNSEEN', 'UIDVALIDITY', 'UIDNEXT' ];
		
		if(api.serverSupports('CONDSTORE')){
			info.push('HIGHESTMODSEQ');
		};
		
		info = info.join(' ');
		
		var cmd = 'STATUS "' + escape(api.utf7.encode(''+name)) + '" (' + info + ')';
		
		_call_function(api.makeRequest, {query: cmd, folder: ""})!
		var resp = _result_function();
		
		var result = api.parser(resp);
		
		_function_return(result);
	};
	
	this.getBoxes = function(){
		_call_function(api.makeRequest, {query: "", folder: ""})!
		var resp = _result_function();
		
		var boxes = {};
		var lines = resp.split('\r\n');
		
		for(var i = 0; i < lines.length; i++){
			api.parser(lines[i], boxes);
		};
		
		_function_return(boxes);
	};
	
	this.addBox = function(){
		var name = _function_argument("name");
		
		_call_function(api.makeRequest, {query: 'CREATE "' + api.escape(api.utf7.encode(''+name)) + '"', folder: ""})!
	};
	
	this.delBox = function(){
		var name = _function_argument("name");
		
		_call_function(api.makeRequest, {query: 'DELETE "' + api.escape(api.utf7.encode(''+name)) + '"', folder: ""})!
	};
	
	this.renameBox = function(){
		var oldName = _function_argument("oldName");
		var newName = _function_argument("newName");
		
		_call_function(api.makeRequest, {query: 'RENAME "' + api.escape(api.utf7.encode(''+oldName)) + '" "' + api.escape(api.utf7.encode(''+newName)) + '"', folder: ""})!
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
	
	this.search = function(){
		var criteria = api.prepareCriteria(_function_argument("criteria"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
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
		
		var result = api.parser(resp);
		
		_function_return(result);
	};
	
	this.esearch = function(){
		var criteria = api.prepareCriteria(_function_argument("criteria"));
		var options = _avoid_nil(_function_argument("options"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
		_validate_argument_type(options, ['array','string'], 'Options', '_InMail.imap');
		
		_call_function(api.capability, {})!
		
		if(!api.serverSupports('ESEARCH')){
			api.errorHandler('ESEARCH_NOT_SUPPORT');
		};
		
		if(Array.isArray(options)){
			options = options.join(' ');
		};
		
		var cmd = 'UID SEARCH RETURN (' + options + ')';
		var info = {
			hasUTF8: false
		};
		
		var query = api.buildSearchQuery(criteria, info);
		
		if(info.hasUTF8){
			cmd += ' CHARSET UTF-8';
		};
		
		cmd += query;
		
		_call_function(api.makeRequest, {query: cmd, folder: folder, isUTF8: info.hasUTF8})!
		var resp = _result_function();
		
		var result = api.parser(resp);
		
		_function_return(result);
	};
	
	this.searchLast = function(){
		var args = _function_arguments();
		args.criteria = ['ALL'];
		var last = 0;
		
		_call_function(api.capability, {})!
		
		_if_else(api.serverSupports('ESEARCH'), function(){
			args.options = 'MAX';
			_call_function(api.esearch, args)!
			last = _result_function().max || 0;
		}, function(){
			_call_function(api.search, args)!
			last = _result_function().pop() || 0;
		})!;
		
		_function_return(last);
	};
	
	this.count = function(){
		var args = _function_arguments();
		var count = 0;
		
		_call_function(api.capability, {})!
		
		_if_else(api.serverSupports('ESEARCH'), function(){
			args.options = 'COUNT';
			_call_function(api.esearch, args)!
			count = _result_function().count;
		}, function(){
			_call_function(api.search, args)!
			count = _result_function().length;
		})!;
		
		_function_return(count);
	};
	
	this.sort = function(){
		var sorts = _function_argument("sorts");
		var criteria = api.prepareCriteria(_function_argument("criteria"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
		_validate_argument_type(sorts, ['array','string'], 'Sorting criteria', '_InMail.imap');
		if(typeof sorts === 'string'){
			sorts = [sorts];
		};
		if(!sorts.length){
			api.errorHandler('EMPTY_SORT_CRITERIA');
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
		
		var result = api.parser(resp);
		
		_function_return(result);
	};
	
	this.store = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var config = _function_argument("config");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		var act = '_InMail.imap.store';
		_validate_argument_type(config, 'object', 'Config', act);
		if(_is_nilb(config.flags) && _is_nilb(config.keywords)){
			api.errorHandler('NOT_FLAGS_KEYWORDS');
		};
		
		var isFlags = !_is_nilb(config.flags);
		var items = (isFlags ? config.flags : config.keywords);
		
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
	
	this.delMsgs = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
		var cmd = 'UID STORE ' + uids + ' +FLAGS.SILENT (\\Deleted)\r\nEXPUNGE';
		
		_call_function(api.makeRequest, {query: cmd, folder: folder, multiple: true})!
		var resp = _result_function();
	};
	
	this.fetch = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var options = _function_argument("options");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		var act = '_InMail.imap.fetch';
		if(options){
			_validate_argument_type(options, 'object', 'Options', act);
		};
		
		_call_function(api.capability, {})!
		
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