<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string which needs to be trimmed."),examples:[{code:"\"\xA0\xA0\xA0\xA0\xA0\xA0\xA0" + tr("Just sample text") + "\xA0\xA0\xA0\xA0\""},{code:"\"\xA0\xA0\xA0\xA0\xA0Test text\xA0\xA0\xA0\""},{code:"\"\xA0\xA0\xA0\xA0\xA0\xA0string\xA0\xA0\xA0\xA0\""}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<div><input type="checkbox" id="Check" checked="checked" style="margin-left:25px"/> <label for="Check" class="tr">Trim spaces</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check2">
	<div><input type="checkbox" id="Check2" checked="checked" style="margin-left:25px"/> <label for="Check2" class="tr">Trim line breaks</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check3">
	<div><input type="checkbox" id="Check3" checked="checked" style="margin-left:25px"/> <label for="Check3" class="tr">Trim tabs</label></div>
</span>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"characters", description: tr("Trim characters"), default_selector: "string", value_string: "", help: {description: tr("Characters to be trimmed at the edges of the string."),examples:[{code:"_-|,"},{code:"_-"},{code:"%&"}]} }) %>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check4">
	<div><input type="radio" id="Check4" name="side" checked="checked" style="margin-left:25px"/> <label for="Check4" class="tr">Trim on both sides</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check5">
	<div><input type="radio" id="Check5" name="side" style="margin-left:25px"/> <label for="Check5" class="tr">Trim left</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check6">
	<div><input type="radio" id="Check6" name="side" style="margin-left:25px"/> <label for="Check6" class="tr">Trim right</label></div>
</span>
<%= _.template($('#block_end').html())() %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "TRIMMED_STRING", help: {description: tr("Variable in which, after successful execution of the action, the final string will be written."), examples:[{code:tr("Just sample text")},{code:"Test text"},{code:"string"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Trim string along the edges.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
