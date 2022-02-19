_InMail.pop3 = _InMail.assignApi(function(config){
	const api = this;
	_InMail.baseApi.call(this, true, "pop3", config);
	
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
	
	this.delMessages = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Удалить письмо' : 'Delete message');
	};
	
	this.copyMessages = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Копировать письмо' : 'Copy message');
	};
	
	this.moveMessages = function(){
		api.errorHandler('NOT_AVAILABLE_ON_POP3', _K=="ru" ? 'Переместить письмо' : 'Move message');
	};
});