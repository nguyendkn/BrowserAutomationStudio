<%= variable %> = _path.join(<%
	var u1 = path1!=='""'
	var u2 = path2!=='""'
	var u3 = path3!=='""'
	var u4 = paths_list!=='""'
	if(u1 || u2 || u3){
		%>[<%
			if(u1){
				%>_avoid_nil(<%= path1 %>)<%
			}
			if(u1 && u2){
				%>, <%
			}
			if(u2){
				%>_avoid_nil(<%= path2 %>)<%
			}
			if(u3 && (u1 || u2)){
				%>, <%
			}
			if(u3){
				%>_avoid_nil(<%= path3 %>)<% 
			}
		%>]<%
		if(u4){
			%>.concat(<%
		}
	}
	if(u4){
		%>_to_arr(_avoid_nilb(<%= paths_list %>, []))<%
		if(u1 || u2 || u3){
			%>)<%
		}
	}
%>);