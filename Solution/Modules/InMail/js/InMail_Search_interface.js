<div class="container-fluid">
	<%= _.template($('#block_start').html())({id:"Filtration", name: tr("Filtration"), description: tr("Using the parameters from this block, you can filter the results as you need, or leave them without filtering.")}) %>
		<span class="tr" style="margin-left:15px">Sender of letter</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Sender of letter"), description: tr("Sender of letter")})) %>"></i>
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
		<span class="tr" style="margin-left:15px">Recipient of letter</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Recipient of letter"), description: tr("Recipient of letter")})) %>"></i>
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
		<span class="tr" style="margin-left:15px">Letter subject</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Letter subject"), description: tr("Letter subject")})) %>"></i>
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
		<span class="tr" style="margin-left:15px">Text of letter</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Text of letter"), description: tr("Text of letter")})) %>"></i>
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
		<span class="tr" style="margin-left:15px">Flags of letter</span> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Flags of letter"), description: tr("Flags of letter")})) %>"></i>
		<%= _.template($('#input_constructor').html())({
			id: "flags",
			description: tr("Contains"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help:{
				description: tr("List of flags that the letter should contain.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas."),
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
				description: tr("List of flags that the letter should not contain.") + " " + tr("As a list, you can use a string consisting of column names, separated by commas."),
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
				{value: "from", description: tr("Sender of letter") + ", " + tr("sort alphabetically")},
				{value: "to", description: tr("Recipient of letter") + ", " + tr("sort alphabetically")},
				{value: "subject", description: tr("Letter subject") + ", " + tr("sort alphabetically")},
				{value: "size", description: tr("Letter size")},
				{value: "date", description: tr("Receiving date")}
			],
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Field for sorting"),
				examples: [
					{code: "size", description: tr("Letter size")},
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
			<input type="checkbox" id="wait" style="margin-left:25px"/> <label for="wait" class="tr">Wait letters</label> <i class="fa fa-question-circle help-input" data-toggle="tooltip" data-html="true" title="<%= _.escape(_.template($("#tooltip-input").html())({title: tr("Wait letters"), description: tr("Wait letters")})) %>"></i>
		</span>
		<span id="waitSettings">
			<%= _.template($('#input_constructor').html())({
				id: "foundOver",
				description: tr("Number of letters"),
				default_selector: "int",
				disable_string: true,
				value_number: 0,
				min_number: 0,
				max_number: 999999,
				help: {
					description: tr("Number of letters")
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
					description: tr("Interval in seconds to check existence letters matching the specified criteria."),
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
					description: tr("Maximum waiting time for letters in seconds. If the specified time expires and the letter is not found, then the action will end with an error."),
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
				description: tr("Optional parameter.") + " " + tr("Maximum number of results")
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
				description: tr("Optional parameter.") + " " + tr("Offset")
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
				description: tr("Optional parameter.") + " " + tr("Folder name")
			}
		}) %>
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
	<div class="tr tooltip-paragraph-first-fold">Find and save the letters id by the specified criteria.</div>
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
