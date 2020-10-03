<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"FilePath", description: tr("File path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the excel file."),examples:[{code:"{{excel_file}}"},{code:"C:/test.xlsx"},{code:"C:/Program Files/test1.xlsx"},{code:"C:/Program Files/test2.xlsx"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"SheetIndexOrName", description: tr("Sheet index or name"), default_selector: "int", value_number: 0, min_number:0, max_number:999999, help: {description: tr("Index or sheet name in excel file."),examples:[{code:0, description: tr("First sheet index")}, {code:1, description: tr("Second sheet index")}, {code:tr("Sheet1"), description: tr("First sheet name")}, {code:tr("Sheet2"), description: tr("Second sheet name")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"Data", description: tr("Data"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The data which needs to be written to the specified sheet.") + " " + tr("You can write strings, numbers, booleans and dates to a cell. Numbers and booleans can be specified as a string and they will be automatically converted to the correct type, and dates are perceived only as a javascript date object."),examples:[{code:"[\"A1:B1:C1\",\"A2:B2:C2\",\"A3:B3:C3\"]", description:"CSV list"},{code:"A1:B1:C1\nA2:B2:C2\nA3:B3:C3", description:"CSV string"},{code:"[[\"A1\",\"B1\",\"C1\"],[\"A2\",\"B2\",\"C2\"],[\"A3\",\"B3\",\"C3\"]]", description:"2D list"},{code:tr("Just sample text"), description: tr("String")}, {code:289, description: tr("Integer")}, {code:0.4494634651211913, description: tr("Floating point number")}, {code:true, description: tr("Boolean")}, {code:new Date(), description: tr("Date object")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Write data to sheet in excel file.</div>
	<div class="tr tooltip-paragraph-fold">Old data that falls into the new data area will be overwritten with the new data.</div>
	<div class="tr tooltip-paragraph-fold">Old data that doesn't interact with new one will remain unchanged.</div>
	<div class="tr tooltip-paragraph-fold">This action accepts data in any of three formats: "CSV list", "CSV string", "2D list".</div>
	<div class="tr tooltip-paragraph-fold">CSV list - a list that consists of CSV lines and CSV line consists of cell values separated with ":" symbol. Example: <code>["A1:B1:C1","A2:B2:C2","A3:B3:C3"]</code></div>
	<div class="tooltip-paragraph-fold"><span class="tr">CSV string - this CSV lines separated by a line break, and consisting of cell values separated with ":" symbol. Example: </span><code><br/>A1:B1:C1<br/>A2:B2:C2<br/>A3:B3:C3</code></div>
	<div class="tr tooltip-paragraph-fold">2D list - a list that consists of lists containing the cell values. Example: <code>[["A1","B1","C1"],["A2","B2","C2"],["A3","B3","C3"]]</code></div>
	<div class="tr tooltip-paragraph-fold">Data in a suitable format can be obtained from the actions: "Read sheet", "Read rows", "Read cells range".</div>
	<div class="tr tooltip-paragraph-fold">Data can be generated manually by using "List" module or "Template" action.</div>
	<div class="tr tooltip-paragraph-fold">If a resource is specified in the "File path" parameter, resource location will be used.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<div class="container-fluid back" >
	<div class="col-xs-12">
		<div id="validation"><%= _GobalModel.GetPageInfo() || name %></div>
		<hr style="margin-top:5px;margin-bottom:5px"/>
		<a tabindex="-1" class="btn btn-success standartbutton tr" id="ok">Ok</a>  <a tabindex="-1" class="btn btn-danger standartbutton tr" href="#!/" id="backtomain">Cancel</a>
		<a href="#" tabindex="-1" id="use-waiter" class="trtitle" data-enabled="true" data-toggle="tooltip" data-placement="top" title="Wait until the file will be written, it may take additional time. In case if this option is checked, error will be thrown if file could not be saved."><i class="fa fa-clock-o" aria-hidden="true"></i></a>
		<a href="#" tabindex="-1" id="use-timeout" data-value="<%= (typeof(timeout_value) != "undefined" && timeout_value > 0) ? timeout_value : "0" %>" class="<%= (typeof(timeout_value) != "undefined" && timeout_value > 0) ? "" : "use-timeout-disabled" %> trtitle"  data-enabled="<%= (typeof(timeout_value) != "undefined" && timeout_value > 0) ? "true" : "false" %>" data-toggle="tooltip" data-placement="top" title="Maximum time to perform an action.">
		<i class="fa fa-hourglass-end" aria-hidden="true" ><small id="timeout-is-default" class="tr" <%= (typeof(timeout_value) != "undefined" && timeout_value > 0) ? "style='display:none'" : "" %> >default </small></i><small id="timeout-val"><%= (typeof(timeout_value) != "undefined" && timeout_value > 0) ? ("" + timeout_value) : "" %></small></a>  
		<div class="btn-group" role="group" id="executetype">
			<button tabindex="-1" data-toggle="tooltip" data-placement="top" title="<%= tr("Execute this action and don't save it to script tab.") %>" type="button" class="btn btn-default" data-action="execute"><%= tr("Only Execute") %></button>
			<button tabindex="-1" data-toggle="tooltip" data-placement="top" title="<%= tr("Don't execute this action but save it to script tab.") %>" type="button" class="btn btn-default" data-action="add"><%= tr("Only Add") %></button>
			<button tabindex="-1" data-toggle="tooltip" data-placement="top" title="<%= tr("Execute this action and save it to script tab.") %>" type="button" class="btn btn-info" data-action="executeandadd"><%= tr("Execute And Add") %></button>
		</div>
	</div>
</div>