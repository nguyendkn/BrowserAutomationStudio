<div class="container-fluid filewrite">
    <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Profile id"), default_variable: "CURRENT_PROFILE_ID", help: {description: tr("Filepath in case of you are using local profile and profile id in case of you are using online profile.")}}) %>
    <%= _.template($('#variable_constructor').html())({id:"Save2", description:tr("Is online profile"), default_variable: "IS_ONLINE_PROFILE", help: {description: tr("Boolean value, if current profile is online profile.")}}) %>
    <%= _.template($('#variable_constructor').html())({id:"Save3", description:tr("Has fingerprint"), default_variable: "HAS_FINGERPRINT", help: {description: tr("Boolean value, if current profile has fingerprint. It can be applied automatically with 'Create or switch to local profile' action.")}}) %>
</div>


<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Return information about current profile.</div>
	<div class="tr tooltip-paragraph-fold">Profile id is filepath in case of you are using local profile and profile id in case of you are using online profile.</div>
	<div class="tr tooltip-paragraph-fold">IS_ONLINE_PROFILE variable contains boolean value(true or false).</div> 
	<div class="tr tooltip-paragraph-last-fold">This action doesn't create browser, returns immediately and can be used from any place of script.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
