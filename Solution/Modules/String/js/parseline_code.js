var csv_parse_result = csv_parse(<%= value %>)
<% for(var i = 0;i < list.length; i++){ %>
	VAR_<%= list[i] %> = csv_parse_result[<%= i %>]
	if(typeof(VAR_<%= list[i] %>) == 'undefined' || !VAR_<%= list[i] %>){
		VAR_<%= list[i] %> = ""
	}
<% } %>
