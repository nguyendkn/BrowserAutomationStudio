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
			description: tr("Folder name")
		} 
	}) %>
	<%= _.template($('#variable_constructor').html())({
		id: "total",
		description: tr("Total messages"),
		default_variable: "MESSAGES_TOTAL_COUNT",
		help: {
			description: tr("Total messages"),
		}
	}) %>
	<%= _.template($('#variable_constructor').html())({
		id: "recent",
		description: tr("Recent messages"),
		default_variable: "MESSAGES_RECENT_COUNT",
		help: {
			description: tr("Recent messages"),
		}
	}) %>
	<%= _.template($('#variable_constructor').html())({
		id: "unseen",
		description: tr("Unseen messages"),
		default_variable: "MESSAGES_UNSEEN_COUNT",
		help: {
			description: tr("Unseen messages"),
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get information about the folder in the specified mailbox.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
