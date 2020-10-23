<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string containing a sentence to be split into words."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "WORDS_LIST", help: {description: tr("Variable in which, after successful execution of the action, the list of words will be written."), examples:[{code:tr("[\"Just\", \"sample\", \"text\"]")},{code:"[\"Test\", \"text\"]"},{code:"[\"string\"]"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Split sentence to words.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
