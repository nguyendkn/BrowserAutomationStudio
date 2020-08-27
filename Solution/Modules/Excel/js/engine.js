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
function Excel_ReadCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address];
	
	_embedded("ExcelReadCell", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_WriteToCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, data];
	
	_embedded("ExcelWriteToCell", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var data_format = _function_argument("DataFormat");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, data_format];
	
	_embedded("ExcelReadSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_WriteToSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, data];
	
	_embedded("ExcelWriteToSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadRows(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_row = _function_argument("FromRow");
	var to_row = _function_argument("ToRow");
	var data_format = _function_argument("DataFormat");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_row, to_row, data_format];
	
	_embedded("ExcelReadRows", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_InsertRows(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_row = _function_argument("FromRow");
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_row, data];
	
	_embedded("ExcelInsertRows", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_DeleteRows(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_row = _function_argument("FromRow");
	var count = _function_argument("Count");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_row, count];
	
	_embedded("ExcelDeleteRows", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = Excel_FormatAddress(_function_argument("FromCell"));
	var to_cell = Excel_FormatAddress(_function_argument("ToCell"));
	var data_format = _function_argument("DataFormat");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell, data_format];
	
	_embedded("ExcelReadCellsRange", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_WriteToCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = Excel_FormatAddress(_function_argument("FromCell"));
	var to_cell = Excel_FormatAddress(_function_argument("ToCell"));
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell, data];
	
	_embedded("ExcelWriteToCellsRange", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_SyncWithResource(){
	var file_path = _function_argument("FilePath");
	var success_number = _function_argument("SuccessNumber");
	var fail_number = _function_argument("FailNumber");
	var simultaneous_usage = _function_argument("SimultaneousUsage");
	var interval = _function_argument("Interval");
	var greedy = _function_argument("Greedy");
	var dont_give_up = _function_argument("DontGiveUp");
	var timeout = _function_argument("Timeout");

	_call_function(Excel_GetSheetsList,{"FilePath":file_path,"Timeout":timeout})!
	var sheets_list = _result_function();
	
	_do_with_params({"foreach_data":sheets_list},function(){
		var cycle_index = _iterator() - 1;
		if(cycle_index > _cycle_param("foreach_data").length - 1){_break()};
		var sheet = _cycle_param("foreach_data")[cycle_index];
		
		_call_function(Excel_ReadSheet,{"FilePath":file_path,"SheetIndexOrName":sheet,"DataFormat":"CSV list","Timeout":timeout})!
		var sheet_content_list = _result_function();

		RCreate(sheet, success_number, fail_number, simultaneous_usage, interval, greedy, dont_give_up);

		var res = RMap(sheet);

		res.clear();
		res.sync();
		sheet_content_list.forEach(function(ell){
			res.insert(ell);
		});
		res.sync();
	})!
};
function Excel_ClearSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name];
	
	_embedded("ExcelClearSheet", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ClearCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = _function_argument("CellAddress");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address];
	
	_embedded("ExcelClearCell", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ClearCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = _function_argument("FromCell");
	var to_cell = _function_argument("ToCell");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell];
	
	_embedded("ExcelClearCellsRange", "Node", "8.6.0", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_FormatAddress(address){
	return (address.indexOf("*") > -1) ? (Excel_ConvertToLetter(address.split("*")[0]) + address.split("*")[1]) : address;
};
function Excel_ConvertToLetter(column){
    var temp = '';
    var letter = '';
    while(column>0){
        temp = (column-1)%26;
        letter = String.fromCharCode(temp+65)+letter;
        column = (column-temp-1)/26;
    };
    return letter;
};