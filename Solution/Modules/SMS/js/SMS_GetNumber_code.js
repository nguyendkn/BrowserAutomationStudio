_call_function(_SMS_GetNumber,{service:(<%= service %>),apiKey:(<%= apiKey %>),site:(<%= site %>),country:(<%= country %>)<%if(customSite!=='""'){%>,customSite:(<%= customSite %>)<%}%><%if(customCountry!=='""'){%>,customCountry:(<%= customCountry %>)<%}%><%if(serverUrl!=='""'){%>,serverUrl:(<%= serverUrl %>)<%}%>})!
<%= variable %> = _result_function();
