<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("CSV string with want to parse into items."),examples:[{code:"login:password"},{code:"id,name,login"},{code:tr("Just sample text") + ";Test text;string"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"separators", description:tr("List of separators"), default_selector: "string", disable_int:true, value_string: ":;,", help: {description: tr("The list of delimiters by which the string can be split.") + " " + tr("As a list, you can use a string consisting only of the separators."),examples:[{code:":;,"},{code:"[\":\", \";\", \",\"]"},{code:tr("Empty string"), description: "[\":\", \";\", \",\"]"}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<input type="checkbox" id="Check"/> <label for="Check" class="tr">Convert types.</label> <i class="fa fa-question-circle help-input trtitle" data-toggle="tooltip" title="Convert strings to numbers, booleans and objects"></i>
</span>
<%= _.template($('#variable_constructor').html())({id:"VariablesList", description:tr("Variables To Save Result"), default_variable: "USERNAME,PASSWORD", append_mode:true, help: {description: tr("List of variables separated by commas. Results will be written into that variables.")} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Parse CSV string into items.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
