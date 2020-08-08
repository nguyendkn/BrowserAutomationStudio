_call_function(FTP_RunCommand,{ "Command": (<%= Command %>),"Timeout": (<%= timeout_value() || 60000 %>) })!
var results = _result_function();
<%= Standart %> = results[0];
<%= Error %> = results[1];
