<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string in which to convert words."),examples:[{code:tr("just sample text")},{code:"test text"},{code:"string"}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<div><input type="checkbox" id="Check"/> <label for="Check" class="tr">Capitalize all words</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check2">
	<div><input type="checkbox" id="Check2"/> <label for="Check2" class="tr">All other letters in lowercase</label></div>
</span>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "RESULT_STRING", help: {description: tr("Variable in which, after successful execution of the action, the converted string will be written."), examples:[{code:tr("Just sample text")},{code:"Test Text"},{code:"String"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert the first letter of a word to uppercase.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
