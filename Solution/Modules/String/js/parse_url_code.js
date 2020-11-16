var parse_res = new _url(<%= string %>);
<%= protocol %> = _avoid_nilb(parse_res["protocol"], "").split(':')[0];
<%= username %> = _avoid_nilb(parse_res["username"], "");
<%= password %> = _avoid_nilb(parse_res["password"], "");
<%= host %> = _avoid_nilb(parse_res["host"], "");
<%= port %> = _avoid_nilb(parse_res["port"], "");
<%= path %> = _avoid_nilb(parse_res["pathname"], "");
<%= query %> = _avoid_nilb(parse_res["query"], "");
<%= fragment %> = _avoid_nilb(parse_res["hash"], "");
