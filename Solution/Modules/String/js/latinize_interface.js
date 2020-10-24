<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"string", description: tr("String"), default_selector: "string", value_string: "", help: {description: tr("The string to be latinized."),examples:[{code:"ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů"},{code:"Привет мир!"},{code:"Просто пример текста"}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "LATINIZED_STRING", help: {description: tr("Variable in which, after successful execution of the action, the converted string will be written."), examples:[{code:"ExAmPlE aeiouycdenrstzu"},{code:"Privet mir!"},{code:"Prosto primer teksta"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Convert all letters and symbols to Latin.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
