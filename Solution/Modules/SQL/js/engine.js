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
	var timeout = _function_argument("timeout");
	
	FTP_CheckDialect();
	
	if(query_type==="auto"){
		query_type = ["SELECT", "INSERT", "UPDATE", "BULKUPDATE", "BULKDELETE", "DELETE", "UPSERT", "VERSION", "SHOWTABLES", "SHOWINDEXES", "DESCRIBE", "FOREIGNKEYS", "SHOWCONSTRAINTS"].filter(function(type){return query_sql.indexOf(type) > -1})[0] || "RAW";
	};
	
	var reg = new RegExp("\\[\\[[^\\]]+\\]\\]|\\{\\{[^\\}]+\\}\\}", "g");
	var replacements = query_sql.match(reg);
	_if(replacements && replacements.length > 0,function(){
		_do_with_params({"foreach_data":replacements},function(){
			var cycle_index = _iterator() - 1;
			if(cycle_index > _cycle_param("foreach_data").length - 1){_break()};
			var ell = _cycle_param("foreach_data")[cycle_index];
			
			_call_function(SQL_Template,{"e":ell})!
			var res = _result_function();
			replacements[cycle_index] = res;
		})!
		
		query_sql = query_sql.replace(reg, "?");
	})!
	
	VAR_SQL_NODE_PARAMETERS = [_SQL_CONNECTION_ID, _SQL_CONFIG, _SQL_CONNECTION_TIMEOUT, query_sql, query_type, replacements];
	
	_embedded("QuerySQL", "Node", "12.18.3", "SQL_NODE_PARAMETERS", timeout)!
	
	_function_return(VAR_SQL_NODE_PARAMETERS);
};
function SQL_Close(){
	VAR_SQL_NODE_PARAMETERS = _SQL_CONNECTION_ID;
	
	_embedded("CloseSQL", "Node", "12.18.3", "SQL_NODE_PARAMETERS", 60000)!
};
function FTP_CheckDialect(){
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
function SQL_FormatPath(path){
	return path.split("\\").join("/");
};