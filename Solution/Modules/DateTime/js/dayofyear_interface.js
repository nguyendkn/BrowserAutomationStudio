<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"String", description:tr("Datetime or string"), default_selector: "string", disable_int:true}) %>
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Day of year. From 1 to 366."), default_variable: "DAY_OF_YEAR"}) %>
</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>