<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string to convert to a number."),examples:[{code:"123"},{code:"100,000"},{code:"1,456.578"}]} }) %>
<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
<%= _.template($('#input_constructor').html())({id:"decimals", description:tr("Number of decimal places"), default_selector: "int", disable_string:true, value_number: -1, min_number:-1, max_number:20, help: {description: tr("The number of decimal places to which the number will be rounded."),examples:[{code:4, description:156.6439},{code:2, description:21.78},{code:0, description:tr("Round to whole number")},{code:-1, description:tr("Do not round the number")},{code:tr("Empty string"), description:tr("Do not round the number")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"dec_point", description: tr("Decimal separator"), default_selector: "string", value_string: ".", help: {description: tr("Separator between integer and decimal parts of a number."),examples:[{code:".", description:156.6439},{code:",", description:"156,6439"},{code:tr("Empty string"), description:tr('"." - 156.6439')}]} }) %>
<%= _.template($('#input_constructor').html())({id:"thousands_sep", description: tr("Thousandth separator"), default_selector: "string", value_string: ",", help: {description: tr("Separator between thousandths."),examples:[{code:" ", description:"1 000 000.01"},{code:",", description:"1,000,000.01"},{code:tr("Empty string"), description:tr('"," - 1,000,000.01')}]} }) %>
<%= _.template($('#block_end').html())() %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "RESULT_NUMBER", help: {description: tr("Variable in which, after successful execution of the action, the numeric representation of the specified string will be written."),examples:[{code:123},{code:100000},{code:1456.578}]}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert the specified string to a number.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
