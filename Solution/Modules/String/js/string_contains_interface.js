<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string in which to check the contains of the substring."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"substring", description: tr("Substring"), default_selector: "string", value_string: "", help: {description: tr("Substring, the contains of which is necessary to check."),examples:[{code:tr("sample")},{code:"text"},{code:"str"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "STRING_CONTAINS", help: {description: tr("This variable will be true or false depending on whether the string contains a substring."), examples:[{code:"true",description:tr("The string contains a substring.")},{code:"false",description:tr("The string does not contain a substring.")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Check if the string contains the specified substring.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
