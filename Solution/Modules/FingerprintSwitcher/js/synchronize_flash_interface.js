<div class="container-fluid">
  <%= _.template($('#input_constructor').html())({id:"Fingerprint", description:tr("Fingerprint"), default_selector: "string", disable_int:true, help: 
	{
		description: tr("This value must contain fingerprint string. Fingerprint string contains all data necessary to change fingerprint. It can be obtained as result of 'Get fingerprint' action. Note that this value may be reused - if you store it into file or database, and load on next BAS start, it will still work.")
	}}) %>
</div>

<div class="tooltipinternal">
      <div class="tr tooltip-paragraph-first-fold">Enable flash if fingerprint has it enabled and disable otherwise.</div>
      <div class="tr tooltip-paragraph-last-fold">This action will restart browser process and thereby reset all settings(proxies, headers, etc), so the best place to use this action is thread start.</div>
</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
