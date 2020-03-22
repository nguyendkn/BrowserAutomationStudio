<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"Name", description:tr("Online profile name"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Any string with profile name. Multilogin allows to have several accounts with same names, but best practice is to create accounts with meaningful unique names.")}}) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Tells browser to create profile in cloud and store browser data(cookies, localstorage, cache, fingerprint) there.</div>
	<div class="tr tooltip-paragraph-fold">Online profiles may be accessed manually later, from Multilogin interface.</div>
	<div class="tr tooltip-paragraph-fold">Available only for Multilogin browser.</div>
	<div class="tr tooltip-paragraph-fold">Number of online profiles is limited and depends on your license, unlike local profiles.</div> 
	<div class="tr tooltip-paragraph-fold">This action not only creates profile, but also starts using it by current thread immediately after creation.</div> 
	<div class="tr tooltip-paragraph-fold">Online profiles can be found by id, you can find it in Multilogin interface manually or with "Search for single online profile" or "Search online profile list" actions automatically.</div>
	<div class="tr tooltip-paragraph-last-fold">If you want to do certain actions on all online profiles, create new resource and place all profile ids there. Best place to do that is OnApplicationStart function because it is executed only once and you don't want to repeat it in each thread. After that, you can use new resources in the same way as any other, BAS will distribute them across threads and prevent them to be reused.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>