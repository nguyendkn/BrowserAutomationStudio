<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"number", description: tr("Number"), default_selector: "string", value_string: "", help: {description: tr("The number by which the declension of the word will be determined."),examples:[{code:123},{code:100000},{code:1456.578}]} }) %>
<%= _.template($('#input_constructor').html())({id:"word1", description: tr("Word at") + " 1", default_selector: "string", value_string: "", help: {description: tr("Word if number is") + " 1.",examples:[{code:tr("minute")},{code:tr("year")},{code:tr("account")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"word2", description: tr("Word at") + " 2", default_selector: "string", value_string: "", help: {description: tr("Word if number is") + " 2.",examples:[{code:tr("minutes")},{code:tr("years")},{code:tr("accounts")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"word5", description: tr("Word at") + " 5", default_selector: "string", value_string: "", help: {description: tr("Word if number is") + " 5.",examples:[{code:tr("minutеs")},{code:tr("yeаrs")},{code:tr("аccounts")}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "DECLINED_WORD", help: {description: tr("Variable in which, after successful execution of the action, the word corresponding to the specified number will be written."),examples:[{code:tr("minute"),description:tr("at 21")},{code:tr("yeаrs"),description:tr("at 10")},{code:tr("accounts"),description:tr("at 22")}]}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Decline a word depending on the specified number.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
