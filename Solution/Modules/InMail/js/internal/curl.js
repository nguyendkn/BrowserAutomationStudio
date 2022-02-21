_InMail.curl = {	
	cleanup: function(){
		native("curlwrapper", "easycleanup");
	},
	
	request: function(){
		var args = _function_arguments();
		
		native_async("curlwrapper", "easyperform", JSON.stringify(args))!
		
		_function_return(JSON.parse(_result()));
	},
	
	decoder: function(charset, encoding, data){
		encoding = encoding.toLowerCase();
		var resp = JSON.parse(native("curlwrapper", "decoder", JSON.stringify({charset: charset, encoding: encoding, data: data})));
		return resp.result;
	}
};