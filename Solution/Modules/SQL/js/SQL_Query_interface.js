<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"query", description:tr("Query"), default_selector: "string", disable_int:true, disable_editor:true, disable_string:true, use_textarea:true, size: 8, disable_type_chooser:true,textarea_height:80, help: {description: tr("The query to be executed against the database.")} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Parameterize variables and resources in the query.</label>
</span>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Results"), default_variable: "SQL_QUERY_RESULTS", help: {description: tr("Variable in which, after successful execution of the action, the results of the query will be written.")}}) %>
<%= _.template($('#input_constructor').html())({id:"data_format", description: tr("Data format"), default_selector: "string", variants:["CSV list<br/><span style='color:gray;font-size:small'>[\"A1:B1:C1\",\"A2:B2:C2\",\"A3:B3:C3\"]</span>","CSV string<br/><span style='color:gray;font-size:small'>A1:B1:C1<br/>A2:B2:C2<br/>A3:B3:C3</span>","2D list<br/><span style='color:gray;font-size:small'>[[\"A1\",\"B1\",\"C1\"],[\"A2\",\"B2\",\"C2\"],[\"A3\",\"B3\",\"C3\"]]</span>","Object list<br/><span style='color:gray;font-size:small'>[{\"a\":\"A1\",\"b\":\"B1\",\"c\":\"C1\"},{\"a\":\"A2\",\"b\":\"B2\",\"c\":\"C2\"},{\"a\":\"A3\",\"b\":\"B3\",\"c\":\"C3\"}]</span>"], disable_int:true, value_string: "CSV list", help: {description: tr("The format in which the received data will be stored in a variable."),examples:[{code:"CSV list", description:"[\"A1:B1:C1\",\"A2:B2:C2\",\"A3:B3:C3\"]"},{code:"CSV string", description:"A1:B1:C1<br/>A2:B2:C2<br/>A3:B3:C3"},{code:"2D list", description:"[[\"A1\",\"B1\",\"C1\"],[\"A2\",\"B2\",\"C2\"],[\"A3\",\"B3\",\"C3\"]]"},{code:"Object list", description:"[{\"a\":\"A1\",\"b\":\"B1\",\"c\":\"C1\"},{\"a\":\"A2\",\"b\":\"B2\",\"c\":\"C2\"},{\"a\":\"A3\",\"b\":\"B3\",\"c\":\"C3\"}]"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Execute an arbitrary query against an SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
