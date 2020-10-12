_SQL_CONNECTION_ID = rand(10);
_SQL_CONFIG = {dialect:"", host:"", port:"", username:"", password:"", database:"", storage:""};
_SQL_CONNECTION_TIMEOUT = 5*60*1000;

function SQL_Setup(dialect, host, port, username, password, database, storage, timeout){
	_SQL_CONFIG["dialect"] = dialect;
	_SQL_CONFIG["host"] = host;
	_SQL_CONFIG["port"] = (port==="auto" || port==="") ? "" : Number(port);
	_SQL_CONFIG["username"] = username;
	_SQL_CONFIG["password"] = password;
	_SQL_CONFIG["database"] = database;
	_SQL_CONFIG["storage"] = SQL_FormatPath(storage);
	_SQL_CONNECTION_TIMEOUT = timeout*1000;
};
function SQL_Query(){
	var query = _function_argument("query");
	var query_type = _function_argument("type");
	var query_parameterize = _function_argument("query_parameterize");
	var timeout = _function_argument("timeout");
	
	SQL_CheckDialect();
	
	if(query_type==="auto"){
		query_type = ["SELECT", "INSERT", "UPDATE", "BULKUPDATE", "BULKDELETE", "DELETE", "UPSERT", "VERSION", "SHOWTABLES", "SHOWINDEXES", "DESCRIBE", "FOREIGNKEYS", "SHOWCONSTRAINTS"].filter(function(type){return query_sql.indexOf(type) > -1})[0] || "RAW";
	};
	
	_call_function(SQL_PreParameterization,{"query":query,"parameterize":query_parameterize})!
	query = _result_function();
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, query, query_type];
	
	_embedded("SQL_Query", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_SQL_NODE_PARAMETERS);
};
function SQL_CountRecords(){
	var table = _function_argument("table");
	var where = _function_argument("where");
	var where_parameterize = _function_argument("where_parameterize");
	var timeout = _function_argument("timeout");
	
	SQL_CheckDialect();
	
	_call_function(SQL_PreParameterization,{"query":where,"parameterize":where_parameterize})!
	where = _result_function();
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, table, where];
	
	_embedded("SQL_CountRecords", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_SQL_NODE_PARAMETERS);
};
function SQL_SelectRecords(){
	var table = _function_argument("table");
	var where = _function_argument("where");
	var where_parameterize = _function_argument("where_parameterize");
	var included_columns = SQL_ConvertToList(_function_argument("included_columns"));
	var excluded_columns = SQL_ConvertToList(_function_argument("excluded_columns"));
	var order_column = _function_argument("order_column");
	var order_direction = _function_argument("order_direction");
	var offset = _function_argument("offset");
	var limit = _function_argument("limit");
	var timeout = _function_argument("timeout");
	var order = order_direction=="no sorting" ? "" : [ [order_column, order_direction=="ascending" ? "ASC" : "DESC"] ];
	
	SQL_CheckDialect();
	
	_call_function(SQL_PreParameterization,{"query":where,"parameterize":where_parameterize})!
	where = _result_function();
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, table, where, included_columns, excluded_columns, order, offset, limit];
	
	_embedded("SQL_SelectRecords", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_SQL_NODE_PARAMETERS);
};
function SQL_UpdateRecords(){
	var table = _function_argument("table");
	var values = _function_argument("values");
	var where = _function_argument("where");
	var where_parameterize = _function_argument("where_parameterize");
	var fields = SQL_ConvertToList(_function_argument("fields"));
	var limit = _function_argument("limit");
	var timeout = _function_argument("timeout");
	
	SQL_CheckDialect();
	
	_call_function(SQL_PreParameterization,{"query":where,"parameterize":where_parameterize})!
	where = _result_function();
	
	_call_function(SQL_ConvertValuesToObject,{"values":values})!
	values = _result_function();
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, table, values, where, fields, limit];
	
	_embedded("SQL_UpdateRecords", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
};
function SQL_DeleteRecords(){
	var table = _function_argument("table");
	var where = _function_argument("where");
	var where_parameterize = _function_argument("where_parameterize");
	var limit = _function_argument("limit");
	var timeout = _function_argument("timeout");
	
	SQL_CheckDialect();
	
	_call_function(SQL_PreParameterization,{"query":where,"parameterize":where_parameterize})!
	where = _result_function();
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, table, where, limit];
	
	_embedded("SQL_DeleteRecords", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
};
function SQL_Close(){
	VAR_SQL_NODE_PARAMETERS = _SQL_CONNECTION_ID;
	
	_embedded("SQL_Close", "Node", "12.18.3", "SQL_NODE_PARAMETERS", 60000)!
};
function SQL_CheckDialect(){
	var dialect = _SQL_CONFIG["dialect"];
	if(["mysql","mariadb","postgres","sqlite","mssql"].indexOf(dialect) < 0){
		fail(_K=="ru" ? ("Настройка доступа к базе данных не выполнена или выполнена неправильно") : ("Database access configuration failed or incorrect"));
	};
};
function SQL_ConvertDates(data){
	return data instanceof Date ? {isDate:true,date:data} : (Array.isArray(data) ? data.map(function(e){return e instanceof Date ? {isDate:true,date:e} : e}) : data);
};
function SQL_ConvertValue(value){
	return (typeof value=="string" ? (isNaN(value) ? (value=="true" || value=="false" ? value=="true" : value) : Number(value)) : SQL_ConvertDates(value));
};
function SQL_Template(){
	var e = _function_argument("e");
	
	_template(e)!
	var r = _result();
	
	_function_return(r);
};
function SQL_PreParameterization(){
	var query = _function_argument("query");
	var parameterize = _function_argument("parameterize");
	
	_if_else(parameterize, function(){
		var reg = new RegExp("\\[\\[[^\\]]+\\]\\]|\\{\\{[^\\}]+\\}\\}", "g");
		var replacements = query.match(reg) || [];
		var parameterize = (replacements && replacements.length > 0) ? true : false;
		_if(replacements && replacements.length > 0,function(){
			_do_with_params({"foreach_data":replacements},function(){
				var cycle_index = _iterator() - 1;
				if(cycle_index > _cycle_param("foreach_data").length - 1){_break()};
				var ell = _cycle_param("foreach_data")[cycle_index];
				
				_call_function(SQL_Template,{"e":ell})!
				var res = _result_function();
				replacements[cycle_index] = SQL_ConvertDates(res);
			})!
			
			query = query.replace(reg, "?");
		})!
		
		_function_return([query, parameterize, replacements]);
	}, function(){
		_function_return([query, false]);
	})!
};
function SQL_ConvertValuesToObject(){
	var values = _function_argument("values");
	
	_if(values.indexOf("=") < 0,function(){
		_call_function(SQL_Template,{"e":values})!
		var values = _result_function();
		
		_if(typeof values=="object",function(){
			_function_return(values);
		})!
	})!
	
	var values_object = {};
	var values_array = values.split(/,?\r?\n/);
	
	_do_with_params({"foreach_data":values_array},function(){
		var cycle_index = _iterator() - 1;
		if(cycle_index > _cycle_param("foreach_data").length - 1){_break()};
		var value = _cycle_param("foreach_data")[cycle_index];
		
		var split = value.split(/\s?=\s?/);
		var key = split[0];
		var value = split[1];
		
		_call_function(SQL_Template,{"e":key})!
		var key = _result_function();
		
		_call_function(SQL_Template,{"e":value})!
		var value = _result_function();
		
		values_object[key] = SQL_ConvertValue(res);
	})!
	
	_function_return(values_object);
};
function SQL_IsJsonString(str){
    try{
        JSON.parse(str);
    }catch(e){
        return false;
    };
    return true;
};
function SQL_ConvertToList(str){
	return (str=="" || typeof str=="object") ? str : (SQL_IsJsonString(str) ? JSON.parse(str) : str.split(/,?\s/));
};
function SQL_FormatPath(path){
	return path.split("\\").join("/");
};