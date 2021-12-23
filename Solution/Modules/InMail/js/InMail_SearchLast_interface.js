<div class="container-fluid">
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
				description: tr("Folder name")
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "LAST_MAIL_ID",
		help: {
			description: tr("Variable in which, after successful execution of the action, the id of the last mail will be written.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Find and save the id of the last letter in the specified folder.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
