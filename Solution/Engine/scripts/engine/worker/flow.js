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
    var res = list.reduce(function (acc, v) {
        if (v.indexOf('GLOBAL:') === 0) {
            acc[v] = JSON.parse(P('basglobal', v.slice(7)) || '"__UNDEFINED__"');
        } else {
            try {
                acc[v.slice(4)] = truncate_variable(eval(v), 100);
            } catch (e) {
                acc[v.slice(4)] = '__UNDEFINED__';
            }
        }
        return acc;
    }, {});

    Browser.DebugVariablesResult(JSON.stringify([res, JSON.parse(ScriptWorker.PickResources())]), _get_function_body(callback));
}

function _read_variables(list)
{
    var res = {}

    for(var i = 0;i<list.length;i++)
    {
        var v = list[i]

        try
        {
            res[v.slice(4)] = eval(v);
        }catch(e)
        {
            res[v.slice(4)] = null
        }

    }
    return res;
}


function _write_variables(variables)
{
    var keys = Object.keys(variables)

    for(var i = 0;i<keys.length;i++)
    {
        var key = keys[i]
        var value = variables[key]
        GLOBAL["VAR_" + key] = value;
    }
}


function truncate_variable(item, limit) {
    if (item instanceof Object) {
        if (!(item instanceof Date)) {
            return Object.keys(item).slice(0, limit).reduce(function (acc, key) {
                acc[key] = truncate_variable(item[key], limit);
                return acc;
            }, item instanceof Array ? [] : {});
        }

        return "__DATE__" + _format_date(item, "yyyy-MM-dd hh:mm:ss t");
    }

    return typeof (item) === 'undefined' ? '__UNDEFINED__' : item;
}

function _web_interface_eval(Script)
{
    ScriptWorker.WebInterfaceEval(Script)
}
