<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string from which to extract phone numbers."),examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "PHONE_NUMBERS_LIST", help: {description: tr("Variable in which, after successful execution of the action, the list of phone numbers will be written."), examples:[{code:tr("JUST SAMPLE TEXT")},{code:"TEST TEXT"},{code:"STRING"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Extract all phone numbers from the string.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
