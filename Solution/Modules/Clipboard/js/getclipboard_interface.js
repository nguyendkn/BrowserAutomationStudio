<div class="container-fluid">
  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "CLIPBOARD_CONTENT"}) %>
  <%= _.template($('#input_constructor').html())({id:"MimeType", description:tr("Mime Type"), default_selector: "string", disable_int:true, value_string: "text/plain", variants:["text/plain", "text/html"]}) %>

  <span data-preserve="true" data-preserve-type="check" data-preserve-id="Check">
    <input type="checkbox" id="Check"/> <label for="Check" class="tr">Save In Base64 Format</label>
  </span>

</div>
<div class="tooltipinternal tr" style="margin-bottom:5px">Clipboard is global to whole system and should be locked in multithreaded mode.</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>