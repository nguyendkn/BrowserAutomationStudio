_InMail.imap = _InMail.assignApi(function(autoConfig, host, port, encrypt, username, password, folder){
	const api = this;
	_InMail.baseApi.call(this, false, "imap", autoConfig, host, port, encrypt, username, password, folder);
});