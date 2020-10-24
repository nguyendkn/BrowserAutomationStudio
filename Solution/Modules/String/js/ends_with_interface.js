<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string to check."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"substring", description: tr("Substring"), default_selector: "string", value_string: "", help: {description: tr("The substring that the string must end with."),examples:[{code:tr("sample")},{code:"text"},{code:"str"}]} }) %>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"lenght", description:tr("Length"), default_selector: "int", disable_string:true, value_number: "", min_number:0, max_number:999999, help: {description: tr("Optional parameter.") + " " + tr("The length to which the string will be truncated when searching for a substring allows searching within the string."),examples:[{code:10},{code:5},{code:tr("Empty string"), description:tr("String length")}]} }) %>
<%= _.template($('#block_end').html())() %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "IS_ENDS_WITH", help: {description: tr("This variable will be true or false depending on whether the string ends with the specified substring."), examples:[{code:"true",description:tr("The string ends with a substring.")},{code:"false",description:tr("The string does not end with a substring.")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Check if a string ends with a specified substring.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
