<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"table", description:tr("Database table"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Table name, for which operation will be applied"), examples:[{code:"table1"},{code:"table2"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"fields", description:tr("List of fields") + ". " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("List of field names to be inserted. Can be used as a constraint to avoid accidentally inserting unnecessary fields.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas."),examples:[{code:"id,title,url,amount"},{code:"id, title, url, amount"},{code:"[\"id\", \"title\", \"url\", \"amount\"]"},{code:tr("Empty string"), description:tr("Insert all fields, the order of the fields matches the database")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"data", description:tr("Records"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The records to be inserted into the database."),examples:[{code:"[\"A1:B1:C1\",\"A2:B2:C2\",\"A3:B3:C3\"]", description:"CSV list"},{code:"A1:B1:C1<br/>A2:B2:C2<br/>A3:B3:C3", description:"CSV string"},{code:"[[\"A1\",\"B1\",\"C1\"],[\"A2\",\"B2\",\"C2\"],[\"A3\",\"B3\",\"C3\"]]", description:"2D list"},{code:"[{\"a\":\"A1\",\"b\":\"B1\",\"c\":\"C1\"},{\"a\":\"A2\",\"b\":\"B2\",\"c\":\"C2\"},{\"a\":\"A3\",\"b\":\"B3\",\"c\":\"C3\"}]", description:"Object list"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Insert records into SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
