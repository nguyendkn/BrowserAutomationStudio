<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string that need to check if it is not empty."),examples:[{code:tr("Just sample text"), description: tr("String")},{code:'""', description: tr("Empty string")}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "IS_NOT_EMPTY", help: {description: tr("This variable will be true or false depending on whether the specified string is not empty."), examples:[{code:"true",description:tr("The string is not empty.")},{code:"false",description:tr("The string is empty. Or specified not string.")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Check if the specified string is not empty.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
