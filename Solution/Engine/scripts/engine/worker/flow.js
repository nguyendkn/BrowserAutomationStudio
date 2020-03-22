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
                var o = eval(v)
                if(o instanceof Date)
                {
                    o = "__DATE__" + _format_date(o,"yyyy-MM-dd hh:mm:ss t")
                }
                res[v.slice(4)] = o
            }catch(e)
            {
                res[v.slice(4)] = "undefined"
            }
        }
    }
    Browser.DebugVariablesResult(JSON.stringify([res,JSON.parse(ScriptWorker.PickResources())]),_get_function_body(callback));
}


function _web_interface_eval(Script)
{
    ScriptWorker.WebInterfaceEval(Script)
}
