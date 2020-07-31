<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"RemotePath", description:tr("Remote path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the required file/folder on the remote server."),examples:[{code:"/html/test"},{code:"/public_html/test1.zip"},{code:"/domains/site.com/public_html/test2.txt"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"DestinationPath", description:tr("Destination path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the location where the file/folder downloaded from the remote server will be saved."),examples:[{code:"C:/test"},{code:"C:/Program Files"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Download file/folder from a remote server and save to the specified location.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Configure" action first.</div>
	<div class="tr tooltip-paragraph-fold">If a non-existent destination path is specified, it will be created.</div>
	<div class="tr tooltip-paragraph-fold">If downloaded files already exist along the destination path, they will be overwritten.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
