<% if(isspintax && istemplate){ %>
	_template(<%= template %>)!
	<%= variable %> = _spintax(_avoid_nil(_result())).replace("BASASYNC","\)\!")
<% } %>
<% if(!isspintax && istemplate){ %>
	_template(<%= template %>)!
	<%= variable %> = _avoid_nil(_result()).replace("BASASYNC","\)\!")
<% } %>

<% if(isspintax && !istemplate){ %>
	<%= variable %> = _spintax(<%= template %>)
<% } %>

<% if(!isspintax && !istemplate){ %>
	<%= variable %> = <%= template %>
<% } %>