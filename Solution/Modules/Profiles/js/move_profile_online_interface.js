<div class="container-fluid filewrite">
    <%= _.template($('#input_constructor').html())({id:"Name", description:tr("Profile name"), default_selector: "string", disable_int:true, value_string:"New profile"}) %>
    <%= _.template($('#variable_constructor').html())({id:"Save", description:tr("Variable To Save Result"), default_variable: "NEW_PROFILE_ID"}) %>

</div>
<%= _.template($('#back').html())({action:"executeandadd", visible:true}) %>