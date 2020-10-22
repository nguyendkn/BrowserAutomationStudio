<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string to be converted to uppercase."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "UPPERCASE_STRING", help: {description: tr("Variable in which, after successful execution of the action, the converted string will be written."), examples:[{code:tr("JUST SAMPLE TEXT")},{code:"TEST TEXT"},{code:"STRING"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert all letters of the string to uppercase.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
