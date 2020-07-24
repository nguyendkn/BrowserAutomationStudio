<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"ArchivePath", description:tr("Archive path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the archive from which needs to get the list of files."),examples:[{code:"C:/test/ImapCustom.zip"},{code:"D:\\test\\CaptchaCustom.zip"},{code:"C:/Program Files/test.rar"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"ArchiveType", description:tr("Archive type"), default_selector: "string", variants: ["auto","zip","7zip","rar"], disable_int:true, value_string: "auto", help: {description:tr("The archive type is usually written in the file extension. But there are exceptions, such as Chrome extensions files have the extension .crx, but are zip archive with additional headers."),examples:[{code:"auto", description: tr("The archive type will be determined by the file extension")}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("List of files"), default_variable: "ARCHIVE_FILES", help: {description: tr("Variable in which, after successful completion of the action, will be recorded list of files contained in the archive.")}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Get a list of files contained in the archive.</div>
	<div class="tr tooltip-paragraph-last-fold">This action only works with zip archives.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
