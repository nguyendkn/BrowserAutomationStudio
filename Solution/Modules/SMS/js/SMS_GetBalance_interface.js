<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"service", description:tr("Service"), default_selector: "string", variants: ["sms-activate.ru","smshub.org","5sim.net","getsms.online","smsvk.net","vak-sms.com","cheapsms.ru","give-sms.com","sms.kopeechka.store","simsms.org","sms-reg.com","smspva.com","onlinesim.ru","sms-acktiwator.ru"], disable_int: true, value_string: "sms-activate.ru", help: {description: tr("SMS receiving service.")} }) %>
	<%= _.template($('#input_constructor').html())({id:"apiKey", description:tr("API key"), default_selector: "string", disable_int: true, value_string: "", help: {description: tr("API key of the SMS receiving service.")} }) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
	<%= _.template($('#input_constructor').html())({id:"serverUrl", description:tr("Server url"), default_selector: "string", disable_int: true, value_string: "" }) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "SMS_BALANCE", help: {description: tr("Variable in which, after successful execution of the action, the balance will be written.")}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get the balance of the SMS receiving service.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>