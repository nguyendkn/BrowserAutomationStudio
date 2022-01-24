_InMail.curl = {
	init: function(){
		native("inmailcurl", "curl_init");
	},
	
	isInit: function(){
		return (native("inmailcurl", "curl_is_init") === "true");
	},
	
	setOptions: function(opts){
		opts = _avoid_nilb(opts, {});
		
		return JSON.parse(native("inmailcurl", "curl_set_opts", JSON.stringify(opts)));
	},
	
	clearTimeout: function(){
		native("inmailcurl", "curl_clear_timeout");
	},
	
	request: function(){
		var args = _function_arguments();
		
		native_async("inmailcurl", "curl_request", JSON.stringify(args))!
		
		_function_return(JSON.parse(_result()));
	},
	
	cleanup: function(){
		native("inmailcurl", "curl_cleanup");
	},
	
	decoder: function(charset, encoding, data){
		encoding = encoding.toLowerCase();
		var resp = JSON.parse(native("inmailcurl", "decoder", JSON.stringify({charset: charset, encoding: encoding, data: data})));
		return resp.result;
	}
};