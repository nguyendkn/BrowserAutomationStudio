function Excel_GetSheetsList(){
	var file_path = _function_argument("FilePath");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path];
	
	_embedded("ExcelGetSheetsList", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_AddSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_name = _function_argument("SheetName");
	var sheet_index = _function_argument("SheetIndex");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_name, sheet_index];
	
	_embedded("ExcelAddSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_RenameSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var new_sheet_name = _function_argument("NewSheetName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, new_sheet_name];
	
	_embedded("ExcelRenameSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_MoveSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var new_sheet_index = _function_argument("NewSheetIndex");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, new_sheet_index];
	
	_embedded("ExcelMoveSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_DeleteSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name];
	
	_embedded("ExcelDeleteSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};