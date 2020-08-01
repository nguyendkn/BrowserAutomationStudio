<div class="container-fluid">
<%= _.template($('#input_constructor').html())({id:"Protocol", description:tr("Protocol"), default_selector: "string", variants:["SFTP","FTP","SSH<br/><span style='color:gray;font-size:small'>(SCP)</span>"], disable_int:true, value_string: "SFTP", help: {description: tr("The protocol by which the connection to the remote server will be made.")} }) %>
<%= _.template($('#input_constructor').html())({id:"Host", description:tr("Host name"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Host (URL or IP) of the remote server."),examples:[{code:"ftp.site.com"},{code:"ftp15.testsite.com"},{code:"96.256.27.26"}]} }) %>
<%= _.template($('#input_constructor').html())({id:"Port", description:tr("Port"), default_selector: "string", disable_int:true, value_string: "22", help: {description: tr("Port of the remote server."),examples:[{code:"21",description:tr("Default port for FTP protocol")},{code:"22",description:tr("Default port for SFTP and SSH protocols")}]} }) %>
<%= _.template($('#input_constructor').html())({id:"Username", description:tr("Username"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Username of the remote server.")} }) %>
<%= _.template($('#input_constructor').html())({id:"Password", description:tr("Password"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Password of the remote server.")} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Configure access to a remote server for working with files.</div>
	<div class="tr tooltip-paragraph-last-fold">This action should be called once before any other action that works with the remote server.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
