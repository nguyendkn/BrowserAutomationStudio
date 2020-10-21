<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string from which to get the number of substrings."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"substring", description: tr("Substring"), default_selector: "string", value_string: "", help: {description: tr("Contiguous sequence of characters within a string."),examples:[{code:tr("sample")},{code:"text"},{code:"str"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "SUBSTRINGS_COUNT", help: {description: tr("Variable in which, after successful execution of the action, the number of specified substrings in the specified string will be written."), examples:[{code:5},{code:2},{code:0,description:tr("The specified substring is not present in the specified string.")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get the number of specified substrings in the specified string.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
