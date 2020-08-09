<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"Protocol", description:tr("Protocol"), default_selector: "string", variants:["SFTP","FTP","SSH<br/><span style='color:gray;font-size:small'>SCP</span>"], disable_int:true, value_string: "SFTP", help: {description: tr("The protocol by which the connection to the remote server will be made.")} }) %>
<%= _.template($('#input_constructor').html())({id:"Host", description:tr("Host name"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Host (URL or IP) of the remote server."),examples:[{code:"ftp.site.com"},{code:"ftp15.testsite.com"},{code:"96.256.27.26"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"Port", description:tr("Port"), default_selector: "string", disable_int:true, value_string: "22", help: {description: tr("Port of the remote server."),examples:[{code:"21",description:tr("Default port for FTP protocol")},{code:"22",description:tr("Default port for SFTP and SSH protocols")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"Username", description:tr("Username"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Username of the remote server.")} }) %>
<%= _.template($('#input_constructor').html())({id:"Password", description:tr("Password"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Password of the remote server.")} }) %>
<%= _.template($('#input_constructor').html())({id:"Timeout", description:tr("Timeout (seconds)"), default_selector: "int", disable_string:true, value_number: 300, min_number:0, max_number:999999, help: {description: tr("The time after which the connection will be closed if it is not in use.")} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Configure access to a remote server for working with files.</div>
	<div class="tr tooltip-paragraph-fold">This action should be called once before any other action that works with the remote server.</div>
	<div class="tr tooltip-paragraph-fold">FTP (File Transfer Protocol) is a standard network protocol used to transfer files between a client and a server.</div>
	<div class="tr tooltip-paragraph-fold">SFTP (SSH File Transfer Protocol) is a network protocol used to securely transfer files between a client and server over SSH.</div>
	<div class="tr tooltip-paragraph-fold">SSH (Secure Shell) is a cryptographic network protocol that encrypts all traffic, allowing remote control of the operating system and tunneling TCP connections (for example, for file transfer).</div>
	<div class="tr tooltip-paragraph-last-fold">Each action except this and "Close connection" open new or uses an already opened connection. The connection is automatically closed by timeout if it is not used.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
