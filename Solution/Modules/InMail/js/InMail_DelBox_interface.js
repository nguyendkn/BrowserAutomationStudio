<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "name",
		description: tr("Folder name"),
		default_selector: "string",
		disable_int: true, 
		value_string: "",
		help: {
			description: tr("Folder name")
		} 
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Deletes the specified mailbox that exists on the server.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
