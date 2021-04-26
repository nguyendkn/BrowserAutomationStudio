<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"number", description:tr("Number"), default_selector: "string", disable_int: true, value_string: "", help: {description: tr("Number")} }) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
	<%= _.template($('#input_constructor').html())({id:"timeout", description:tr("Timeout (minutes)"), default_selector:"int", disable_string: true, value_number:10, min_number:1, max_number:999999, help: {description: tr("Timeout")} }) %>
	<%= _.template($('#input_constructor').html())({id:"delay", description:tr("Delay (seconds)"), default_selector:"int", disable_string: true, value_number:2, min_number:1, max_number:999999, help: {description: tr("Delay")} }) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "CODE"}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get an activation code from the specified SMS receiving service.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>