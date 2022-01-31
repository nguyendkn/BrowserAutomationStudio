<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "name",
		description: tr("Folder name"),
		default_selector: "string",
		variants: [
			{value: "INBOX", description: tr("Default folder incoming messages")}
		],
		disable_int: true, 
		value_string: "",
		help: {
			description: tr("The name of the folder which need to get information about.") + " " + tr("You can get a list of mailbox folders using the \"Folder list\" action."),
			examples: [
				{code: "INBOX", description: tr("Default folder incoming messages")},
				{code: "Spam", description: tr("Spam folder, on some mails")},
				{code: "Trash", description: tr("Trash folder, on some mails")}
			]
		} 
	}) %>
	<%= _.template($('#variable_constructor').html())({
		id: "total",
		description: tr("Total messages"),
		default_variable: "MAIL_TOTAL_COUNT",
		help: {
			description: tr("Total messages"),
		}
	}) %>
	<%= _.template($('#variable_constructor').html())({
		id: "recent",
		description: tr("Recent messages"),
		default_variable: "MAIL_RECENT_COUNT",
		help: {
			description: tr("Recent messages"),
		}
	}) %>
	<%= _.template($('#variable_constructor').html())({
		id: "unseen",
		description: tr("Unseen messages"),
		default_variable: "MAIL_UNSEEN_COUNT",
		help: {
			description: tr("Unseen messages"),
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get information about the folder in the specified mailbox.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Configure receiving mail" action first.</div>
	<div class="tr tooltip-paragraph-fold">You can get a list of mailbox folders using the "Folder list" action.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
