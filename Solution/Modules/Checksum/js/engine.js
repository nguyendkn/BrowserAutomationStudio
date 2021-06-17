function Checksum_String(){
	_embedded("Checksum_String", "Node", "12.18.3", "CHECKSUM_NODE_PARAMETERS", Checksum_PrepareArguments(_function_arguments()))!
	
	_function_return(VAR_CHECKSUM_NODE_PARAMETERS);
};
function Checksum_File(){
	_embedded("Checksum_File", "Node", "12.18.3", "CHECKSUM_NODE_PARAMETERS", Checksum_PrepareArguments(_function_arguments()))!
	
	_function_return(VAR_CHECKSUM_NODE_PARAMETERS);
};
function Checksum_GetAlgorithmsList(){
	_embedded("Checksum_GetAlgorithmsList", "Node", "12.18.3", "CHECKSUM_NODE_PARAMETERS", 60000)!
	
	_function_return(VAR_CHECKSUM_NODE_PARAMETERS);
};
function Checksum_PrepareArguments(args){
	var timeout = _avoid_nilb(args.timeout, 60000);
	if(args.hasOwnProperty('timeout')){
		delete args.timeout;
	};
	for(var key in args){
		var arg = args[key];
		if(key !== 'input'){
			arg = key === 'outputLength' ? Number(_avoid_nil(arg, 64)) : _avoid_nil(arg).toString().trim();
			if(['algorithm','inputEncoding','outputEncoding'].indexOf(key) > -1 && _is_nilb(arg)){
				arg = key=='algorithm' ? 'sha512' : (key=='inputEncoding' ? 'utf-8' : 'hex');
			};
			if(key === 'outputEncoding' && _ends_with(arg, ' encoded')){
				arg = arg=='hex encoded' ? 'hex' : 'base64';
			};
			args[key] = arg;
		};
	};
	args.lang = _K;
	VAR_CHECKSUM_NODE_PARAMETERS = args;
	return timeout;
};