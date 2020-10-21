<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"data", description: tr("Data"), default_selector: "string", value_string: "", help: {description: tr("The data that need to check out whether they is not empty string."),examples:[{code:tr("Just sample text"), description: tr("String")},{code:'""', description: tr("Empty string")}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "IS_NOT_EMPTY", help: {description: tr("This variable will be true or false depending on whether the specified string is not empty."), examples:[{code:"true",description:tr("Not empty string.")},{code:"false",description:tr("Empty string or not string.")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Check if the specified data is not an empty string.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
