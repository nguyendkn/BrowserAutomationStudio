_FTP_PROTOCOL = "";
_FTP_CONFIG = {host:"",port:"",username:"",password:""};

function FTP_Config(protocol, host, port, username, password){
    _FTP_PROTOCOL = protocol;
    _FTP_CONFIG["host"] = host;
    _FTP_CONFIG["port"] = port;
    _FTP_CONFIG["username"] = username || "";
    _FTP_CONFIG["password"] = password || "";

};
function FTP_Download(){
	var file_path = FTP_FormatPath(_function_argument("FilePath"));
	var destination_path = FTP_FormatPath(_function_argument("DestinationPath"));
	var timeout = _function_argument("Timeout");
	
    VAR_FTP_DOWNLOAD_PARAMETERS = [file_path, destination_path, _FTP_CONFIG];
	
	_if(_FTP_PROTOCOL=="SFTP", function(){
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
	
    VAR_FTP_UPLOAD_PARAMETERS = [file_path, destination_path, _FTP_CONFIG];

    _if(_FTP_PROTOCOL=="SFTP", function(){
        _embedded("UploadSFTP", "Node", "8.6.0", "FTP_UPLOAD_PARAMETERS", timeout)!
    })!

    _if(_FTP_PROTOCOL=="FTP", function(){
        _embedded("UploadFTP", "Node", "8.6.0", "FTP_UPLOAD_PARAMETERS", timeout)!
    })!
};
function FTP_FormatPath(path){
	return path.split("\\").join("/");
};