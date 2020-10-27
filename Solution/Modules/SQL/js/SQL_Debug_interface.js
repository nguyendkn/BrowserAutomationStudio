<div class="container-fluid">
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
	<div><input type="radio" id="Check"  name="filetype" checked/> <label for="Check" class="tr">Enable debug</label></div>
</span>
<span data-preserve="true" data-preserve-type="check" data-preserve-id="Check2">
	<div><input type="radio" id="Check2"  name="filetype"/> <label for="Check2" class="tr">Disable debug</label></div>
</span>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Enable or disable debug.</div>
	<div class="tr tooltip-paragraph-last-fold">If debug is enabled, all queries and their results will be displayed in the log.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
