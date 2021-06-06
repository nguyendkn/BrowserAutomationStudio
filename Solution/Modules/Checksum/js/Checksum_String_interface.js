<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"input", description:tr("String"), default_selector: "string", disable_int:true, value_string: "", help: {description: ""} }) %>
	<%= _.template($('#input_constructor').html())({id:"algorithm", description:tr("Algorithm"), default_selector: "string", variants:["crc16","crc32","md4","md5","mdc2","ripemd160","whirlpool","sha1","sha224","sha256","sha384","sha512","sha3-224","sha3-256","sha3-384","sha3-512","shake128","shake256"], disable_int:true, value_string: "sha512", help: {description: ""} }) %>
	<%= _.template($('#block_start').html())({id:"Additional", name: tr("Additional settings"), description: ""}) %>
		<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
			<input type="checkbox" id="Check" style="margin-left:25px" onclick="set_encoding_visible();"/> <label for="Check" class="tr">Is base64 encoded</label>
		</span>
		<%= _.template($('#input_constructor').html())({id:"encoding", description:tr("Encoding"), default_selector: "string", variants:["utf-8","ascii","hex","base64","utf-16le","latin1","base64url"], disable_int:true, value_string: "utf-8", help: {description: ""} }) %>
	<%= _.template($('#block_end').html())() %>
	<%= _.template($('#input_constructor').html())({id:"outputFormat", description:tr("Output format"), default_selector: "string", variants:["hex encoded","base64 encoded"], disable_int:true, value_string: "hex encoded", help: {description: ""} }) %>
	<%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable to save the result"), default_variable: "STRING_CHECKSUM", help: {description: ""}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Calculate the checksum of the specified string.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", use_timeout:true, visible:true}) %>
<%= "<s" + "cript>" %>

	function set_encoding_visible(){
		document.querySelectorAll("[data-preserve-id=encoding]")[0].style = 'display:' + ($("#Check").is(':checked') ? 'none' : 'block');
	};
	
	set_encoding_visible();

<%= "</" + "script>" %>
