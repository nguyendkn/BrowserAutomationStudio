<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"Value", description:tr("Line"), default_selector: "string", disable_int:true, help: {description: tr("Line with several elements separated with \":\" or \",\" or \";\""), examples:[{code:"login:password"},{code:"id,name,login"}]}}) %>
	<%= _.template($('#variable_constructor').html())({id:"VariablesList", description:tr("Variables To Save Result"), default_variable: "USERNAME,PASSWORD", append_mode:true, help: {description: tr("List of variables separated by commas. Results will be written into that variables.")}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Parses line, which contains several elements. Elements are separated with one of following symbols: ":", ";", ",".</div>
	<div class="tr tooltip-paragraph-fold">For example, if you apply this action to line email@gmail.com:mypass1 and set "Variables To Save Result" param to USERNAME,PASSWORD, than this action will set [[USERNAME]] variable to email@gmail.com and [[PASSWORD]] variable to mypass1.</div>
	<div class="tr tooltip-paragraph-fold">If "Variables To Save Result" will contain more variables, than number of elements in string, than extra variables will be left unchanged.</div>
	<div class="tr tooltip-paragraph-fold">Use "Parse String" action if you want to get list as a result.</div>
	<div class="tr tooltip-paragraph-last-fold">This action also may parse strings in csv format.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>