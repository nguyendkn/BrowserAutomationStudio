<div class="container-fluid">
	<%= _.template($('#block_start').html())({id:"Filtration", name: tr("Filtration"), description: tr("Using the parameters from this block, you can filter the results as you need, or leave them without filtering.")}) %>
		<span class="tr" style="margin-left:15px">Sender of message</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Sender of message"), description: tr("Sender of message, \"From\" field") + ", " + tr("using the two parameters below, you can make filter by the contents of this field."), examples: [{code: "admin@site.com"}, {code: "no-reply@example.com"}, {code: "Test &lt;info@test.com&gt;"}]})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "from",
			description: tr("Contains"),
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
			id: "notFrom",
			description: tr("Does not contain"),
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
		<div class="container-fluid">
			<div class="col-xs-12">
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-xs-12">
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<span class="tr" style="margin-left:15px">Recipient of message</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Recipient of message"), description: tr("Recipient of message, \"To\" field") + ", " + tr("using the two parameters below, you can make filter by the contents of this field."), examples: [{code: "you@site.com"}, {code: "name@example.com"}, {code: "User &lt;user@test.com&gt;"}]})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "to",
			description: tr("Contains"),
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
			id: "notTo",
			description: tr("Does not contain"),
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
		<div class="container-fluid">
			<div class="col-xs-12">
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-xs-12">
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<span class="tr" style="margin-left:15px">Message subject</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Message subject"), description: tr("Message subject, \"Subject\" field") + ", " + tr("using the two parameters below, you can make filter by the contents of this field."), examples: [{code: tr("Marketing")}, {code: tr("Business proposal")}, {code: tr("Email confirmation")}]})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "subject",
			description: tr("Contains"),
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
			id: "notSubject",
			description: tr("Does not contain"),
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
		<div class="container-fluid">
			<div class="col-xs-12">
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-xs-12">
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<span class="tr" style="margin-left:15px">Text of message</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Text of message"), description: tr("Text of message")})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "text",
			description: tr("Contains"),
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
		<%= _.template($('#input_constructor').html())({
			id: "notText",
			description: tr("Does not contain"),
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
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<span class="tr" style="margin-left:15px">Flags of message</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Flags of message"), description: tr("Flags of message")})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "flags",
			description: tr("Contains"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help:{
				description: tr("List of flags that the message should contain.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas."),
				examples: [
					{code: "unseen"},
					{code: "flagged,recent,unseen"},
					{code: "flagged, recent, unseen"},
					{code: "[\"flagged\", \"recent\", \"unseen\"]"},
					{code: tr("Empty string"), description: tr("Do not filter by the presence of flags")}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "notFlags",
			description: tr("Does not contain"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help:{
				description: tr("List of flags that the message should not contain.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas."),
				examples: [
					{code: "unseen"},
					{code: "flagged,recent,unseen"},
					{code: "flagged, recent, unseen"},
					{code: "[\"flagged\", \"recent\", \"unseen\"]"},
					{code: tr("Empty string"), description: tr("Do not filter by missing flags")}
				]
			}
		}) %>
		<div class="container-fluid">
			<div class="col-xs-12">
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-xs-12">
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<span class="tr" style="margin-left:15px">Receiving date</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Receiving date"), description: tr("Receiving date")})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "since",
			description: tr("From date"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("From date")
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "before",
			description: tr("To date"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("To date")
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#block_start').html())({id:"Sorting", name: tr("Sorting"), description: tr("Using the parameters from this block, you can sort the results in the order you need, or leave them without sorting.")}) %>
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
				description: tr("By default, sorting is disabled, but you can enable it by changing the value of this parameter and specifying the \"Sorting field\" parameter. Sorting is not supported by all mail services, if sorting is enabled, but the service does not support it, the action will fail."),
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
				{value: "from", description: tr("Sender of message") + ", " + tr("first \"From\" address") + ", " + tr("sort alphabetically")},
				{value: "to", description: tr("Recipient of message") + ", " + tr("first \"To\" address") + ", " + tr("sort alphabetically")},
				{value: "subject", description: tr("Message subject") + ", " + tr("sort alphabetically")},
				{value: "size", description: tr("Message size")},
				{value: "date", description: tr("Receiving date")}
			],
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Part of the message by which sorting will be performed."),
				examples: [
					{code: "from", description: tr("Sender of message") + ", " + tr("first \"From\" address") + ", " + tr("sort alphabetically")},
					{code: "to", description: tr("Recipient of message") + ", " + tr("first \"To\" address") + ", " + tr("sort alphabetically")},
					{code: "subject", description: tr("Message subject") + ", " + tr("sort alphabetically")},
					{code: "size", description: tr("Message size")},
					{code: "date", description: tr("Receiving date")}
				]
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<div class="container-fluid">
			<div class="col-xs-12">
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-xs-12">
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<span data-preserve="true" data-preserve-type="check" data-preserve-id="wait">
			<input type="checkbox" id="wait" style="margin-left:25px"/> <label for="wait" class="tr">Wait messages</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Wait messages"), description: tr("Optional parameter.") + " " + tr("If enabled, the action will not fail if the messages is not found according to the specified criteria, but will wait for the specified time, and only if the messages is not found within the specified time, the action will fail."), examples: [{code: tr("Activated"),description: tr("Wait messages")}, {code: tr("Deactivated"), description: tr("Don't wait messages")}]})) %>"></i>
		</span>
		<span id="waitSettings">
			<%= _.template($('#input_constructor').html())({
				id: "minResults",
				description: tr("Number of messages"),
				default_selector: "int",
				disable_string: true,
				value_number: 1,
				min_number: 1,
				max_number: 999999,
				help: {
					description: tr("Wait for the appearance of the specified number of messages matching the specified criteria. The action will be completed successfully when the number of messages matching the specified criteria is equal to or greater than the number specified in this parameter."),
					examples: [
						{code: 1, description: tr("Wait for one message matching the specified criteria")},
						{code: 5, description: tr("Wait for five messages matching the specified criteria")},
						{code: 10, description: tr("Wait for ten messages matching the specified criteria")}
					]
				}
			}) %>
			<%= _.template($('#input_constructor').html())({
				id: "interval",
				description: tr("Interval (seconds)"),
				default_selector: "int",
				disable_string: true,
				value_number: 5,
				min_number: 1,
				max_number: 999999,
				help: {
					description: tr("Interval in seconds to check existence messages matching the specified criteria."),
					examples: [
						{code: 2, description: tr("Check every 2 seconds")},
						{code: 5, description: tr("Check every 5 seconds")},
						{code: 10, description: tr("Check every 10 seconds")}
					]
				}
			}) %>
			<%= _.template($('#input_constructor').html())({
				id: "timeout",
				description: tr("Timeout (seconds)"),
				default_selector: "int",
				disable_string: true,
				value_number: 300,
				min_number: 1,
				max_number: 999999,
				help: {
					description: tr("Maximum waiting time for messages in seconds. If the specified time expires and the message is not found, then the action will end with an error."),
					examples: [
						{code: 300, description: tr("Wait 5 minutes")},
						{code: 600, description: tr("Wait 10 minutes")},
						{code: 900, description: tr("Wait 15 minutes")},
						{code: 1200, description: tr("Wait 20 minutes")}
					]
				}
			}) %>
		</span>
		<div class="container-fluid">
			<div class="col-xs-12">
				<form class="form-horizontal">
					<div class="form-group">
						<div class="col-xs-12">
							<hr style="margin-top:0px;margin-bottom:0px"/>
						</div>
					</div>
				</form>
			</div>
		</div>
		<%= _.template($('#input_constructor').html())({
			id: "maxResults",
			description: tr("Maximum number of results"),
			default_selector: "int",
			disable_string: true,
			value_number: "",
			min_number: 0,
			max_number: 999999,
			help: {
				description: tr("Optional parameter.") + " " + tr("Limit the number of returned ids to the specified number. If this parameter is specified, then the resulting id list will be truncated to the specified number. If the parameter is not specified or equal to 0, then the limit will not be applied and the full result will be returned."),
				examples: [
					{code: 1, description: "[456]"},
					{code: 3, description: "[456, 584, 589]"},
					{code: 6, description: "[456, 584, 589, 740, 805, 1203]"},
					{code: 0, description: tr("Don't limit the number of results")},
					{code: tr("Empty string"), description: tr("Don't limit the number of results")}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "offset",
			description: tr("Offset"),
			default_selector: "int",
			disable_string: true,
			value_number: "",
			min_number: -999999,
			max_number: 999999,
			help: {
				description: tr("Optional parameter.") + " " + tr("Add the specified offset to all found ids. If this parameter is specified, then the specified offset will be added to all found ids. The offset can be any positive or negative integer."),
				examples: [
					{code: 1, description: tr("Add 1 to all found id")},
					{code: 5, description: tr("Add 5 to all found id")},
					{code: -1, description: tr("Subtract 1 from all found id")},
					{code: -5, description: tr("Subtract 5 from all found id")},
					{code: tr("Empty string"), description: tr("Don't add offset to found id")}
				]
			}
		}) %>
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
		default_variable: "MAIL_ID_LIST",
		help: {
			description: tr("Variable in which, after successful execution of the action, the list of id of the found messages will be written."),
			examples: [
				{code: "[639]"},
				{code: "[145, 187, 422]"},
				{code: "[254, 356, 593, 694, 947]"}
			]
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Find and save the messages id by the specified criteria.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
<script>
		
		function setVisibleWait(){
			if($('#wait').is(':checked')){
				$('#waitSettings').show();
			}else{
				$('#waitSettings').hide();
			};
		};
		
		$(document).ready(function(){
			setTimeout(setVisibleWait, 0);
        });
		
        $('#wait').on('change', setVisibleWait);

</script>
