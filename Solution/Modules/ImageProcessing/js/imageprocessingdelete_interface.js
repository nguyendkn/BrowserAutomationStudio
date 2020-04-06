<div class="container-fluid">
    <%= _.template($('#input_constructor').html())({id:"Id", description:tr("Image id"), default_selector: "string", disable_int:true}) %>
</div>
<div class="tooltipinternal">
    <div class="tr tooltip-paragraph-first-fold">Finish working with the specified image using its id.</div>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>