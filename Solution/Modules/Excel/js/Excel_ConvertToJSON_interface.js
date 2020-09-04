<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"FilePath", description: tr("File path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the excel file."),examples:[{code:"{{excel_file}}"},{code:"C:/test.xlsx"},{code:"C:/Program Files/test1.xlsx"},{code:"C:/Program Files/test2.xlsx"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description: tr("Variable to save the result"), default_variable: "XLSX_JSON", help: {description: tr("Variable in which, after successful execution of the action, a JSON string will be written."),examples:[{code:"{\"sheets\":[{\"name\":\"S1\",\"data\":[]},{\"name\":\"S2\",\"data\":[]}]}"}]}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert data from excel file to JSON string.</div>
	<div class="tr tooltip-paragraph-fold">The resulting JSON string can be processed using actions from the "JSON" module.</div>
	<div class="tr tooltip-paragraph-fold">If a resource is specified in the "File path" parameter, resource location will be used.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
