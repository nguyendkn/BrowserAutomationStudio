<%= variable %> = _concat_strings([_avoid_nil(<%= string1 %>), _avoid_nil(<%= string2 %>), _avoid_nil(<%= string3 %>)].concat(_to_arr(_avoid_nil(<%= strings_list %>)) || []), <%= separator %>);
