_call_function(_SMS_GetBalance,{service:(<%= service %>),apiKey:(<%= apiKey %>)<%if(serverUrl!=='""'){%>,serverUrl:(<%= serverUrl %>)<%}%>})!
<%= variable %> = _result_function();
