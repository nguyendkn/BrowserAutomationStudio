<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"String", description:tr("Datetime or string"), default_selector: "string", disable_int:true}) %>
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Day of week. From 1 to 7."), default_variable: "DAY_OF_WEEK"}) %>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>