_FTP_PROTOCOL = "";
_FTP_CONFIG = {host:"",port:"",username:"",password:""};
_FTP_CONNECTION_ID = rand(10);
_FTP_CONNECTION_TIMEOUT = 5*60*1000;

function FTP_Config(protocol, host, port, username, password, timeout){
    _FTP_PROTOCOL = protocol;
    _FTP_CONFIG["host"] = host;
    _FTP_CONFIG["port"] = port;
    _FTP_CONFIG["username"] = username;
	_FTP_CONFIG["user"] = username;
    _FTP_CONFIG["password"] = password;
	_FTP_CONFIG["pass"] = password;
	_FTP_CONNECTION_TIMEOUT = timeout*1000;
};
function FTP_Connection(){
	var module = _function_argument("module");
	VAR_FTP_CONNECTION_PARAMETERS = [_FTP_CONNECTION_ID, _FTP_CONFIG];
	
	_if(module=="SFTP",function(){
		_embedded("ConnectionSFTP", "Node", "8.6.0", "FTP_CONNECTION_PARAMETERS", 60000)!
	})!
	
	_if(module=="FTP",function(){
		_embedded("ConnectionFTP", "Node", "8.6.0", "FTP_CONNECTION_PARAMETERS", 60000)!
	})!
};
function FTP_ReadFile(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var base64 = _function_argument("base64");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, base64, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("ReadFileSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("ReadFileFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_function_return(VAR_FTP_NODE_PARAMETERS);
};
function FTP_WriteFile(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var value = _function_argument("Value");
	var base64 = _function_argument("base64");
	var ending_symbol = _function_argument("EndingSymbol");
	var append = _function_argument("Append");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, (value + (ending_symbol ? "\r\n" : "")), base64, append, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("WriteFileSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("WriteFileFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Download(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var destination_path = FTP_FormatPath(_function_argument("DestinationPath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
    VAR_FTP_NODE_PARAMETERS = [file_path, destination_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH", function(){
        _embedded("DownloadSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("DownloadFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!
};
function FTP_Upload(){
    var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var destination_path = FTP_FormatPath(_function_argument("DestinationPath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
    VAR_FTP_NODE_PARAMETERS = [file_path, destination_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();

    _if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH", function(){
        _embedded("UploadSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("UploadFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!
};
function FTP_CheckExist(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("CheckExistSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("CheckExistFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_function_return(VAR_FTP_NODE_PARAMETERS);
};
function FTP_GetInfo() {
    var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
    VAR_FTP_NODE_PARAMETERS = [file_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();

    _if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH", function(){
        _embedded("GetInfoSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("GetInfoFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!

    _function_return(VAR_FTP_NODE_PARAMETERS);
};
function FTP_Create(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var file_type = _function_argument("isFile") ? "f" : "d";
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, file_type, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("CreateSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("CreateFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Delete(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("DeleteSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("DeleteFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Move(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var new_file_path = FTP_FormatPath(_function_argument("NewFilePath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, new_file_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("MoveSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("MoveFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Copy(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var copy_path = FTP_FormatPath(_function_argument("CopyPath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, copy_path, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("CopySFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("CopyFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Search(){
	var folder_path = FTP_FormatPath(_function_argument("FolderPath"));
	var mask = _function_argument("Mask");
	var recursive = _function_argument("Recursive");
	var search_files = _function_argument("SearchFiles");
	var search_folders = _function_argument("SearchFolders");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [folder_path, mask, recursive, search_files, search_folders, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":(_FTP_PROTOCOL=="FTP" ? "FTP" : "SFTP")})!
	_result_function();
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("SearchSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("SearchFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_function_return(VAR_FTP_NODE_PARAMETERS);
};
function FTP_FileToList(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var timeout = _function_argument("Timeout");
	
	_call_function(FTP_ReadFile,{"FilePath":file_path,"base64":false,"Timeout":timeout})!
	VAR_FTP_NODE_PARAMETERS = _result_function();
	
	_function_return(VAR_FTP_NODE_PARAMETERS.split(/\r?\n/));
};
function FTP_ListToFile(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
    var value = _function_argument("Value").join("\r\n");
    var ending_symbol = _function_argument("EndingSymbol");
    var append = _function_argument("Append");
	var timeout = _function_argument("Timeout");
	
	_call_function(FTP_WriteFile,{"FilePath":file_path,"Value":value,"EndingSymbol":ending_symbol,"base64":false,"Append":append,"Timeout":timeout})!
	_result_function();
};
function FTP_RunCommand(){
	var сommand = _function_argument("Command");
	var timeout = _function_argument("Timeout");
	
	if(_FTP_PROTOCOL!="SSH"){
		fail(_K=="ru" ? ("Выполнить команду можно только через SSH протокол") : ("The command can only be executed via SSH protocol"));
	};
	
	VAR_FTP_NODE_PARAMETERS = [сommand, _FTP_CONNECTION_ID, _FTP_CONNECTION_TIMEOUT];
	
	_call_function(FTP_Connection,{"module":"SSH"})!
	_result_function();
	
	_embedded("RunCommandSSH", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_FTP_NODE_PARAMETERS);
}
function FTP_Close(){
	VAR_FTP_NODE_PARAMETERS = _FTP_CONNECTION_ID;
	_embedded("CloseFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", 60000)!
};
function FTP_CheckProtocol(){
	if(_FTP_PROTOCOL!="SFTP" && _FTP_PROTOCOL!="SSH" && _FTP_PROTOCOL!="FTP"){
		fail(_K=="ru" ? ("Настройка FTP/SSH не выполнена или выполнена неправильно") : ("FTP/SSH configuration failed or incorrect"));
	};
};
function FTP_FormatPath(path){
	return path.split("\\").join("/");
};