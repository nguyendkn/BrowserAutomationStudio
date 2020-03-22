<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"ProfileId", description:tr("Online profile id"), default_selector: "string", disable_int:true, value_string: "", help: {description: tr("Multilogin profile id"), examples:[{code:"ad5ba41d-9f24-48b9-8ae6-f8c2540f24b3",description:tr("profile id example")},{code:tr("Empty string"), description:tr("Deletes current profile")}]} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Removes online profile.</div>
	<div class="tr tooltip-paragraph-fold">Available only for Multilogin browser.</div>
	<div class="tr tooltip-paragraph-fold">You can delete current profile if you run it with empty profile path. This will stop browser. After deleting current profile, profile path will be swithed to default.</div>
	<div class="tr tooltip-paragraph-last-fold">This action won't stop browser, only if you delete current profile.</div>
</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
