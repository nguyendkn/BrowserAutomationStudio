<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "uids",
		description: tr("Message Id"),
		default_selector: "string",
		value_string: "",
		help: {
			description: tr("Message Id")
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "flags",
		description: tr("Flags"),
		default_selector: "string",
		variants: [
			{value: "\\Seen", description: tr("Message has been read")},
			{value: "\\Answered", description: tr("Message has been answered")},
			{value: "\\Flagged", description: tr("Message is \"flagged\" for urgent/special attention")},
			{value: "\\Deleted", description: tr("Message is marked for removal")},
			{value: "\\Draft", description: tr("Message has not completed composition (marked as a draft)")}
		],
		disable_int: true,
		value_string: "",
		help: {
			description: tr("List or one flag which needs to remove from the message.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas.") + " " + tr("The possible flags may differ depending on the server implementation."),
			examples: [
				{code: "\\Seen,\\Flagged"},
				{code: "\\Seen, \\Flagged"},
				{code: "[\"\\Seen\", \"\\Flagged\"]"},
				{code: "<br/>\\Seen", description: tr("Message has been read")},
				{code: "\\Answered", description: tr("Message has been answered")},
				{code: "\\Flagged", description: tr("Message is \"flagged\" for urgent/special attention")},
				{code: "\\Deleted", description: tr("Message is marked for removal")},
				{code: "\\Draft", description: tr("Message has not completed composition (marked as a draft)")}
			]
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
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Remove a flag or several flags from a message.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
