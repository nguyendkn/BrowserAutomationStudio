<div class="container-fluid httpclientgetheader">
      <%= _.template($('#input_constructor').html())({id:"DecreasingString", description:tr("Decreasing datetime or string"), default_selector: "string", disable_int:true}) %>
      <%= _.template($('#input_constructor').html())({id:"SubtractedString", description:tr("Subtracted datetime or format"), default_selector: "string", disable_int:true}) %>
      
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "DATE_DIFFERENCE_IN_SECONDS"}) %>
      

</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>