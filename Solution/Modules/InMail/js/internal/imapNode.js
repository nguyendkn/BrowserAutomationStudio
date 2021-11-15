_InMail.imap = _InMail.assignApi(function(autoConfig, host, port, encrypt, username, password, folder, timeout){
	const api = this;
	_InMail.baseApi.call(this, false, "imap", autoConfig, host, port, encrypt, username, password, folder, timeout);
	
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
		
		VAR_INMAIL_NODE_PARAMETERS = {options: {config: api.config, folder: api.folder}, criteria: criteria, folder: folder, timeout: api.timeout};
		
		_embedded("InMail_Search", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
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
		
		VAR_INMAIL_NODE_PARAMETERS = {options: {config: api.config, folder: api.folder}, sorts: sorts, criteria: criteria, folder: folder, timeout: api.timeout};
		
		_embedded("InMail_Sort", "Node", "12.18.3", "INMAIL_NODE_PARAMETERS", 60000)!
		
		_function_return(VAR_INMAIL_NODE_PARAMETERS);
	};
});