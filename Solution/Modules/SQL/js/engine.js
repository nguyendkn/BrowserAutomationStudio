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
	var query_sql = _function_argument("query");
	var query_type = _function_argument("type");
	var parameterize = _function_argument("parameterize");
	var timeout = _function_argument("timeout");
	var replacements = [];
	
	SQL_CheckDialect();
	
	if(query_type==="auto"){
		query_type = ["SELECT", "INSERT", "UPDATE", "BULKUPDATE", "BULKDELETE", "DELETE", "UPSERT", "VERSION", "SHOWTABLES", "SHOWINDEXES", "DESCRIBE", "FOREIGNKEYS", "SHOWCONSTRAINTS"].filter(function(type){return query_sql.indexOf(type) > -1})[0] || "RAW";
	};
	
	_if(parameterize,function(){
		_call_function(SQL_PreParameterization,{"query":query_sql})!
		var res = _result_function();
		query_sql = res[0];
		replacements = res[1];
		parameterize = replacements.length > 0 ? true : false;
	})!
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, query_sql, query_type, replacements];
	
	_embedded("SQL_Query", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_SQL_NODE_PARAMETERS);
};
function SQL_SelectRecords(){
	var table = _function_argument("table");
	var where = _function_argument("where");
	var included_columns = SQL_ConvertToList(_function_argument("included_columns"));
	var excluded_columns = SQL_ConvertToList(_function_argument("excluded_columns"));
	var order_column = _function_argument("order_column");
	var order_direction = _function_argument("order_direction");
	var offset = _function_argument("offset");
	var limit = _function_argument("limit");
	var parameterize = _function_argument("parameterize");
	var timeout = _function_argument("timeout");
	var order = order_direction=="no sorting" ? "" : [ [order_column, order_direction=="ascending" ? "ASC" : "DESC"] ];
	var replacements = [];
	
	SQL_CheckDialect();
	
	if(typeof where=="object" && parameterize){
		parameterize = false;
	};
	
	_if(parameterize,function(){
		_call_function(SQL_PreParameterization,{"query":where})!
		var res = _result_function();
		where = res[0];
		replacements = res[1];
		parameterize = replacements.length > 0 ? true : false;
	})!
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, table, where, included_columns, excluded_columns, order, offset, limit, parameterize, replacements];
	
	_embedded("SQL_SelectRecords", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_SQL_NODE_PARAMETERS);
}
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
function SQL_Template(){
	var e = _function_argument("e");
	
	_template(e)!
	var r = _result();
	
	_function_return(r);
};
function SQL_PreParameterization(){
	var query = _function_argument("query");
	
	var reg = new RegExp("\\[\\[[^\\]]+\\]\\]|\\{\\{[^\\}]+\\}\\}", "g");
	var replacements = query.match(reg) || [];
	_if(replacements && replacements.length > 0,function(){
		_do_with_params({"foreach_data":replacements},function(){
			var cycle_index = _iterator() - 1;
			if(cycle_index > _cycle_param("foreach_data").length - 1){_break()};
			var ell = _cycle_param("foreach_data")[cycle_index];
			
			_call_function(SQL_Template,{"e":ell})!
			var res = _result_function();
			replacements[cycle_index] = res instanceof Date ? {isDate:true,date:res} : (Array.isArray(res) ? res.map(function(e){return e instanceof Date ? {isDate:true,date:e} : e}) : res);
		})!
		
		query = query.replace(reg, "?");
	})!
	
	_function_return([query, replacements]);
};
function SQL_ConvertToList(str){
	return (str=="" || typeof str=="object") ? str : (Excel_IsJsonString(str) ? JSON.parse(str) : str.split(/,\s|,/));
};
function SQL_FormatPath(path){
	return path.split("\\").join("/");
};