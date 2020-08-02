_FTP_PROTOCOL = "";
_FTP_CONFIG = {host:"",port:"",username:"",password:""};

function FTP_Config(protocol, host, port, username, password){
    _FTP_PROTOCOL = protocol;
    _FTP_CONFIG["host"] = host;
    _FTP_CONFIG["port"] = port;
    _FTP_CONFIG["username"] = username;
    _FTP_CONFIG["password"] = password;
};
function FTP_CheckExist(){
	var file_path = _function_argument("FilePath");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, _FTP_CONFIG];
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("CheckExistSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("CheckExistFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_function_return(VAR_FTP_NODE_PARAMETERS);
};
function FTP_GetInfo() {
    var file_path = _function_argument("FilePath");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
    VAR_FTP_NODE_PARAMETERS = [file_path, _FTP_CONFIG];

    _if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH", function(){
        _embedded("GetInfoSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("GetInfoFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
    })!

    _function_return(VAR_FTP_NODE_PARAMETERS);
};
function FTP_Delete(){
	var file_path = _function_argument("FilePath");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, _FTP_CONFIG];
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("DeleteSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("DeleteFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Move(){
	var file_path = _function_argument("FilePath");
	var new_file_path = _function_argument("NewFilePath");
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
	VAR_FTP_NODE_PARAMETERS = [file_path, new_file_path, _FTP_CONFIG];
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH",function(){
		_embedded("MoveSFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
	
	_if(_FTP_PROTOCOL=="FTP",function(){
		_embedded("MoveFTP", "Node", "8.6.0", "FTP_NODE_PARAMETERS", timeout)!
	})!
};
function FTP_Download(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var destination_path = FTP_FormatPath(_function_argument("DestinationPath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
    VAR_FTP_DOWNLOAD_PARAMETERS = [file_path, destination_path, _FTP_CONFIG];
	
	_if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH", function(){
        _embedded("DownloadSFTP", "Node", "8.6.0", "FTP_DOWNLOAD_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("DownloadFTP", "Node", "8.6.0", "FTP_DOWNLOAD_PARAMETERS", timeout)!
    })!
};
function FTP_Upload(){
    var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var destination_path = FTP_FormatPath(_function_argument("DestinationPath"));
	var timeout = _function_argument("Timeout");
	
	FTP_CheckProtocol();
    VAR_FTP_UPLOAD_PARAMETERS = [file_path, destination_path, _FTP_CONFIG];

    _if(_FTP_PROTOCOL=="SFTP" || _FTP_PROTOCOL=="SSH", function(){
        _embedded("UploadSFTP", "Node", "8.6.0", "FTP_UPLOAD_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("UploadFTP", "Node", "8.6.0", "FTP_UPLOAD_PARAMETERS", timeout)!
    })!
};
function FTP_CheckProtocol(){
	if(_FTP_PROTOCOL!="SFTP" && _FTP_PROTOCOL!="SSH" && _FTP_PROTOCOL!="FTP"){
		fail(_K=="ru" ? ("Настройка FTP/SSH не выполнена или выполнена неправильно") : ("FTP/SSH configuration failed or incorrect"));
	};
};
function FTP_FormatPath(path){
	return path.split("\\").join("/");
};