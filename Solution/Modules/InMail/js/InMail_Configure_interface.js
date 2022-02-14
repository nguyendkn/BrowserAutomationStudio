<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "protocol",
		description: tr("Protocol"),
		default_selector: "string",
		variants: [
			"imap",
			"pop3"
		],
		disable_int: true,
		value_string: "imap",
		help: {
			description: tr("The protocol by which the connection to the mail server will be made."),
			examples: [
				{code: "imap"},
				{code: "pop3"}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "autoConfig",
		description: tr("Auto configuration"),
		default_selector: "string",
		variants: [
			"true",
			"false"
		],
		disable_int: true,
		value_string: "false",
		help: {
			description: tr("Auto configuration"),
			examples: [
				{code: "true"},
				{code: "false"}
			]
		}
	}) %>
	<span id="advancedSettings">
		<%= _.template($('#input_constructor').html())({
			id: "host",
			description: tr("Server address"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Address (URL or IP) of the mail server."),
				examples: [
					{code: "imap.site.com"},
					{code: "pop.example.com"},
					{code: "96.256.27.26"}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "port",
			description: tr("Port"),
			variants: [
				{value: "auto", description: tr("Automatically detect port based on protocol and encryption type")},
				{value: "993", description: tr("Default port for imap protocol with SSL encryption")},
				{value: "995", description: tr("Default port for pop3 protocol with SSL encryption")},
				{value: "143", description: tr("Default port for imap protocol without encryption or with STARTTLS encryption")},
				{value: "110", description: tr("Default port for pop3 protocol without encryption or with STARTTLS encryption")}
			],
			default_selector: "string",
			value_string: "auto",
			help: {
				description: tr("Port number of the mail server."),
				examples: [
					{code: "auto", description: tr("Automatically detect port based on protocol and encryption type")},
					{code: "993", description: tr("Default port for imap protocol with SSL encryption")},
					{code: "143", description: tr("Default port for imap protocol without encryption or with STARTTLS encryption")},
					{code: "995", description: tr("Default port for pop3 protocol with SSL encryption")},
					{code: "110", description: tr("Default port for pop3 protocol without encryption or with STARTTLS encryption")}
				]
			}
		}) %>
		<%= _.template($('#input_constructor').html())({
			id: "encrypt",
			description: tr("Encryption"),
			default_selector: "string",
			variants: [
				{value: "none", description: tr("Without using encryption")},
				"SSL",
				"STARTTLS"
			],
			disable_int: true,
			value_string: "SSL",
			help: {
				description: tr("Encryption type of connection to the mail server."),
				examples: [
					{code: "none", description: tr("Without using encryption")},
					{code: "SSL"},
					{code: "STARTTLS"}
				]
			}
		}) %>
	</span>
	<%= _.template($('#input_constructor').html())({
		id: "username",
		description: tr("Username") + ". " + tr("Can be blank"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Username of the mail server.")
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "password",
		description: tr("Password") + ". " + tr("Can be blank"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("Password of the mail server.")
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
		value_string: "INBOX",
		help: {
			description: tr("The name of the folder in which all actions will be performed if no other folder is specified in their additional settings."),
			examples: [
				{code: "INBOX", description: tr("Default folder incoming messages")},
				{code: "Spam", description: tr("Spam folder, on some mails")},
				{code: "Trash", description: tr("Trash folder, on some mails")}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "timeout",
		description: tr("Timeout (seconds)"),
		default_selector: "int",
		disable_string: true,
		value_number: 300,
		min_number: 0,
		max_number: 999999,
		help: {
			description: tr("This action won't start connection, it only sets configuration. Connection will be established after first attempt to access server. When action, which triggers connection will be finished, connection won't be closed immediately. It will be preserved for a time specified in this parameter. If another action will require access to server, connection will be reused.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Configure access to the mail server to read email.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
<script>
		
		$(document).ready(function(){
			setTimeout(function(){
				let setVisibleAdvanced = function(e){
					if($('#autoConfig').val() != "true"){
						$('#advancedSettings').show();
					}else{
						$('#advancedSettings').hide();
					};
				};
				
				$('#autoConfig').on('blur', setVisibleAdvanced);
				
				setVisibleAdvanced();
			}, 0);
		});

</script>
