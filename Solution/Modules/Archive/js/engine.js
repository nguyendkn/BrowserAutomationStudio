function Archive_Unpack(){
	var archive_path = formatPath(_function_argument("ArchivePath"));
	var destination_path = formatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	var list_of_files = _function_argument("ListOfFiles");
	
	var archive_info = getFileInfo(archive_path, true);
	var archive_type = getArchiveType(archive_type, archive_info["extension"]);
	
	var destination_path = destination_path ? destination_path : archive_info["directory"];
	checkDiskExistence(destination_path);
	var list_of_files = filesListParse(list_of_files);
	
	VAR_ARCHIVE_UNPACK_PARAMETERS = [archive_path, destination_path, list_of_files];
	
	_if(archive_type=="zip",function(){
		_embedded("Unpack", "Node", "8.6.0", "ARCHIVE_UNPACK_PARAMETERS", 60000)!
	})!
};
function Archive_ArchiveFolder(){
	var folder_path = formatPath(_function_argument("FolderPath"));
	var destination_path = formatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	
	var folder_info = getFileInfo(folder_path, true);
	var archive_type = getArchiveType(archive_type, getFileInfo(destination_path, false)["extension"]);
	
	var destination_path = destination_path ? destination_path : folder_path + "." + archive_type;
	checkDiskExistence(destination_path);
	
	VAR_ARCHIVE_FOLDER_PARAMETERS = [folder_path, destination_path, folder_info["file"]];
	
	_if(archive_type=="zip",function(){
		_embedded("ArchiveFolder", "Node", "8.6.0", "ARCHIVE_FOLDER_PARAMETERS", 60000)!
	})!
};
function Archive_ArchiveFiles(){
	var destination_path = formatPath(_function_argument("DestinationPath"));
	var archive_type = _function_argument("ArchiveType");
	var file1 = _function_argument("File1");
	var file2 = _function_argument("File2");
	var file3 = _function_argument("File3");
	var list_of_files = _function_argument("ListOfFiles");
	
	var archive_type = getArchiveType(archive_type, getFileInfo(destination_path, false)["extension"]);
	checkDiskExistence(destination_path);
	
	var list_of_files = filesListParse(list_of_files).concat([file1, file2, file3].filter(function(e){return e})).map(function(e){
		var path = formatPath(e);
		var info = getFileInfo(path);
		return {path:path,name:info.file,isFolder:info.isFolder};
	});
	
	if(list_of_files.length<=0){
		fail(_K=="ru" ? ("Файлы требующие архивации не указаны") : ("Files requiring archiving are not specified"));
	};
	
	VAR_ARCHIVE_FILES_PARAMETERS = [list_of_files, destination_path];
	
	_if(archive_type=="zip",function(){
		_embedded("ArchiveFiles", "Node", "8.6.0", "ARCHIVE_FILES_PARAMETERS", 60000)!
	})!
};
function Archive_GetFileList(){
	var archive_path = formatPath(_function_argument("ArchivePath"));
	var archive_type = _function_argument("ArchiveType");
	
	var archive_info = getFileInfo(archive_path, true);
	var archive_type = getArchiveType(archive_type, archive_info["extension"]);
	
	VAR_ARCHIVE_GETFILELIST_PARAMETERS = archive_path;
	
	_if(archive_type=="zip",function(){
		_embedded("GetFileList", "Node", "8.6.0", "ARCHIVE_GETFILELIST_PARAMETERS", 60000)!
	})!
	
	_function_return(VAR_ARCHIVE_GETFILELIST_PARAMETERS)
};
function formatPath(path){
	return path.split("\\").join("/");
};
function filesListParse(list){
	return list ? (typeof list=="object" ? list : JSON.parse(list)) : [];
};
function getFileInfo(path, exist){
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
function getArchiveType(type, extension){
	var supported_types = ["zip","rar","7z"];
	if(type=="auto"){
		if(supported_types.indexOf(extension) < 0 || extension.length<=0){
			fail(_K=="ru" ? ("Не удалось определить тип архива") : ("Could not determine archive type"));
		};
		return extension;
	}else{
		if(supported_types.indexOf(type) < 0 || type.length<=0){
			fail(_K=="ru" ? ("Поддерживаются только zip, rar и 7z архивы") : ("Only zip, rar and 7z archives are supported"));
		};
		return type;
	};
};
 
function checkDiskExistence(path){
	if(path.indexOf(":/") > -1){
		var disk = path.slice(0, 1);
		var disk_exists = JSON.parse(native("filesystem", "fileinfo", disk + ":/"))["exists"];
		if(!disk_exists){
			fail(_K=="ru" ? ("В пути \"" + path + "\" указан не существующий диск \"" + disk + "\"") : ("The path \"" + path + "\" contains a non-existing disk \"" + disk + "\""));
		};
	};
};