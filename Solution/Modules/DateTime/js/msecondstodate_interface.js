<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"String", description:tr("Milliseconds since epoch"), default_selector: "string", disable_int:true}) %>
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "DATE_FROM_MILLISECONDS"}) %>

</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>