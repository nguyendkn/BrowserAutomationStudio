_call_function(Checksum_String,{"input":(<%= input %>), "algorithm":(<%= algorithm %>), "base64":(<%= base64 %>), "encoding":(<%= encoding %>), "outputFormat":(<%= outputFormat %>), "timeout":(<%= timeout_value() || 60000 %>)})!
<%= variable %> = _result_function();
