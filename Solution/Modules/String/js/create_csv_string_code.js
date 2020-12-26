<%= variable %> = _csv_generate([_avoid_nil(<%= item1 %>), _avoid_nil(<%= item2 %>), _avoid_nil(<%= item3 %>)].concat(_to_arr(_avoid_nil(<%= items_list %>)) || []), <%= separator %>);
