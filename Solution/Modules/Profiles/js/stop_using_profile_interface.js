<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">By default BAS browser stores all profile data in temporary folder. This actions restores default values for profile location.</div>
	<div class="tr tooltip-paragraph-fold">Switching profile requires browser restart, so this action may restart browser in case if it exists. Restarting browser will also reset all browser settings.</div>
	<div class="tr tooltip-paragraph-last-fold">Old profile data won't be deleted.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>