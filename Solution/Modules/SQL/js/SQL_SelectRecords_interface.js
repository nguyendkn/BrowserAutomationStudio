<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"table", description:tr("Database table"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Table name, for which operation will be applied"), examples:[{code:"table"},{code:"users"},{code:"accounts"},{code:"materials"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"where", description:tr("Filter") + ". " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("A set of conditions intended for selecting the records."), examples:[{code:"id = 10",description:tr("id equals 10")},{code:"id = [[ID]]",description:tr("id is equal to the value from the variable [[ID]]")},{code:"title = {{title}}",description:tr("title is equal to the value from the resource {{title}}")},{code:"name='john' AND balance > 100",description:tr("name is equal to john and balance is more than one hundred")},{code:"radius BETWEEN 30 AND 90",description:tr("radius from 30 to 90")},{code:"amount IS NULL",description:tr("amount field is empty")},{code:"id IN (4, 12, 58, 67)",description:tr("id is equal to a value from the list 4, 12, 58, 67")},{code:"id IN ([[ID_LIST]])",description:tr("id is equal to the value from the list in the [[ID_LIST]] variable")},{code:tr("Empty string"),description:tr("Do not filter records")}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check" style="padding-left:5px">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Parameterize variables and resources in the filter.</label> <i class="fa fa-question-circle help-input trtitle" data-toggle="tooltip" title="Data from variables and resources will be escaped according to their type and used SQL dialect"></i>
</span>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"included_columns", description:tr("List of included columns"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("List of column names to be included in the final results.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas.") + " " + tr("If the \"List of excluded columns\" parameter is specified, the value of this parameter is ignored."),examples:[{code:"id,title,url,amount"},{code:"id, title, url, amount"},{code:"[\"id\", \"title\", \"url\", \"amount\"]"},{code:tr("Empty string"), description:tr("Include all columns")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"excluded_columns", description:tr("List of excluded columns"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("List of column names to be excluded from the final results.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas.") + " " + tr("If this parameter is specified, the value of the \"List of included columns\" parameter is ignored."),examples:[{code:"id,title,url,amount"},{code:"id, title, url, amount"},{code:"[\"id\", \"title\", \"url\", \"amount\"]"},{code:tr("Empty string"), description:tr("Do not exclude columns")}]} }) %>
<div class="container-fluid">
	<div class="col-xs-12">
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-xs-12">
					<hr style="margin-top:10px;margin-bottom:10px"/>
				</div>
			</div>
		</form>
	</div>
</div>
<%= _.template($('#input_constructor').html())({id:"order_direction", description:tr("Sorting type"), default_selector: "string", variants: ["no sorting<br/><span style='color:gray;font-size:small'>" + tr("No sorting") + "</span>", "ascending<br/><span style='color:gray;font-size:small'>" + tr("Sort ascending") + "</span>", "descending<br/><span style='color:gray;font-size:small'>" + tr("Sort descending") + "</span>"], disable_int:true, value_string: "no sorting", help: {description: tr("By default sorting is disabled, but you can enable it by changing this field. Don't forget to change database field(\"Sorting column\") for which sorting will be applied."), examples:[{code:"no sorting",description:tr("No sorting")},{code:"ascending",description:tr("Sort ascending")},{code:"descending",description:tr("Sort descending")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"order_column", description:tr("Sorting column"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Column for sorting"),examples:[{code:"id"},{code:"amount"}]} }) %>
<div class="container-fluid">
	<div class="col-xs-12">
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-xs-12">
					<hr style="margin-top:10px;margin-bottom:10px"/>
				</div>
			</div>
		</form>
	</div>
</div>
<%= _.template($('#input_constructor').html())({id:"offset", description:tr("Offset"), default_selector: "int", disable_string:true, value_number: "", min_number:0, max_number:999999, help: {description: tr("Number of records to skip."),examples:[{code:tr("Empty string"), description:tr("Don't skip records")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"limit", description:tr("Limit"), default_selector: "int", disable_string:true, value_number: "", min_number:0, max_number:999999, help: {description: tr("Limiting the number of records in the final result."),examples:[{code:tr("Empty string"), description:tr("Do not limit the number of results")}]} }) %>
<div class="container-fluid">
	<div class="col-xs-12">
		<form class="form-horizontal">
			<div class="form-group">
				<div class="col-xs-12">
					<hr style="margin-top:10px;margin-bottom:10px"/>
				</div>
			</div>
		</form>
	</div>
</div>
<%= _.template($('#block_end').html())() %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "SQL_RECORDS", help: {description: tr("Variable in which, after successful execution of the action, the received records will be written.") + " " + tr("The format of the saved data depends on the \"Data Format\" setting.")}}) %>
<%= _.template($('#input_constructor').html())({id:"data_format", description: tr("Data format"), default_selector: "string", variants:["CSV list<br/><span style='color:gray;font-size:small'>[\"1:test1:true\",\"2:test2:false\",\"3:test3:false\"]</span>","CSV string<br/><span style='color:gray;font-size:small'>1:tes1:true<br/>2:test2:false<br/>3:test3:false</span>","2D list<br/><span style='color:gray;font-size:small'>[[1,\"test1\",true],[2,\"test2\",false],[3,\"test3\",false]]</span>","Object list<br/><span style='color:gray;font-size:small'>[{\"id\":1,\"name\":\"test1\",\"active\":true},{\"id\":2,\"name\":\"test2\",\"active\":false},{\"id\":3,\"name\":\"test3\",\"active\":false}]</span>"], disable_int:true, value_string: "CSV list", help: {description: tr("The format in which the received data will be stored in a variable."),examples:[{code:"CSV list", description:"[\"1:test1:true\",\"2:test2:false\",\"3:test3:false\"]"},{code:"CSV string", description:"1:tes1:true<br/>2:test2:false<br/>3:test3:false"},{code:"2D list", description:"[[1,\"test1\",true],[2,\"test2\",false],[3,\"test3\",false]]"},{code:"Object list", description:"[{\"id\":1,\"name\":\"test1\",\"active\":true},{\"id\":2,\"name\":\"test2\",\"active\":false},{\"id\":3,\"name\":\"test3\",\"active\":false}]"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Select multiple records from SQL database.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Setup connection" action first.</div>
	<div class="tooltip-paragraph-fold"><span class="tr">CSV list - a list that consists of CSV lines and CSV line consists of field values separated with ":" symbol.</span> <span class="tr">Example:</span> <code>["1:test1:true","2:test2:false","3:test3:false"]</code></div>
	<div class="tooltip-paragraph-fold"><span class="tr">CSV string - this CSV lines separated by a line break, and consisting of field values separated with ":" symbol.</span> <span class="tr">Example:</span> <code><br/>1:tes1:true<br/>2:test2:false<br/>3:test3:false</code></div>
	<div class="tooltip-paragraph-fold"><span class="tr">2D list - a list that consists of lists containing the field values.</span> <span class="tr">Example:</span> <code>[[1,"test1",true],[2,"test2",false],[3,"test3",false]]</code></div>
	<div class="tr tooltip-paragraph-fold">Object list - a list that consists of objects, in the object the key is the name of the field, and the value is the content of the field.</div>
	<div class="tooltip-paragraph-fold"><span class="tr">Example:</span> <code>[{"id":1,"name":"test1","active":true},{"id":2,"name":"test2","active":false},{"id":3,"name":"test3","active":false}]</code></div>
	<div class="tr tooltip-paragraph-fold">CSV lines can be parsed using the "Parse Line" action from the "Tools" module.</div>
	<div class="tr tooltip-paragraph-fold">Lists can be processed using actions from the "List" module.</div>
	<div class="tr tooltip-paragraph-fold">Objects can be processed using actions from the "JSON" module.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
