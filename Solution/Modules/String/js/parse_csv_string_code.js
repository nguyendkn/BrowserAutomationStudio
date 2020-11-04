var csv_res = _csv_parse(<%= string %>,<%= separators %>,<%= convert_types %>);
<% for(var i = 0;i < list.length; i++){ %>
	VAR_<%= list[i] %> = _is_nilb(csv_res[<%= i %>]) ? "" : csv_res[<%= i %>];
<% } %>
