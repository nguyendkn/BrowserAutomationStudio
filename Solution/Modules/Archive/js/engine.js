function Archive_Unpack(){
	var archive_path = _function_argument("ArchivePath");
	var destination_folder = _function_argument("DestinationFolder");
	
	var split = archive_path.split(/[\\]|[\/]/);
	var archive = split.pop();
	var archive_directory = split.join("/");
	var archive_extension = archive.split('.')[1];
	
	if(!JSON.parse(native("filesystem", "fileinfo", archive_path))["exists"]){
		fail(_K=="ru" ? ("Не удалось найти файл " + archive + " в папке " + archive_directory) : ("Could not find file " + archive + " in directory " + archive_directory));
	};
	if(archive_extension!="zip"){
		fail(_K=="ru" ? ("Файл " + archive + " не является zip архивом") : ("File " + archive + " is not a zip archive"));
	};
	if(!destination_folder){
		destination_folder = archive_directory;
	};
	
	VAR_UNZIP_PARAMETERS = [archive_path, destination_folder];
	
	_embedded("n62iapvr2dg", "Node", "8.6.0", "UNZIP_PARAMETERS", 60000)!
}