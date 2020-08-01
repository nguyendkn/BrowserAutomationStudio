<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"FilePath", description:tr("File or folder path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the file/folder which needs to be uploaded to the remote server."),examples:[{code:"C:/test"},{code:"C:/Program Files"},{code:"C:/Program Files/test2.txt"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"DestinationPath", description:tr("Remote destination path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the location on the remote server where the uploaded file/folder will be saved."),examples:[{code:"/html"},{code:"/public_html"},{code:"/domains/site.com/public_html"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Upload the file/folder to the specified location on the remote server.</div>
	<div class="tr tooltip-paragraph-fold">In order to execute this action correctly you need to run "Configure" action first.</div>
	<div class="tr tooltip-paragraph-fold">If a non-existent destination path is specified, it will be created.</div>
	<div class="tr tooltip-paragraph-fold">If uploaded files already exist along the destination path, they will be overwritten.</div>
	<div class="tr tooltip-paragraph-fold">If a resource is specified in the "File or folder path" parameter, instead of the content of the resource will indicate its location.</div>
	<div class="tr tooltip-paragraph-last-fold">If an error occurred while execute action, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd",use_timeout: true, visible:true}) %>
