function Archive_Unpack(){
	var archive_path = Archive_FormatPath(_function_argument("ArchivePath"));
	var destination_path = Archive_FormatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	var list_of_files = _function_argument("ListOfFiles");
	var timeout = _function_argument("Timeout");
	var supported_types = ["zip","rar","7z"];
	
	var archive_info = Archive_GetFileInfo(archive_path, true);
	var archive_type = Archive_GetArchiveType(supported_types, archive_type, archive_info["extension"]);
	
	var destination_path = destination_path ? destination_path : archive_info["directory"];
	Archive_CheckDiskExistence(destination_path);
	var list_of_files = Archive_filesListParse(list_of_files);
	
	VAR_ARCHIVE_UNPACK_PARAMETERS = [archive_path, destination_path, list_of_files];
	
	_if(archive_type=="zip",function(){
		_embedded("UnpackZIP", "Node", "12.18.3", "ARCHIVE_UNPACK_PARAMETERS", timeout)!
	})!
	
	_if(archive_type=="rar",function(){
		_embedded("UnpackRAR", "Node", "12.18.3", "ARCHIVE_UNPACK_PARAMETERS", timeout)!
	})!
	
	_if(archive_type=="7z",function(){
		_call_function(Archive_Fix7zModule,{})!
		_embedded("Unpack7Z", "Node", "12.18.3", "ARCHIVE_UNPACK_PARAMETERS", timeout)!
	})!
};
function Archive_ArchiveFolder(){
	var folder_path = Archive_FormatPath(_function_argument("FolderPath"));
	var destination_path = Archive_FormatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	var timeout = _function_argument("Timeout");
	var supported_types = ["zip","7z"];
	
	var folder_info = Archive_GetFileInfo(folder_path, true);
	var archive_type = Archive_GetArchiveType(supported_types, archive_type, Archive_GetFileInfo(destination_path, false)["extension"]);
	
	var destination_path = destination_path ? destination_path : folder_path + "." + archive_type;
	Archive_CheckDiskExistence(destination_path);
	
	VAR_ARCHIVE_FOLDER_PARAMETERS = [folder_path, destination_path, folder_info["file"]];
	
	_if(archive_type=="zip",function(){
		_embedded("ArchiveFolderZIP", "Node", "12.18.3", "ARCHIVE_FOLDER_PARAMETERS", timeout)!
	})!
	
	_if(archive_type=="7z",function(){
		_call_function(Archive_Fix7zModule,{})!
		_embedded("ArchiveFolder7Z", "Node", "12.18.3", "ARCHIVE_FOLDER_PARAMETERS", timeout)!
	})!
};
function Archive_ArchiveFiles(){
	var destination_path = Archive_FormatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	var file1 = _function_argument("File1");
	var file2 = _function_argument("File2");
	var file3 = _function_argument("File3");
	var list_of_files = _function_argument("ListOfFiles");
	var timeout = _function_argument("Timeout");
	var supported_types = ["zip","7z"];
	
	var archive_type = Archive_GetArchiveType(supported_types, archive_type, Archive_GetFileInfo(destination_path, false)["extension"]);
	Archive_CheckDiskExistence(destination_path);
	
	var list_of_files = Archive_filesListParse(list_of_files).concat([file1, file2, file3].filter(function(e){return e})).map(function(e){
		var path = Archive_FormatPath(e);
		var info = Archive_GetFileInfo(path);
		return {path:path,name:info.file,isFolder:info.isFolder};
	});
	
	if(list_of_files.length<=0){
		fail(_K=="ru" ? ("Файлы требующие архивации не указаны") : ("Files requiring archiving are not specified"));
	};
	
	VAR_ARCHIVE_FILES_PARAMETERS = [list_of_files, destination_path];
	
	_if(archive_type=="zip",function(){
		_embedded("ArchiveFilesZIP", "Node", "12.18.3", "ARCHIVE_FILES_PARAMETERS", timeout)!
	})!
	
	_if(archive_type=="7z",function(){
		_call_function(Archive_Fix7zModule,{})!
		_embedded("ArchiveFiles7Z", "Node", "12.18.3", "ARCHIVE_FILES_PARAMETERS", timeout)!
	})!
};
function Archive_GetFileList(){
	var archive_path = Archive_FormatPath(_function_argument("ArchivePath"));
	var archive_type = _function_argument("ArchiveType");
	var timeout = _function_argument("Timeout");
	var supported_types = ["zip","rar","7z"];
	
	var archive_info = Archive_GetFileInfo(archive_path, true);
	var archive_type = Archive_GetArchiveType(supported_types, archive_type, archive_info["extension"]);
	
	VAR_ARCHIVE_GETFILELIST_PARAMETERS = archive_path;
	
	_if(archive_type=="zip",function(){
		_embedded("GetFileListZIP", "Node", "12.18.3", "ARCHIVE_GETFILELIST_PARAMETERS", timeout)!
	})!
	
	_if(archive_type=="rar",function(){
		_embedded("GetFileListRAR", "Node", "12.18.3", "ARCHIVE_GETFILELIST_PARAMETERS", timeout)!
	})!
	
	_if(archive_type=="7z",function(){
		_call_function(Archive_Fix7zModule,{})!
		_embedded("GetFileList7Z", "Node", "12.18.3", "ARCHIVE_GETFILELIST_PARAMETERS", timeout)!
	})!
	
	_function_return(VAR_ARCHIVE_GETFILELIST_PARAMETERS)
};
function Archive_FormatPath(path){
	return path.split("\\").join("/");
};
function Archive_filesListParse(list){
	return list ? (typeof list=="object" ? list : JSON.parse(list)) : [];
};
function Archive_GetFileInfo(path, exist){
	var file_info = JSON.parse(native("filesystem", "fileinfo", path));
	var file_exists = file_info["exists"];
	var isFolder = file_info["is_directory"];
	var split = path.split("/");
	var file = split.pop();
	var file_directory = split.join("/");
	var split = file.split(".");
	if(isFolder || split.length<=1){
		var file_name = file;
		var file_extension = "";
	}else{
		var file_extension = split.pop();
		var file_name = split.join(".");
	};
	
	if(exist && !file_exists){
		fail(_K=="ru" ? ("Не удалось найти " + (isFolder ? "папку" : "файл") + " " + file + " в директории " + file_directory) : ("Could not find " + (isFolder ? "folder" : "file") + " " + file + " in directory " + file_directory));
	};
	
	return {file: file, name: file_name, extension: file_extension, directory: file_directory, isFolder: isFolder};
};
function Archive_GetArchiveType(supported_types, type, extension){
	if(type=="auto"){
		if(supported_types.indexOf(extension) < 0 || extension.length<=0){
			fail(_K=="ru" ? ("Не удалось определить тип архива") : ("Could not determine archive type"));
		};
		return extension;
	}else{
		if(supported_types.indexOf(type) < 0 || type.length<=0){
			fail(_K=="ru" ? (type + " архивы не поддерживаются") : (type + " archives are not supported"));
		};
		return type;
	};
};
 
