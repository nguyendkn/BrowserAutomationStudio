<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"url", description: "URL", default_selector: "string", value_string: "", help: {description: tr("The string to be converted to uppercase."),examples:[{code:"https://en.wikipedia.org/wiki/URL/"},{code:"</br>//fingerprints.bablosoft.com/#testing/"},{code:"</br>rucaptcha.com/in.php?key=1abc234de56fab7c89012d34e56fa7b8</br>&method=userrecaptcha&version=enterprise&action=verify</br>&min_score=0.3</br>&googlekey=6LfZil0UAAAAAAdm1Dpzsw9q0F11-bmervx9g5fE&pageurl=http://mysite.com/page/"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"default_protocol", description: tr("Default protocol"), variants:["http", "https"], default_selector: "string", value_string: "http", help: {description: tr("The string to be converted to uppercase."),examples:[{code:"http"},{code:"https"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"base_url", description: tr("Base URL") + ". " + tr("Can be blank"), default_selector: "string", value_string: "", help: {description: tr("Optional parameter.") + " " + tr("The URL used when the main URL is relative."),examples:[{code:"https://en.wikipedia.org"},{code:"https://fingerprints.bablosoft.com"},{code:"https://rucaptcha.com"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"remove_query_parameters", description: tr("Remove query parameters") + ". " + tr("Can be blank"), default_selector: "expression", disable_int:true, value_string: "[/^utm_\w+/i]", help: {description: tr("Optional parameter.") + " " + tr("The string to be converted to uppercase."),examples:[{code:"http"},{code:"https"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"remove_directory_index", description: tr("Remove directory index") + ". " + tr("Can be blank"), variants:["true", "false", "[/^index\.[a-z]+$/]"], default_selector: "expression", disable_int:true, value_string: "[/^index\.[a-z]+$/]", help: {description: tr("Optional parameter.") + " " + tr("The string to be converted to uppercase."),examples:[{code:"http"},{code:"https"}]} }) %>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<input type="checkbox" id="Check" checked="checked"/> <label for="Check" class="tr">Normalize protocol</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check2">
	<input type="checkbox" id="Check2"/> <label for="Check2" class="tr">Force http</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check3">
	<input type="checkbox" id="Check3"/> <label for="Check3" class="tr">Force https</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check4">
	<input type="checkbox" id="Check4" checked="checked"/> <label for="Check4" class="tr">Strip authentication</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check5">
	<input type="checkbox" id="Check5"/> <label for="Check5" class="tr">Strip fragment</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check6">
	<input type="checkbox" id="Check6" style="margin-left:20px"/> <label for="Check6" class="tr">Strip protocol</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check7">
	<input type="checkbox" id="Check7" checked="checked" style="margin-left:20px"/> <label for="Check7" class="tr">Strip WWW</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check8">
	<input type="checkbox" id="Check8" checked="checked" style="margin-left:20px"/> <label for="Check8" class="tr">Remove trailing slash</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check9">
	<input type="checkbox" id="Check9" checked="checked" style="margin-left:20px"/> <label for="Check9" class="tr">Remove single slash</label>
</span></div>
<div><span data-preserve="true" data-preserve-type="check" data-preserve-id="Check10">
	<input type="checkbox" id="Check10" checked="checked" style="margin-left:20px"/> <label for="Check10" class="tr">Sort query parameters</label>
</span></div>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "NORMALIZED_URL", help: {description: tr("Variable in which, after successful execution of the action, the final string will be written."), examples:[{code:"https://en.wikipedia.org/wiki/URL"},{code:"</br>http://fingerprints.bablosoft.com/#testing"},{code:"</br>http://rucaptcha.com/in.php?key=1abc234de56fab7c89012d34e56fa7b8</br>&method=userrecaptcha&version=enterprise&action=verify</br>&min_score=0.3</br>&googlekey=6LfZil0UAAAAAAdm1Dpzsw9q0F11-bmervx9g5fE&pageurl=http://mysite.com/page"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Normalize URL.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
