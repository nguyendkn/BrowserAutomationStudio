<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "uid",
		description: tr("Message Id"),
		default_selector: "string",
		value_string: "",
		help: {
			description: tr("Message Id")
		}
	}) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<%= _.template($('#input_constructor').html())({
			id: "box",
			description: tr("Folder name"),
			default_selector: "string",
			variants: [
				{value: "INBOX", description: tr("Default folder incoming messages")}
			],
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Optional parameter.") + " " + tr("Folder name")
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "MAIL_FLAGS",
		help: {
			description: tr("Variable in which, after successful execution of the action, the list of flags will be written.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get a list of flags for the specified message.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
