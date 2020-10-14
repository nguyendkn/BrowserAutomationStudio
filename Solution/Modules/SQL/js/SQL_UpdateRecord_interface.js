<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"table", description:tr("Database table"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Table name, for which operation will be applied"), examples:[{code:"table1"},{code:"table2"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"where", description:tr("Filter"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("A set of conditions intended for selecting the records."), examples:[{code:"id = 10"},{code:"id = [[ID]]"},{code:"title = {{title}}"},{code:"name='john' AND balance > 100"},{code:"radius BETWEEN 30 AND 90"},{code:"amount IS NULL"},{code:"id IN (4, 12, 58, 67)"},{code:tr("Empty string"), description:tr("Do not filter records")}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check" style="padding-left:5px">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Parameterize variables and resources in the filter.</label> <i class="fa fa-question-circle help-input trtitle" data-toggle="tooltip" title="Data from variables and resources will be escaped according to their type and used SQL dialect"></i>
</span>
<%= _.template($('#input_constructor').html())({id:"values", description:tr("Values"), default_selector: "string", disable_int:true, disable_editor:true, disable_string:true, use_textarea:true, size: 8, disable_type_chooser:true, textarea_height:80, help: {description: tr("Field names and values separated by \"=\", each field on a new line.")} }) %>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"fields", description:tr("List of fields"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("List of field names that can be updated. Can be used as a constraint to avoid accidentally updating unnecessary fields.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas."),examples:[{code:"id,title,url,amount"},{code:"id, title, url, amount"},{code:"[\"id\", \"title\", \"url\", \"amount\"]"},{code:tr("Empty string"), description:tr("Update all fields")}]} }) %>
<%= _.template($('#block_end').html())() %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Update single record from SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
