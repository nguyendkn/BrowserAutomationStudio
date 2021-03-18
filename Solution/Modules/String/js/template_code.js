<% if(isspintax && istemplate){ %>
	_template(<%= template %>)!
	var templateResult = _result() != null ? _result().toString() : "";
	<%= variable %> = _spintax(templateResult).replace("BASASYNC","\)\!")
<% } %>
<% if(!isspintax && istemplate){ %>
	_template(<%= template %>)!
	var templateResult = _result() != null ? _result().toString() : "";
	<%= variable %> = templateResult.replace("BASASYNC","\)\!")
<% } %>

<% if(isspintax && !istemplate){ %>
	<%= variable %> = _spintax(<%= template %>)
<% } %>

<% if(!isspintax && !istemplate){ %>
	<%= variable %> = <%= template %>
<% } %>