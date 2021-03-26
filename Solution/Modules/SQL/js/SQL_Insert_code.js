_call_function(SQL_Insert,{ "table": (<%= table %>),"fields": (<%= fields %>),"data": (<%= data %>),"timeout": (<%= timeout_value() || 60000 %>) })!
