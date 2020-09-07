<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"Date", description: tr("Date"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The date which needs to convert to a number."),examples:[{code:new Date()}, {code:new Date("09/07/2020")}, {code:"new Date()", description:tr("Date now (Field type must be <code>expression</code>)")}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description: tr("Variable to save the result"), default_variable: "XLSX_NUMBER_FROM_DATE", help: {description: tr("Variable in which, after successful execution of the action, a number will be written."),examples:[{code:42788}, {code:43857.45}, {code:44081.84}]}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert date to excel date number.</div>
	<div class="tr tooltip-paragraph-fold">Date can be created using actions from the "Date and time" module.</div>
	<div class="tr tooltip-paragraph-fold">Excel stores date/times as the number of days since <code>1/1/1900</code>. It just applies a number formatting to make the number appear as a date.</div>
	<div class="tr tooltip-paragraph-last-fold">To set the date value, you also need to set the cell's "numberFormat" style, if it is not already set.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
