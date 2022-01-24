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
				description: tr("Optional parameter.") + " " + tr("The name of the folder in which this action will be performed, if not specified, the folder specified in the \"Configure receiving mail\" action will be used.") + " " + tr("You can get a list of mailbox folders using the \"Folder list\" action."),
				examples: [
					{code: "INBOX", description: tr("Default folder incoming messages")},
					{code: "Spam", description: tr("Spam folder, on some mails")},
					{code: "Trash", description: tr("Trash folder, on some mails")},
					{code: tr("Empty string"), description: tr("Use the folder specified in the \"Configure receiving mail\" action")}
				]
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "MAIL_FLAGS_LIST",
		help: {
			description: tr("Variable in which, after successful execution of the action, the list of flags will be written."),
			examples: [
				{code: "[\"\\Seen\"]"},
				{code: "[\"\\Seen\", \"\\Flagged\"]"},
				{code: "[\"\\Seen\", \"\\Answered\", \"\\Deleted\"]"}
			]
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get a list of flags for the specified message.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
