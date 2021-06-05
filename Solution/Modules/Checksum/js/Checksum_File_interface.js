<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"filePath", description:tr("File path"), default_selector: "string", disable_int:true, value_string: "", help: {description: ""} }) %>
	<%= _.template($('#input_constructor').html())({id:"algorithm", description:tr("Algorithm"), default_selector: "string", variants:["md4","md5","mdc2","ripemd160","ripemd160","whirlpool","sha1","sha224","sha256","sha384","sha512","sha3-224","sha3-256","sha3-384","sha3-512","shake128","shake256"], disable_int:true, value_string: "sha512", help: {description: ""} }) %>
	<%= _.template($('#input_constructor').html())({id:"outputFormat", description:tr("Output format"), default_selector: "string", variants:["hex encoded","base64 encoded"], disable_int:true, value_string: "hex encoded", help: {description: ""} }) %>
	<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "FILE_CHECKSUM", help: {description: ""}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Calculate the checksum of the specified file.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", use_timeout:true, visible:true}) %>
