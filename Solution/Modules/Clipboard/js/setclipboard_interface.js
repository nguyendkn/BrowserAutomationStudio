<div class="container-fluid">
    <%= _.template($('#input_constructor').html())({id:"Value", description:tr("Data"), default_selector: "string", disable_int:true}) %>
    <%= _.template($('#input_constructor').html())({id:"MimeType", description:tr("Mime Type"), default_selector: "string", disable_int:true, value_string: "text/plain", variants:["text/plain", "text/html"]}) %>
    
    <span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
      <div><input type="checkbox" id="Check"/> <label for="Check" class="tr">Data Is In Base64 Format</label></div>
    </span>

</div>
<div class="tooltipinternal tr">Clipboard is global to whole system and should be locked in multithreaded mode.</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>