<div class="container-fluid" style="padding-top:35px">
	<%= _.template($('#variable_constructor').html())({id:"Variable", description:tr("Variable With List"), default_variable: ""}) %>
    <%= _.template($('#variable_constructor').html())({id:"VariableNewList", description:tr("New List"), default_variable: "NEW_LIST"}) %>
</div>
<div class="tooltipinternal">
    <div class="tr tooltip-paragraph-first-fold">Get a full copy of the specified list.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
