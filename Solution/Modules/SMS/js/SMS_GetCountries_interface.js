<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "service",
		description: tr("Service"),
		default_selector: "string",
		variants: [
			"sms-activate.ru",
			"sms-man.ru",
			"sms-acktiwator.ru"
		],
		disable_int: true,
		value_string: "sms-activate.ru",
		help: {
			description: tr("SMS receiving service for which need to get a list of countries."),
			examples: [
				{code: "sms-activate.ru", description: "https://sms-activate.ru"},
				{code: "sms-man.ru", description: "https://sms-man.ru"},
				{code: "sms-acktiwator.ru", description: "https://sms-acktiwator.ru"}
			]
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "apiKey",
		description: tr("API key"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description: tr("API key of the SMS receiving service. The key for the service selected in the \"Service\" parameter. Depending on the service, you can get it in your personal account or in the service settings."),
			examples: [
				{code: "8b1a9953c4611296a827abf8c47804d7"},
				{code: "79916U5718g2266a7bff7fad356c6cb280b3ea"},
				{code: "f4d559ba78aa6c4701c1995ae9977c03"}
			]
		}
	}) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<%= _.template($('#input_constructor').html())({
			id: "serverUrl",
			description: tr("Server url"),
			default_selector: "string",
			disable_int: true,
			value_string: "",
			help: {
				description: tr("Optional parameter.") + " " + tr("Url of the SMS receiving service server. Use this parameter to specify the url of the server, if the required service is not in the list of available ones, but it works through an api similar to the selected service."),
				examples: [
					{code: "https://sms.org"},
					{code: "http://receive-sms.com"},
					{code: "http://127.0.0.1:8888"},
					{code: tr("Empty string"), description: tr("Use default server url, https://sms-activate.ru for sms-activate.ru, etc")}
				]
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "SMS_COUNTRIES_LIST",
		help: {
			description:tr("Variable in which, after successful execution of the action, the list of countries will be written.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get list of countries of the SMS receiving service.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>