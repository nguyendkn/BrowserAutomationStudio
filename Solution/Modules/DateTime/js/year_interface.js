<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"String", description:tr("Datetime or string"), default_selector: "string", disable_int:true}) %>
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Year"), default_variable: "YEAR"}) %>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>