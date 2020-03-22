<div class="container-fluid filewrite">
    <%= _.template($('#input_constructor').html())({id:"Mask", description:tr("Mask for profile name"), default_selector: "string", disable_int:true, value_string:"*", help: {description: tr("Mask, which is applied to profile name"), examples:[{code:"*",description:tr("Find all profiles")},{code:"gmail",description:tr("Find profiles, which have string \"gmail\" in name")}]}}) %>
    <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save Result"), default_variable: "PROFILES_SEARCH_RESULT", help: {description: tr("After acton finishes, this variable will contain list of strings, each string contains profile id and profile name separated with colon. For example, [\"ad5ba41d-9f24-48b9-8ae6-f8c2540f24b3:test\", \"91fb1e72-1edb-413f-bdd7-6e7f1b945a24:test2\"]")}
}) %>

</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Searches several online profiles by name.</div>
	<div class="tr tooltip-paragraph-fold">Available only for Multilogin browser.</div>
	<div class="tr tooltip-paragraph-fold">Name can contain special symbols. * - any number of any characters, ? - any single character.</div>
	<div class="tr tooltip-paragraph-fold">This action returns list of strings, each string contains profile id and profile name separated with colon.</div>
	<div class="tooltip-paragraph-fold"><span class="tr">Use "Foreach" action to go over each profile and "Parse Line" action to separate profile id and profile name</span>, <a href="#" onclick="BrowserAutomationStudio_OpenUrl('https://wiki.bablosoft.com/lib/exe/fetch.php?cache=&media=iterateprofiles.png');return false" class="tr">screen</a></div>
	<div class="tr tooltip-paragraph-last-fold">If you want to do certain actions on all online profiles, create new resource and place all profile ids there. Best place to do that is OnApplicationStart function because it is executed only once and you don't want to repeat it in each thread. After that, you can use new resources in the same way as any other, BAS will distribute them across threads and prevent them to be reused.</div>
</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>