<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string from which to get the word count."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "WORDS_COUNT", help: {description: tr("Variable in which, after successful execution of the action, the number of words contained in the string will be written."), examples:[{code:5},{code:2},{code:0,description: tr("The string does not contain the words")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get the number of words in a string.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
