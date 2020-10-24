<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string to check."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"substring", description: tr("Substring"), default_selector: "string", value_string: "", help: {description: tr("The substring that the string should start with."),examples:[{code:tr("sample")},{code:"text"},{code:"str"}]} }) %>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"from", description:tr("From index"), default_selector: "int", disable_string:true, value_number: "", min_number:0, max_number:999999, help: {description: tr("Optional parameter.") + " " + tr("The character index at which to start the search."),examples:[{code:1, description:tr("From the second character")},{code:0, description:tr("From the first character")},{code:tr("Empty string"), description:tr("From the beginning of the string")}]} }) %>
<%= _.template($('#block_end').html())() %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "IS_STARTS_WITH", help: {description: tr("This variable will be true or false depending on whether the string starts with the specified substring."), examples:[{code:"true",description:tr("The string starts with a substring.")},{code:"false",description:tr("The string does not start with a substring.")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Check if the string starts with the specified substring.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
