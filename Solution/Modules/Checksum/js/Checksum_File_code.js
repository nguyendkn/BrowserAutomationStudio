_call_function(Checksum_File,{"filePath":(<%= filePath %>), "algorithm":(<%= algorithm %>), "outputFormat":(<%= outputFormat %>), "timeout":(<%= timeout_value() || 60000 %>)})!
<%= variable %> = _result_function()
