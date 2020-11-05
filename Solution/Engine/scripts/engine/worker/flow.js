function _stop_subscript_execution()
{
    ScriptWorker.AbortSubscript();
}

function fail(text, dont_create_more)
{
    ScriptWorker.Fail(text,dont_create_more);
}

function fail_user(text, dont_create_more)
{
    ScriptWorker.FailUser(text,dont_create_more);
}

function _info(text)
{
    ScriptWorker.Info(text);
}

function die(text, instant)
{
    if(ScriptWorker.IsTaskRunning())
    {
        fail_user(text, false)
    }else
    {
        ScriptWorker.Die(text,instant);
    }
}

function success(text)
{
    ScriptWorker.Success(text);
}

function debug_variables(list, callback)
{
    var res = {}

    for(var i = 0;i<list.length;i++)
    {
        var v = list[i]
        if(v.indexOf("GLOBAL:") == 0)
        {
            res[v] = JSON.parse(P("basglobal",v.slice(7)) || '""');
        }else
        {

            try
            {
                res[v.slice(4)] = truncate_variable(eval(v), 100);
            }catch(e)
            {
                res[v.slice(4)] = "undefined"
            }
        }
    }
    Browser.DebugVariablesResult(JSON.stringify([res,JSON.parse(ScriptWorker.PickResources())]),_get_function_body(callback));
}

function truncate_variable(item, limit) {
    if (item instanceof Object) {
        if (!(item instanceof Date)) {
            var keys = Object.keys(item);

            keys.forEach(function (key) {
                item[key] = truncate_variable(item[key], limit);
            });
        
            if (item instanceof Array) {
                return item.slice(0, limit);
            }
        
            return keys.slice(0, limit).reduce(function (acc, key) {
                acc[key] = item[key];
                return acc;
            }, {});
        }
        
        return "__DATE__" + _format_date(item, "yyyy-MM-dd hh:mm:ss t");
    }

    return item;
}

function _web_interface_eval(Script)
{
    ScriptWorker.WebInterfaceEval(Script)
}
