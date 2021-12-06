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
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Flags")
		}
	}) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<%= _.template($('#input_constructor').html())({
			id: "folder",
			description: tr("Folder name"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Folder name")
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Add a flag or several flags to the message.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
