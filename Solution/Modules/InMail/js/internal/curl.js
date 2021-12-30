_InMail.curl = {
	init: function(){
		native("inmailcurl","curl_init");
	},
	
	isInit: function(){
		return JSON.parse(native("inmailcurl","curl_is_init"));
	},
	
	setOptions: function(opts){
		opts = _avoid_nilb(opts, {});
		
		return JSON.parse(native("inmailcurl","curl_set_opts", JSON.stringify(opts)));
	},
	
	request: function(){
		var args = _function_arguments();
		
		native_async("inmailcurl","curl_request", JSON.stringify(args))!
		
		_function_return(JSON.parse(_result()));
	},
	
	cleanup: function(){
		native("inmailcurl","curl_cleanup");
	}
};