<div class="container-fluid" style="padding-top:35px">
	<%= _.template($('#variable_constructor').html())({id:"Variable", description:tr("Variable With List"), default_variable: ""}) %>
</div>
<div class="tooltipinternal">
    <div class="tr tooltip-paragraph-first-fold">Sort the elements of the specified list.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>
