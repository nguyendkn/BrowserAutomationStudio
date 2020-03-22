<div class="container-fluid httpclientgetheader">
      <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save"), default_variable: "DATE_NOW"}) %>

</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>