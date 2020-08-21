<div class="container-fluid">
    <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "PROJECT_PATH"}) %>
</div>
<div class="tooltipinternal">
    <div class="tr tooltip-paragraph-first-fold">Get the full path to the project file.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>