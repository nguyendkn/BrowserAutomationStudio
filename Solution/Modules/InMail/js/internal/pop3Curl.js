_InMail.pop3 = _InMail.assignApi(function(autoConfig, host, port, encrypt, username, password, folder, timeout){
	const api = this;
	_InMail.baseApi.call(this, true, "pop3", autoConfig, host, port, encrypt, username, password, folder, timeout);
});