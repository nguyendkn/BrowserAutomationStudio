<% if(isspintax && istemplate){ %>
	_template(<%= template %>)!
	<%= variable %> = _spintax(_result()).replace("BASASYNC","\)\!")
<% } %>
<% if(!isspintax && istemplate){ %>
	_template(<%= template %>)!
	<%= variable %> = _result().replace("BASASYNC","\)\!")
<% } %>

<% if(isspintax && !istemplate){ %>
	<%= variable %> = _spintax(<%= template %>)
<% } %>

<% if(!isspintax && !istemplate){ %>
	<%= variable %> = <%= template %>
<% } %>