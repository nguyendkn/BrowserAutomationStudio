<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"String", description:tr("Datetime string"), default_selector: "string", disable_int:true}) %>
      <%= _.template($('#input_constructor').html())({id:"Format", description:tr("Datetime format"), default_selector: "string", disable_int:true, value_string: "auto", variants: ["auto","yyyy-MM-dd","hh:mm:ss","yyyy-MM-ddThh:mm:ss"]}) %>
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "PARSED_DATE"}) %>
      <a onclick="BrowserAutomationStudio_OpenUrl('http://doc.qt.io/qt-5/qdatetime.html#fromString')" class="tr" style="margin-left: 20px;cursor: pointer;">Formatting dates</a>

</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>