<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"File1", description:tr("File") + " 1. " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The path to the file which needs to archive.")} }) %>
<%= _.template($('#input_constructor').html())({id:"File2", description:tr("File") + " 2. " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The path to the file which needs to archive.")} }) %>
<%= _.template($('#input_constructor').html())({id:"File3", description:tr("File") + " 3. " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The path to the file which needs to archive.")} }) %>
<%= _.template($('#input_constructor').html())({id:"ListOfFiles", description:tr("List of files") + ". " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("A list of paths to the files which needs to archive.")} }) %>
<%= _.template($('#input_constructor').html())({id:"ArchiveType", description:tr("Archive type"), default_selector: "string", variants: ["auto","zip","7z","rar"], disable_int:true, value_string: "auto", help: {description:tr("The archive type is usually written in the file extension. But there are exceptions, such as Chrome extensions files have the extension .crx, but are zip archive with additional headers."),examples:[{code:"auto", description: tr("The archive type will be determined by the file extension") + " " + tr("in the destination path")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"DestinationPath", description:tr("Destination path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the location where the archive will be saved."),examples:[{code:"C:/test.zip"},{code:"D:\\test\\archive.rar"},{code:"C:/Program Files/test.7z"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Archive files and save the archive to the specified location.</div>
	<div class="tr tooltip-paragraph-fold">Files from separate fields and the list are added to a general list of files that will be archived.</div>
	<div class="tr tooltip-paragraph-fold">For example, if a file is specified in the "File 1" field and a list of 4 files is specified in the "List of files" field, then 5 files will be archived.</div>
	<div class="tr tooltip-paragraph-fold">This action can archive not only files, but also folders.</div>
	<div class="tr tooltip-paragraph-last-fold">This action only works with zip archives.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>