<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"Number", description: tr("Numbеr"), default_selector: "int", disable_string:true, value_number: "", min_number:-999999, max_number:999999, help: {description: tr("The number which needs to convert to a date."),examples:[{code:42788}, {code:43857.45}, {code:44081.84}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description: tr("Variable to save the result"), default_variable: "XLSX_DATE_FROM_NUMBER", help: {description: tr("Variable in which, after successful execution of the action, the date will be written."),examples:[{code:new Date()}, {code:new Date("09/07/2020")}]}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert excel date number to date.</div>
	<div class="tr tooltip-paragraph-fold">The resulting date can be processed using actions from the "Date and time" module.</div>
	<div class="tr tooltip-paragraph-last-fold">Excel stores date/times as the number of days since <code>1/1/1900</code>. It just applies a number formatting to make the number appear as a date.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
