var parse_res = _path.parse(<%= path %>);
<%= root %> = _avoid_nil(parse_res["root"]);
<%= dir %> = _avoid_nil(parse_res["dir"]);
<%= base %> = _avoid_nil(parse_res["base"]);
<%= ext %> = _avoid_nil(parse_res["ext"]);
<%= name %> = _avoid_nil(parse_res["name"]);
