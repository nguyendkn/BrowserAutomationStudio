_InMail.imap = _InMail.assignApi(function(config){
	const api = this;
	_InMail.baseApi.call(this, false, "imap", config);
	
	this.getConnect = function(){
		return {
			config: api.config,
			timeout: api.timeout,
			folder: api.folder,
			debug: _InMail.debug
		};
	};
	
	this.setProxy = function(proxy){
		
	};
	
	this.clearProxy = function(){
		
	};
	
	this.prepareFolder = function(folder, allowBlank){
		folder = allowBlank ? _avoid_nil(folder, api.folder) : _avoid_nilb(folder, api.folder);
		
		_validate_argument_type(folder, 'string', 'Folder name', '_InMail.imap');
		if(!folder.length){
			api.errorHandler('MAILBOX_NOT_SELECTED');
		};
		
		return folder;
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
		
		VAR_INMAIL_NODE_PARAMETERS = {name: name, connect: api.getConnect()};
		
		_embedded("InMail_Status", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
	
	this.getBoxes = function(){
		VAR_INMAIL_NODE_PARAMETERS = {connect: api.getConnect()};
		
		_embedded("InMail_GetBoxes", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
	
	this.addBox = function(){
		var name = _function_argument("name");
		
		VAR_INMAIL_NODE_PARAMETERS = {name: name, connect: api.getConnect()};
		
		_embedded("InMail_AddBox", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.delBox = function(){
		var name = _function_argument("name");
		
		VAR_INMAIL_NODE_PARAMETERS = {name: name, connect: api.getConnect()};
		
		_embedded("InMail_DelBox", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.renameBox = function(){
		var oldName = _function_argument("oldName");
		var newName = _function_argument("newName");
		
		VAR_INMAIL_NODE_PARAMETERS = {oldName: oldName, newName: newName, connect: api.getConnect()};
		
		_embedded("InMail_RenameBox", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.search = function(){
		var criteria = api.prepareCriteria(_function_argument("criteria"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {criteria: criteria, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_Search", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
	
	this.esearch = function(){
		var criteria = api.prepareCriteria(_function_argument("criteria"));
		var options = _function_argument("options");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		_validate_argument_type(options, ['array','string'], 'Options', '_InMail.imap');
		
		VAR_INMAIL_NODE_PARAMETERS = {criteria: criteria, options: options, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_Esearch", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
	
	this.searchLast = function(){
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_SearchLast", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
	
	this.count = function(){
		var criteria = api.prepareCriteria(_function_argument("criteria"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {criteria: criteria, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_Count", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
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
		
		VAR_INMAIL_NODE_PARAMETERS = {sorts: sorts, criteria: criteria, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_Sort", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
	
	this.addFlags = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var flags = _function_argument("flags");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, flags: flags, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_AddFlags", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.delFlags = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var flags = _function_argument("flags");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, flags: flags, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_DelFlags", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.setFlags = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var flags = _function_argument("flags");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, flags: flags, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_SetFlags", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.addKeywords = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var keywords = _function_argument("keywords");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, keywords: keywords, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_AddKeywords", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.delKeywords = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var keywords = _function_argument("keywords");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, keywords: keywords, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_DelKeywords", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.setKeywords = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var keywords = _function_argument("keywords");
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, keywords: keywords, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_SetKeywords", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
	
	this.delMsgs = function(){
		var uids = api.prepareUIDs(_function_argument("uids"));
		var folder = api.prepareFolder(_function_argument("folder"));
		
		VAR_INMAIL_NODE_PARAMETERS = {uids: uids, folder: folder, connect: api.getConnect()};
		
		_embedded("InMail_DelMsgs", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
	};
});