<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "from",
		description: tr("Sender Query"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Search by 'from' field(mail sender). Put here part of sender address to filter by mail sender. Leave blank not to filter by sender."),
			examples:[
				{code: tr("Empty string"), description: tr("Don't filter by sender.")},
				{code: "@twitter.com", description: tr("Search for message from mail with twitter domain")},
				{code: "info@twitter.com", description: tr("Search for email sent from info@twitter.com")}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "to",
		description: tr("Recipient"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Search by 'to' field(mail recepient). Put here part of recepient address to filter by mail receiver. Leave blank not to filter by recepient. This parameter is usefull if you collect mail from several mailboxes."),
			examples: [
				{code: tr("Empty string"), description: tr("Don't filter by recepient.")},
				{code: "test@yourdomain.com", description: tr("Search for message which is sent to test@yourdomain.com mailbox")}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "subject",
		description: tr("Subject Query"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help:{
			description: tr("Search email by subject. This could be combined with other queries."),
			examples: [
				{code: tr("Empty string"), description: tr("Don't filter by mail subject")},
				{code: tr("Subject string part"), description: tr("Search message with subject that contains specified string")}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "text",
		description: tr("Body Query"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Search email by message text. This could be combined with other queries."),
			examples: [
				{code: tr("Empty string"), description: tr("Don't filter by mail body")},
				{code: tr("Body string part"), description: tr("Search message with text that contains specified string")}
			]
		}
	}) %>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:10px;margin-bottom:10px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
	<%= _.template($('#input_constructor').html())({
		id: "sortType",
		description: tr("Sorting type"),
		default_selector: "string",
		variants: [
			{value: "no sorting", description: tr("No sorting")},
			{value: "ascending", description: tr("Sort ascending")},
			{value: "descending", description: tr("Sort descending")}
		],
		disable_int: true,
		value_string: "no sorting",
		help: {
			description: tr("Sorting type"),
			examples: [
				{code: "no sorting", description: tr("No sorting")},
				{code: "ascending", description: tr("Sort ascending")},
				{code: "descending", description: tr("Sort descending")}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "sortField",
		description: tr("Sorting field"),
		default_selector: "string",
		variants: [
			{value: "FROM"},
			{value: "TO"},
			{value: "SUBJECT"},
			{value: "SIZE"},
			{value: "DATE"},
			{value: "ARRIVAL"},
			{value: "CC"}
		],
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Field for sorting"),
			examples: [
				{code: "FROM"},
				{code: "DATE"}
			]
		}
	}) %>
	<div class="container-fluid">
		<div class="col-xs-12">
			<form class="form-horizontal">
				<div class="form-group">
					<div class="col-xs-12">
						<hr style="margin-top:10px;margin-bottom:10px"/>
					</div>
				</div>
			</form>
		</div>
	</div>
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
		<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
			<input type="checkbox" checked="checked" id="Check" style="margin-left:25px"/> <label for="Check" class="tr">Error if mail not found</label>
		</span>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "MAILS_ID_LIST",
		help: {
			description: tr("Variable in which, after successful execution of the action, the list of id of the found mails will be written.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Find and save the mails id by the specified criteria.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
