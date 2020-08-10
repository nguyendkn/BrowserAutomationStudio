<div class="container-fluid"></div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Close FTP/SSH connection.</div>
	<div class="tr tooltip-paragraph-fold">If the connection is already closed or not open yet, this action will do nothing.</div>
	<div class="tr tooltip-paragraph-last-fold">This action is optional because the connection is closed automatically by the timeout specified in the "Configure FTP/SSH" action if it is not used.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
