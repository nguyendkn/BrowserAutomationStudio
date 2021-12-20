<div class="container-fluid">
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "MAIL_BOXES",
		help: {
			description: tr("Variable in which, after successful execution of the action, the list of folders will be written.")
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "format",
		description: tr("Data format"),
		default_selector: "string",
		variants: [
			"Objects list",
			"CSV list",
			"CSV string"
		],
		disable_int: true,
		value_string: "Object",
		help: {
			description: tr("The format in which the read data will be saved to variable.")
		} 
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get a list of folders in the specified mailbox.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
