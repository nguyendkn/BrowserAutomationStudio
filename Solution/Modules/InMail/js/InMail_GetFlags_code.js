_call_function(_InMail.getFlags, {uid: (<%= uid %>)<%if(box!=='""'){%>, box: (<%= box %>)<%}%>})!
<%= variable %> = _result_function();
