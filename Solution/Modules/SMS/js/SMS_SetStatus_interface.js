<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({
		id: "number",
		description: tr("Number"),
		default_selector: "string",
		disable_int: true,
		value_string: "",
		help: {
			description:tr("The number obtained from the \"Get phone number\" action, for which need to change the activation status.")
		}
	}) %>
	<%= _.template($('#input_constructor').html())({
		id: "status",
		description: tr("Stаtus"),
		default_selector: "string",
		disable_int: true,
		value_string: "", 
		variants: [
			"-1<br/><span style='color:gray'>" + tr("Cancel activation.") + "</span>",
			"1<br/><span style='color:gray'>" + tr("Inform about the availability of the number.") + "</span>",
			"3<br/><span style='color:gray'>" + tr("Request another code.") + "</span>",
			"6<br/><span style='color:gray'>" + tr("Complete activation.") + "</span>",
			"8<br/><span style='color:gray'>" + tr("Notify that the number is used and cancel the activation.") + "</span>",
		],
		help: {
			description: tr("The status to be set for the specified number."),
			examples: [
				{code: "-1", description: tr("Cancel activation.")},
				{code: "1", description: tr("Inform about the availability of the number.")},
				{code: "3", description: tr("Request another code.")},
				{code: "6", description: tr("Complete activation.")},
				{code: "8", description: tr("Notify that the number is used and cancel the activation.")}
			]
		}
	}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Change the activation status for the specified number.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>