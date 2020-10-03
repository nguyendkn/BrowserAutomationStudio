_call_function(SQL_Query,{ "query": (<%= query %>),"type": (<%= type %>),"parameterize": (<%= parameterize %>),"timeout": (<%= timeout_value() || 60000 %>) })!
var res = _result_function();
<%= results %> = res[0];
<%= metadata %> = res[1];
