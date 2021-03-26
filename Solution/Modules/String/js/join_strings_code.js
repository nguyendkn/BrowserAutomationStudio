<%= variable %> = _join_strings(<%
	var u1 = string1!=='""'
	var u2 = string2!=='""'
	var u3 = string3!=='""'
	var u4 = strings_list!=='""'
	if(u1 || u2 || u3){
		%>[<%
			if(u1){
				%>_avoid_nil(<%= string1 %>)<%
			}
			if(u1 && u2){
				%>, <%
			}
			if(u2){
				%>_avoid_nil(<%= string2 %>)<%
			}
			if(u3 && (u1 || u2)){
				%>, <%
			}
			if(u3){
				%>_avoid_nil(<%= string3 %>)<% 
			}
		%>]<%
		if(u4){
			%>.concat(<%
		}
	}
	if(u4){
		%>_to_arr(_avoid_nilb(<%= strings_list %>, []))<%
		if(u1 || u2 || u3){
			%>)<%
		}
	}
%>, <%= separator %>);
