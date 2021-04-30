<div class="container-fluid">
	<%= _.template($('#input_constructor').html())({id:"number", description:tr("Number"), default_selector: "string", disable_int: true, value_string: "", help: {description: tr("Number")} }) %>
	<%= _.template($('#input_constructor').html())({id:"status", description:tr("Status"), default_selector: "string", variants:["-1", "1", "3", "6", "8"], disable_int:true, disable_expression:true, disable_editor:true, disable_variable:true, disable_resource:true, help: {description: tr("Status")} }) %>
</div>
<div class="tooltipinternal">
	<div class="tr tooltip-paragraph-first-fold">Change the activation status for the specified number.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>

<%= "<s" + "cript>" %>
	$(document).ready(function(){
		$('.divider').hide();
		$('#status').attr('readonly', true);
	});
<%= "</" + "script>" %>