<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "oldName",
		description: tr("Old folder name"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Old folder name")
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "newName",
		description: tr("New folder name"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("New folder name")
		} 
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Renames the specified mailbox that exists on the server.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
