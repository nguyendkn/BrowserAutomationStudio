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
		id: "toBox",
		description: tr("To folder"),
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
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Copy message from one mailbox to another.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>