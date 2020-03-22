<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"Id", description:tr("Online profile id"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Multilogin profile id"), examples:[{code:"ad5ba41d-9f24-48b9-8ae6-f8c2540f24b3",description:tr("profile id example")}]}
}) %>
</div>

<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Tells browser to load profile data(cookies, localstorage, cache) from cloud.</div>
	<div class="tr tooltip-paragraph-fold">Online profiles may be accessed manually later, from Multilogin interface.</div>
	<div class="tr tooltip-paragraph-fold">Available only for Multilogin browser.</div>
	<div class="tr tooltip-paragraph-fold">Number of online profiles is limited and depends on your license, unlike local profiles.</div> 
	<div class="tr tooltip-paragraph-fold">Profile must be created beforehand to use in this action, if you want to create it automatically, use "Create online profile" action.</div> 
	<div class="tr tooltip-paragraph-fold">Online profiles can be found by id, you can find it in Multilogin interface manually or with "Search for single online profile" or "Search online profile list" actions automatically.</div>
	<div class="tr tooltip-paragraph-last-fold">If you want to do certain actions on all online profiles, create new resource and place all profile ids there. Best place to do that is OnApplicationStart function because it is executed only once and you don't want to repeat it in each thread. After that, you can use new resources in the same way as any other, BAS will distribute them across threads and prevent them to be reused.</div>
</div>


<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>