<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"String", description:tr("Datetime string"), default_selector: "string", disable_int:true}) %>
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "TIMEZONE_IN_MINUTES"}) %>

</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>