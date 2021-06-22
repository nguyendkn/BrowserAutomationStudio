_call_function(_SMS.getSites,{service:(<%= service %>),apiKey:(<%= apiKey %>)<%if(serverUrl!=='""'){%>,serverUrl:(<%= serverUrl %>)<%}%>})!
<%= variable %> = _result_function();
