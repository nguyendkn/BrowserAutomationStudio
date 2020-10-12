<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"table", description:tr("Database table"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Table name, for which operation will be applied"), examples:[{code:"table1"},{code:"table2"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"where", description:tr("Filter"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("A set of conditions intended for selecting the records."), examples:[{code:"id = 10"},{code:"id = [[ID]]"},{code:"title = {{title}}"},{code:"name='john' AND balance > 100"},{code:"radius BETWEEN 30 AND 90"},{code:"amount IS NULL"},{code:"id IN (4, 12, 58, 67)"},{code:tr("Empty string"), description:tr("Do not filter records")}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check" style="padding-left:5px">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Parameterize variables and resources in the filter.</label>
</span>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Delete single record from SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
