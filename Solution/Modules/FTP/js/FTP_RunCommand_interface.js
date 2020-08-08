<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"Command", description:tr("Command"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The command which needs to be executed on the remote server.")} }) %>
<%= _.template($('#variable_constructor').html())({id:"Standart", description:tr("Standard output"), default_variable: "STANDART_OUTPUT", help: {description: tr("This variable will contain the standard output of the command.")}}) %>
<%= _.template($('#variable_constructor').html())({id:"Error", description:tr("Error output"), default_variable: "ERROR_OUTPUT", help: {description: tr("This variable will contain the result of the command with error.")}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Execute a command on a remote server and save the results to variables.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Configure FTP/SSH" action first.</div>
	<div class="tr tooltip-paragraph-fold">This action only works with the SSH protocol.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
