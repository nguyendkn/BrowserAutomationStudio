<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"FilePath", description: tr("File path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the excel file."),examples:[{code:"{{excel_file}}"},{code:"C:/test.xlsx"},{code:"C:/Program Files/test1.xlsx"},{code:"C:/Program Files/test2.xlsx"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"SheetIndexOrName", description: tr("Sheet index or name"), default_selector: "int", value_number: 0, min_number:0, max_number:999999, help: {description: tr("Index or sheet name in excel file."),examples:[{code:0, description: tr("First sheet index")}, {code:1, description: tr("Second sheet index")}, {code:tr("Sheet1"), description: tr("First sheet name")}, {code:tr("Sheet2"), description: tr("Second sheet name")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"FromRow", description: tr("From row") + ". " + tr("Can be blank"), default_selector: "int", disable_string:true, value_number: "", min_number:-1, max_number:999999, help: {description: tr("Row index from which inserting starts."),examples:[{code:-1, description:tr("Insert at the end of the sheet")},{code:0, description:tr("First row")},{code:1, description:tr("Second row")},{code:tr("Empty string"), description: tr("Insert at the end of the sheet")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"Data", description: tr("Data"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The rows data which needs to be inserted."),examples:[{code:"[\"A1:B1:C1\",\"A2:B2:C2\",\"A3:B3:C3\"]", description:"CSV list"},{code:"A1:B1:C1\nA2:B2:C2\nA3:B3:C3", description:"CSV string"},{code:"[[\"A1\",\"B1\",\"C1\"],[\"A2\",\"B2\",\"C2\"],[\"A3\",\"B3\",\"C3\"]]", description:"2D list"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Insert rows in specified excel file.</div>
	<div class="tr tooltip-paragraph-fold">To insert lines at the end of the sheet, use index <code>-1</code> in the "From row" parameter, or leave it blank.</div>
	<div class="tr tooltip-paragraph-fold">Rows that are in the new rows insertion zone will be shifted down.</div>
	<div class="tr tooltip-paragraph-fold">This action accepts data in any of three formats: "CSV list", "CSV string", "2D list".</div>
	<div class="tr tooltip-paragraph-fold">CSV list - a list that consists of CSV lines and CSV line consists of cell values separated with ":" symbol. Example: <code>["A1:B1:C1","A2:B2:C2","A3:B3:C3"]</code></div>
	<div class="tooltip-paragraph-fold"><span class="tr">CSV string - this CSV lines separated by a line break, and consisting of cell values separated with ":" symbol. Example: </span><code>A1:B1:C1<br/>A2:B2:C2<br/>A3:B3:C3</code></div>
	<div class="tr tooltip-paragraph-fold">2D list - a list that consists of lists containing the cell values. Example: <code>[["A1","B1","C1"],["A2","B2","C2"],["A3","B3","C3"]]</code></div>
	<div class="tr tooltip-paragraph-fold">Data in a suitable format can be obtained from the actions: "Read sheet", "Read rows", "Read cells range".</div>
	<div class="tr tooltip-paragraph-fold">Data can be generated manually by using "List" module or "Template" action.</div>
	<div class="tr tooltip-paragraph-fold">If a resource is specified in the "File path" parameter, resource location will be used.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>