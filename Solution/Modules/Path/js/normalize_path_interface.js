<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"path", description: tr("Path"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("The path that need to normalize."),examples:[{code:"C:\\temp\\\\foo\\bar\\..\\"},{code:"C:////temp\\\\/\\/\\/foo/bar"},{code:"/foo/bar//baz/asdf/quux/.."}]} }) %>
<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "NORMALIZED_PATH", help: {description: tr("Variable in which, after successful execution of the action, the normalized path will be written."), examples:[{code:"C:/temp/foo/",description:tr("Path") + ": <code style=\"font-size:85%\">C:\\temp\\\\foo\\bar\\..\\</code>"},{code:"C:/temp/foo/bar",description:tr("Path") + ": <code style=\"font-size:85%\">C:////temp\\\\/\\/\\/foo/bar</code>"},{code:"/foo/bar/baz/asdf",description:tr("Path") + ": <code style=\"font-size:85%\">/foo/bar//baz/asdf/quux/..</code>"}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Normalize path.</div>
	<div class="tr tooltip-paragraph-fold">This will return the normalized path, multiple slashes will be replaced with single ones, backslashes "&#92;" will be replaced with regular "/", segments ".." and "." will be resolved.</div>
	<div class="tr tooltip-paragraph-fold">For example, if the path <code>"C:////temp&#92;&#92;/&#92;/&#92;/foo/bar/.."</code> is specified, then the action will return <code>"C:/temp/foo"</code>.</div>
	<div class="tr tooltip-paragraph-last-fold">If the "Path" parameter is not a string, the thread will stop with fail message. If you want to continue thread, use "Ignore errors" action.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
