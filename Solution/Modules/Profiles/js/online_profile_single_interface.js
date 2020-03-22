<div class="container-fluid filewrite">
    <%= _.template($('#input_constructor').html())({id:"Mask", description:tr("Mask for profile name"), default_selector: "string", disable_int:true, value_string:"*", help: {description: tr("Mask, which is applied to profile name"), examples:[{code:"*",description:tr("Find any profile")},{code:"gmail",description:tr("Find profile, which has string \"gmail\" in name")}]} }) %>
    <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save Result"), default_variable: "FOUND_PROFILE_ID", help: {description: tr("Multilogin profile id"), examples:[{code:"ad5ba41d-9f24-48b9-8ae6-f8c2540f24b3",description:tr("profile id example")}]}}) %>

</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Searches single online profile by name.</div>
	<div class="tr tooltip-paragraph-fold">Available only for Multilogin browser.</div>
	<div class="tr tooltip-paragraph-fold">Name can contain special symbols. * - any number of any characters, ? - any single character.</div>
	<div class="tr tooltip-paragraph-last-fold">This action returns profile id, it can be used to switch to found profile or delete it.</div>
</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>