<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"query", description:tr("Query"), default_selector: "string", disable_int:true, disable_editor:true, disable_string:true, use_textarea:true, size: 8, disable_type_chooser:true,textarea_height:80, help: {description: tr("The query to be executed against the database.")} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Parameterize variables and resources.</label>
</span>
<%= _.template($('#input_constructor').html())({id:"type", description:tr("Query type"), default_selector: "string", variants:["auto<br/><span style='color:gray;font-size:small'>" + tr("Automatically detect query type") + "</span>","RAW<br/><span style='color:gray;font-size:small'>" + tr("Do not process query results") + "</span>","SELECT","INSERT","UPDATE","BULKUPDATE","BULKDELETE","DELETE","UPSERT","VERSION","SHOWTABLES","SHOWINDEXES","DESCRIBE","FOREIGNKEYS","SHOWCONSTRAINTS"], disable_int:true, value_string: "auto", help: {description: tr("The type of query you are executing. The query type affects how results are formatted.")} }) %>
<%= _.template($('#variable_constructor').html())({id:"results", description:tr("Results"), default_variable: "SQL_QUERY_RESULTS", help: {description: tr("Variable in which, after successful execution of the action, the results of the query will be written.")}}) %>
<%= _.template($('#variable_constructor').html())({id:"metadata", description:tr("Metadata"), default_variable: "SQL_QUERY_METADATA", help: {description: tr("Variable in which, after successful execution of the action, the metadata will be written.") + " " + tr("Metadata will be received only for \"RAW\" query type.")}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Execute an arbitrary query against an SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