function Archive_CheckDiskExistence(path){
	if(path.indexOf(":/") > -1){
		var disk = path.slice(0, 1);
		var disk_exists = JSON.parse(native("filesystem", "fileinfo", disk + ":/"))["exists"];
		if(!disk_exists){
			fail(_K=="ru" ? ("В пути \"" + path + "\" указан не существующий диск \"" + disk + "\"") : ("The path \"" + path + "\" contains a non-existing disk \"" + disk + "\""));
		};
	};
};
function Archive_Fix7zModule(){
	VAR_NODE_REGEXPJS_TEMPLATE = "const LINE_SPLIT = new RegExp(\u0027\u005cn|\u005cr\u005cn|\u005cx08+|\u005cr +\u005cr\u0027)\nconst BODY_PROGRESS = new RegExp(\u0027^ *(\u003cpercent\u003e\u005c\u005cd+)% ?(\u003cfileCount\u003e\u005c\u005cd+)? ?(\u003cfile\u003e.*)$\u0027)\nconst BODY_SYMBOL_FILE = new RegExp(\u0027^(\u003csymbol\u003e[=TU+R.-]) (\u003cfile\u003e.+)$\u0027)\nconst BODY_HASH = new RegExp(\u0027^(\u003chash\u003e\u005c\u005cS+)? +(\u003csize\u003e\u005c\u005cd*) +(\u003cfile\u003e.+)$\u0027)\nconst END_OF_STAGE_HYPHEN = new RegExp(\u0027^(-+ +)+-+$\u0027)\nconst INFOS = new RegExp(\u0027^(\u003cproperty\u003e.+?)(\u003cseparator\u003e( = )|(: +))(\u003cvalue\u003e.+)$\u0027)\nconst INFOS_SPLIT = new RegExp(\u0027, +# \u0027)\nconst ERROR = new RegExp(\u0027(\u003clevel\u003eWARNING|ERROR): (\u003cmessage\u003e.*)(\u005cr\u005cn)?(\u005cn)?\u0027, \u0027i\u0027)\n\nmodule.exports = \u007b\n  LINE_SPLIT,\n  BODY_PROGRESS,\n  BODY_SYMBOL_FILE,\n  BODY_HASH,\n  END_OF_STAGE_HYPHEN,\n  INFOS,\n  INFOS_SPLIT,\n  ERROR\n\u007d"
	_embedded("Fix7zModule", "Node", "12.18.3", "NODE_REGEXPJS_TEMPLATE", 60000)!
};
