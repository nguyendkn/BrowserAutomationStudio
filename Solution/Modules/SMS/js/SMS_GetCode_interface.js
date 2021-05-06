<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "number",
		description: tr("Number"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description:tr("The number obtained from the \"Get phone number\" action, for which need to receive an SMS code.")
		}
	}) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<%= _.template($('#input_constructor').html())({
			id: "timeout",
			description: tr("Timeout (minutes)"),
			default_selector: "int",
			disable_string: true,
			value_number: 10,
			min_number: 1,
			max_number: 999999,
			help: {
				description: tr("Maximum waiting time for SMS code in minutes. If the specified time expires and the SMS is not received, then the action will end with an error."),
				examples: [
					{code: 10, description: tr("10 minutes")},
					{code: 15, description: tr("15 minutes")},
					{code: 20, description: tr("20 minutes")}
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
				description: tr("The code readiness check interval in seconds."),
				examples: [
					{code: 2, description: tr("2 seconds")},
					{code: 5, description: tr("5 second")},
					{code: 10, description: tr("10 seconds")}
				]
			}
		}) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({
		id: "Save",
		description: tr("Variable to save the result"),
		default_variable: "SMS_CODE",
		help: {
			description:tr("Variable in which, after successful execution of the action, he SMS code will be written.")
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get an activation code from the specified number.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>