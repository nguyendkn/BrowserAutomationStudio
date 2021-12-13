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
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Creates a new mailbox on the server.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
