<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"ArchivePath", description:tr("Archive path"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the zip archive which needs to be unpacked."),examples:[{code:"C:/test/ImapCustom.zip"},{code:"D:\\test\\CaptchaCustom.zip"},{code:"C:/Program Files/test.zip"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"DestinationFolder", description:tr("Destination folder path") + ". " + tr("Can be blank"), default_selector: "string", disable_int:true, value_string: "", help: {description:tr("The path to the folder into which the contents of the archive will be unpacked."),examples:[{code:"C:/test"},{code:"D:\\test"},{code:"C:/Program Files"},{code:tr("Empty string"), description: tr("The folder in which the archive is located")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Unpack the contents of the zip archive to the specified folder.</div>
	<div class="tr tooltip-paragraph-fold">If the path to destination folder is not specified, the archive will be unpacked to the folder in which it is located.</div>
	<div class="tr tooltip-paragraph-fold">This action only works with zip archives.</div>
	<div class="tr tooltip-paragraph-last-fold">The names of the files contained in the archive must consist only of Latin characters, otherwise they will be distorted.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
