<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"table", description:tr("Database table"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Table name, for which operation will be applied"), examples:[{code:"table"},{code:"users"},{code:"accounts"},{code:"materials"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"where", description:tr("Filter") + ". " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("A set of conditions intended for selecting the records."), examples:[{code:"id = 10",description:tr("id equals 10")},{code:"id = [[ID]]",description:tr("id is equal to the value from the variable [[ID]]")},{code:"title = {{title}}",description:tr("title is equal to the value from the resource {{title}}")},{code:"name='john' AND balance > 100",description:tr("name is equal to john and balance is more than one hundred")},{code:"radius BETWEEN 30 AND 90",description:tr("radius from 30 to 90")},{code:"amount IS NULL",description:tr("amount field is empty")},{code:"id IN (4, 12, 58, 67)",description:tr("id is equal to a value from the list 4, 12, 58, 67")},{code:"id IN ([[ID_LIST]])",description:tr("id is equal to the value from the list in the [[ID_LIST]] variable")},{code:tr("Empty string"),description:tr("Do not filter records")}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check" style="padding-left:5px">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Parameterize variables and resources in the filter.</label> <i class="fa fa-question-circle help-input trtitle" data-toggle="tooltip" title="Data from variables and resources will be escaped according to their type and used SQL dialect"></i>
</span>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"limit", description:tr("Limit"), default_selector: "int", disable_string:true, value_number: "", min_number:0, max_number:999999, help: {description: tr("Limiting the number of records to be deleted."),examples:[{code:tr("Empty string"), description:tr("Delete all records matching filters")}]} }) %>
<%= _.template($('#block_end').html())() %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Delete multiple records from SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
