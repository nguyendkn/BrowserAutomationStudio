<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string which needs to be cleaned."),examples:[{code:"\"\xA0\xA0\xA0\xA0\xA0\xA0\xA0" + tr("Just\xA0\xA0\xA0\xA0sample\xA0\xA0text") + "\xA0\xA0\xA0\xA0\""},{code:"\"\xA0\xA0\xA0\xA0\xA0Test\xA0\xA0\xA0\xA0\xA0text\xA0\xA0\xA0\""},{code:"\"\xA0\xA0\xA0\xA0\xA0\xA0string\xA0\xA0\xA0\xA0\""}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<div><input type="checkbox" id="Check" checked="checked" style="margin-left:25px"/> <label for="Check" class="tr">Replace multiple spaces with single ones</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check2">
	<div><input type="checkbox" id="Check2" checked="checked" style="margin-left:25px"/> <label for="Check2" class="tr">Remove line breaks</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check3">
	<div><input type="checkbox" id="Check3" checked="checked" style="margin-left:25px"/> <label for="Check3" class="tr">Remove tabs</label></div>
</span>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"characters_to_delete", description: tr("Remove characters"), default_selector: "string", value_string: "", help: {description: tr("Characters which needs to be removed."),examples:[{code:"_-|"},{code:"_-"},{code:"%&"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"characters_to_space", description: tr("Replace characters with space"), default_selector: "string", value_string: "", help: {description: tr("Characters which needs to be replaced with a space."),examples:[{code:"_-|"},{code:"_-"},{code:"%&"}]} }) %>
<%= _.template($('#block_end').html())() %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "CLEANED_STRING", help: {description: tr("Variable in which, after successful execution of the action, the final string will be written."), examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Clean string from unnecessary characters.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
