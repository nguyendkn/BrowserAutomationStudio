<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"FilePath", description: tr("File path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the excel file where needs to export data from resources."),examples:[{code:"C:/test.xlsx"},{code:"C:/Program Files/test1.xlsx"},{code:"C:/Program Files/test2.xlsx"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"ResourceList", description: tr("List of resource names"), default_selector: "expression", disable_int:true, value_string: "", help: {description: tr("List of names of resources, data from which needs be exported to an excel file."),examples:[{code:"[\"Res1\", \"res3\", \"res4\"]"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Export data from resources to excel file.</div>
	<div class="tr tooltip-paragraph-fold">This action creates a sheet in an excel file from each specified resource, having the name of the resource and its contents.</div>
	<div class="tr tooltip-paragraph-fold">If a resource is specified in the "File path" parameter, resource location will be used.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
