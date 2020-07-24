function formatPath(path){
	return path.split("\\").join("/");
};
function fileInfoСheck(path, type){
	var split = path.split("/");
	var file = split.pop();
	var file_directory = split.join("/");
	var file_extension = file.split('.')[1];
	
	if(!JSON.parse(native("filesystem", "fileinfo", path))["exists"]){
		fail(_K=="ru" ? ("Не удалось найти файл " + file + " в директории " + file_directory) : ("Could not find file " + file + " in directory " + file_directory));
	};
	
	return {file: file, directory: file_directory, extension: file_extension};
};
function setArchiveType(info, type){
	if(type=="auto"){
		if(["zip","rar","7zip"].indexOf(info["extension"]) < 0){
			fail(_K=="ru" ? ("Не удалось определить тип архива у файла " + info["file"]) : ("Could not determine archive type for " + info["file"] + " file"));
		};
		return info["extension"];
	}else{
		return type;
	};
};
function Archive_Unpack(){
	var archive_path = formatPath(_function_argument("ArchivePath"));
	var destination_path = formatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	var list_of_files = _function_argument("ListOfFiles");
	
	var archive_info = fileInfoСheck(archive_path, archive_type);
	var archive_type = setArchiveType(archive_info, archive_type);
	
	VAR_ARCHIVE_UNPACK_PARAMETERS = [archive_path, destination_path ? destination_path : archive_info["directory"], list_of_files ? (typeof list_of_files=="object" ? list_of_files : JSON.parse(list_of_files)) : ""];
	
	_if(archive_type=="zip",function(){
		_embedded("a4frny5450e", "Node", "8.6.0", "ARCHIVE_UNPACK_PARAMETERS", 60000)!
	})!
};
function Archive_GetFileList(){
	var archive_path = formatPath(_function_argument("ArchivePath"));
	var archive_type = _function_argument("ArchiveType");
	
	var archive_info = fileInfoСheck(archive_path, archive_type);
	var archive_type = setArchiveType(archive_info, archive_type);
	
	VAR_ARCHIVE_ARCHIVE_PATH = archive_path;
	VAR_ARCHIVE_LIST_OF_FILES = [];
	
	_if(archive_type=="zip",function(){
		_embedded("8blehxhq8o7", "Node", "8.6.0", "ARCHIVE_ARCHIVE_PATH,ARCHIVE_LIST_OF_FILES", 60000)!
	})!
	
	_function_return(VAR_ARCHIVE_LIST_OF_FILES)
};