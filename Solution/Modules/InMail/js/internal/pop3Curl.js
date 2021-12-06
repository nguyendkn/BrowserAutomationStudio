_InMail.pop3 = _InMail.assignApi(function(config){
	const api = this;
	_InMail.baseApi.call(this, true, "pop3", config);
});