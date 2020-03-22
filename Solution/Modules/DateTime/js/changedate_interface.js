<div class="container-fluid httpclientgetheader">
	  <%= _.template($('#input_constructor').html())({id:"String", description:tr("Datetime string"), default_selector: "string", disable_int:true}) %>
      
      <%= _.template($('#input_constructor').html())({id:"Year", description:tr("Year"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  <%= _.template($('#input_constructor').html())({id:"Month", description:tr("Month. From 1 to 12"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  <%= _.template($('#input_constructor').html())({id:"Day", description:tr("Day. From 1 to 31"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  <%= _.template($('#input_constructor').html())({id:"Hour", description:tr("Hour. From 0 to 23"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  <%= _.template($('#input_constructor').html())({id:"Minute", description:tr("Minute. From 0 to 59"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  <%= _.template($('#input_constructor').html())({id:"Second", description:tr("Second. From 0 to 59"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  <%= _.template($('#input_constructor').html())({id:"Millisecond", description:tr("Millisecond. From 0 to 999"), default_selector: "int", disable_string:true, value_number: -1}) %>
	  
	  <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "CHANGED_DATE"}) %>
	  
      

</div>
<div class="tooltipinternal tr">This action can change year or month or other properties of date. Leave parameter to -1 if you dont want to change it.</div>

<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>