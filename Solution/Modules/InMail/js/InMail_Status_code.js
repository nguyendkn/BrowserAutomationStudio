_call_function(_InMail.status, {name: (<%= name %>)})!
var boxInfo = _result_function();
<%= total %> = boxInfo["messages"]["total"];
<%= recent %> = boxInfo["messages"]["new"];
<%= unseen %> = boxInfo["messages"]["unseen"];
