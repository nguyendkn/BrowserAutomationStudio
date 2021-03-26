<%= variable %> = _csv_generate(<%
	var u1 = item1!=='""'
	var u2 = item2!=='""'
	var u3 = item3!=='""'
	var u4 = items_list!=='""'
	if(u1 || u2 || u3){
		%>[<%
			if(u1){
				%>_avoid_nil(<%= item1 %>)<%
			}
			if(u1 && u2){
				%>, <%
			}
			if(u2){
				%>_avoid_nil(<%= item2 %>)<%
			}
			if(u3 && (u1 || u2)){
				%>, <%
			}
			if(u3){
				%>_avoid_nil(<%= item3 %>)<% 
			}
		%>]<%
		if(u4){
			%>.concat(<%
		}
	}
	if(u4){
		%>_to_arr(_avoid_nilb(<%= items_list %>, []))<%
		if(u1 || u2 || u3){
			%>)<%
		}
	}
%>, <%= separator %>);
