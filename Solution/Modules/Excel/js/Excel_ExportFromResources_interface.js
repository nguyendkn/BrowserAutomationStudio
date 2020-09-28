<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"FilePath", description: tr("File path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the excel file."),examples:[{code:"{{excel_file}}"},{code:"C:/test.xlsx"},{code:"C:/Program Files/test1.xlsx"},{code:"C:/Program Files/test2.xlsx"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"ResourceList", description: tr("List of resource names"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("List of names of resources, data from which needs be exported to an excel file. As a list, you can use a string consisting of resource names, separated by commas."),examples:[{code:"Res1,res3,res4"},{code:"Res1, res3, res4"},{code:"[\"Res1\", \"res3\", \"res4\"]"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Export data from resources to excel file.</div>
	<div class="tr tooltip-paragraph-fold">This action creates a sheet in excel file from each specified resource. The sheets will be named after the resources. For example, if 3 resources are specified: "Work1", "Work2" and "Work3", then 3 sheets with the same names will be created.</div>
	<div class="tr tooltip-paragraph-fold">Data for each sheet will be obtained from corresponding resource. For example, if resource contains 2 lines: A1:B1 and A2:B2, then sheet will be created with exact same 2 items.</div>
	<div class="tr tooltip-paragraph-fold">If a sheet with the same name already exists, it will be completely overwritten with new data.</div>
	<div class="tr tooltip-paragraph-fold">If a resource is specified in the "File path" parameter, resource location will be used.</div>
	<div class="tr tooltip-paragraph-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
	<div class="tr tooltip-paragraph-last-fold"><code>This is an expensive action and is not intended for frequent use.</code></div>
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