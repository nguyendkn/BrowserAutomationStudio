var parse_res = _path.parse(<%= path %>);
<%= root %> = _avoid_nilb(parse_res["root"], "");
<%= dir %> = _avoid_nilb(parse_res["dir"], "");
<%= base %> = _avoid_nilb(parse_res["base"], "");
<%= ext %> = _avoid_nilb(parse_res["ext"], "");
<%= name %> = _avoid_nilb(parse_res["name"], "");
