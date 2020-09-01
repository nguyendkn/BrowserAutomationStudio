function Excel_GetSheetsList(){
	var file_path = _function_argument("FilePath");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path];
	
	_embedded("ExcelGetSheetsList", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_AddSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_name = _function_argument("SheetName");
	var sheet_index = _function_argument("SheetIndex");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_name, sheet_index];
	
	_embedded("ExcelAddSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_RenameSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var new_sheet_name = _function_argument("NewSheetName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, new_sheet_name];
	
	_embedded("ExcelRenameSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_MoveSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var new_sheet_index = _function_argument("NewSheetIndex");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, new_sheet_index];
	
	_embedded("ExcelMoveSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_DeleteSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name];
	
	_embedded("ExcelDeleteSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address];
	
	_embedded("ExcelReadCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_WriteToCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, data];
	
	_embedded("ExcelWriteToCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var data_format = _function_argument("DataFormat");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, data_format];
	
	_embedded("ExcelReadSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_WriteToSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, data];
	
	_embedded("ExcelWriteToSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadRows(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_row = _function_argument("FromRow")+1;
	var to_row = _function_argument("ToRow")+1;
	var data_format = _function_argument("DataFormat");
	var timeout = _function_argument("Timeout");
	
	from_row = from_row=="" ? "" : from_row+1;
	to_row = to_row=="" ? "" : to_row+1;
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_row, to_row, data_format];
	
	_embedded("ExcelReadRows", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_InsertRows(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_row = _function_argument("FromRow")+1;
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_row, data];
	
	_embedded("ExcelInsertRows", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_DeleteRows(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_row = _function_argument("FromRow")+1;
	var count = _function_argument("Count");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_row, count];
	
	_embedded("ExcelDeleteRows", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ReadCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = Excel_FormatAddress(_function_argument("FromCell"));
	var to_cell = Excel_FormatAddress(_function_argument("ToCell"));
	var data_format = _function_argument("DataFormat");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell, data_format];
	
	_embedded("ExcelReadCellsRange", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_WriteToCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = Excel_FormatAddress(_function_argument("FromCell"));
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, data];
	
	_embedded("ExcelWriteToCellsRange", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ImportToResources(){
	var file_path = _function_argument("FilePath");
	var sheet_list = _function_argument("SheetList");
	var success_number = _function_argument("SuccessNumber");
	var fail_number = _function_argument("FailNumber");
	var simultaneous_usage = _function_argument("SimultaneousUsage");
	var interval = _function_argument("Interval");
	var greedy = _function_argument("Greedy");
	var dont_give_up = _function_argument("DontGiveUp");
	var timeout = _function_argument("Timeout");

	_call_function(Excel_GetSheetsList,{"FilePath":file_path,"Timeout":timeout})!
	var sheets_list = _result_function();
	
	if(sheet_list){
		sheets_list = sheets_list.filter(function(sheet_name, sheet_index){return sheet_list.indexOf(sheet_name) > -1 || sheet_list.indexOf(sheet_index) > -1});
	};
	
	_do_with_params({"foreach_data":sheets_list},function(){
		var sheet_index = _iterator() - 1;
		if(sheet_index > _cycle_param("foreach_data").length - 1){_break()};
		var sheet_name = _cycle_param("foreach_data")[sheet_index];
		
		_call_function(Excel_ReadSheet,{"FilePath":file_path,"SheetIndexOrName":sheet_name,"DataFormat":"CSV list","Timeout":timeout})!
		var sheet_data = _result_function();

		RCreate(sheet_name, success_number, fail_number, simultaneous_usage, interval, greedy, dont_give_up);

		var res = RMap(sheet_name);

		res.clear();
		res.sync();
		sheet_data.forEach(function(ell){
			res.insert(ell);
		});
		res.sync();
	})!
};
function Excel_ExportFromResources(){
	var file_path = _function_argument("FilePath");
	var resource_list = _function_argument("ResourceList");
	var timeout = _function_argument("Timeout");

	_do_with_params({"foreach_data":resource_list},function(){
		var resource_index = _iterator() - 1;
		if(resource_index > _cycle_param("foreach_data").length - 1){_break()};
		var resource_name = _cycle_param("foreach_data")[resource_index];

		var resource_data = RMap(resource_name).toList();
		
		_call_function(Excel_WriteToSheet,{"FilePath":file_path,"SheetIndexOrName":resource_name,"Data":resource_data,"Timeout":timeout})!
		_result_function();
	})!
};
function Excel_ClearSheet(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name];
	
	_embedded("ExcelClearSheet", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ClearCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address];
	
	_embedded("ExcelClearCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ClearCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = _function_argument("FromCell");
	var to_cell = _function_argument("ToCell");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell];
	
	_embedded("ExcelClearCellsRange", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_ConvertToJSON(){
	var file_path = _function_argument("FilePath");
	var timeout = _function_argument("Timeout");
	
	var sheets = [];

	_call_function(Excel_GetSheetsList,{"FilePath":file_path,"Timeout":timeout})!
	var sheets_list = _result_function();

	_do_with_params({"foreach_data":sheets_list},function(){
		var sheet_index = _iterator() - 1;
		if(sheet_index > _cycle_param("foreach_data").length - 1){_break()};
		var sheet_name = _cycle_param("foreach_data")[sheet_index];
		
		_call_function(Excel_ReadSheet,{"FilePath":file_path,"SheetIndexOrName":sheet_name,"DataFormat":"2D list","Timeout":timeout})!
		var sheet_data = _result_function();

		sheets.push({name:sheet_name,data:sheet_data});
	})!

	_function_return(JSON.stringify({sheets:sheets}));
};
function Excel_ConvertFromJSON(){
	var file_path = _function_argument("FilePath");
	var data = _function_argument("Data");
	var timeout = _function_argument("Timeout");
	
	data = (typeof data=="object") ? data : JSON.parse(data);
	
	var sheets = data.sheets;

	_do_with_params({"foreach_data":sheets},function(){
		var sheet_index = _iterator() - 1;
		if(sheet_index > _cycle_param("foreach_data").length - 1){_break()};
		var sheet = _cycle_param("foreach_data")[sheet_index];

		var sheet_name = sheet.name;
		var sheet_data = sheet.data;

		_call_function(Excel_WriteToSheet,{"FilePath":file_path,"SheetIndexOrName":sheet_name,"Data":sheet_data,"Timeout":timeout})!
		_result_function();
	})!
};
function Excel_FindCells(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var contains = _function_argument("Contains");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, contains];
	
	_embedded("ExcelFindCells", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_FindCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var contains = _function_argument("Contains");
	var timeout = _function_argument("Timeout");
	
	_call_function(Excel_FindCells,{"FilePath":file_path,"SheetIndexOrName":sheet_index_or_name,"Contains":contains,"Timeout":timeout})!
	var cells_list = _result_function();
	
	var cell = cells_list.length==0 ? "" : cells_list[0];
	
	_function_return(cell);
};
function Excel_GetFormulaFromCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address];
	
	_embedded("ExcelGetFormulaFromCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_SetFormulaToCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = Excel_FormatAddress(_function_argument("CellAddress"));
	var formula = _function_argument("Formula");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, formula];
	
	_embedded("ExcelSetFormulaToCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_GetCellStyle(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = _function_argument("CellAddress");
	var style_name = _function_argument("StyleName");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, style_name];
	
	_embedded("ExcelGetCellStyle", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_XLSX_NODE_PARAMETERS);
};
function Excel_GetCellStyles(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = _function_argument("CellAddress");
	var styles_name_list = _function_argument("StylesNameList");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, styles_name_list];
	
	_embedded("ExcelGetCellStyles", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
	
	_function_return(JSON.stringify(VAR_XLSX_NODE_PARAMETERS));
};
function Excel_SetStyleToCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = _function_argument("CellAddress");
	var style_name = _function_argument("StyleName");
	var style_value = _function_argument("StyleValue");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, style_name, style_value];
	
	_embedded("ExcelSetStyleToCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_SetStylesToCell(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var cell_address = _function_argument("CellAddress");
	var styles = _function_argument("Styles");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, cell_address, styles];
	
	_embedded("ExcelSetStylesToCell", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_SetStyleToCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = _function_argument("FromCell");
	var to_cell = _function_argument("ToCell");
	var style_name = _function_argument("StyleName");
	var style_value = _function_argument("StyleValue");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell, style_name, style_value];
	
	_embedded("ExcelSetStyleToCellsRange", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_SetStylesToCellsRange(){
	var file_path = _function_argument("FilePath");
	var sheet_index_or_name = _function_argument("SheetIndexOrName");
	var from_cell = _function_argument("FromCell");
	var to_cell = _function_argument("ToCell");
	var styles = _function_argument("Styles");
	var timeout = _function_argument("Timeout");
	
	VAR_XLSX_NODE_PARAMETERS = [file_path, sheet_index_or_name, from_cell, to_cell, styles];
	
	_embedded("ExcelSetStylesToCellsRange", "Node", "12.18.3", "XLSX_NODE_PARAMETERS", timeout)!
};
function Excel_FormatAddress(address){
	return (address.indexOf("*") > -1) ? (Excel_ConvertToLetter(address.split("*")[0]+1) + address.split("*")[1]+1) : address;
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