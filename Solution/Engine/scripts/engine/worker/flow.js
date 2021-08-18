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

function debug_variables(list, callback) {
    var variables = list.reduce(function (acc, key) {
        if (key.indexOf('GLOBAL:') === 0) {
            acc[key] = JSON.parse(P('basglobal', key.slice(7)) || '"__UNDEFINED__"');
        } else {
            try {
                acc[key.slice(4)] = truncate_variable(eval(key), 100);
            } catch (e) {
                acc[key.slice(4)] = '__UNDEFINED__';
            }
        }
        return acc;
    }, {});

    var callstack = CYCLES.Data.slice().reverse().map(function (item) {
        return {
            id: item._Id,
            label: item._Label,
            iterator: item._Iterator,
            arguments: item._Arguments,
        }
    });

    Browser.DebugVariablesResult(JSON.stringify([variables, JSON.parse(ScriptWorker.PickResources()), callstack]), _get_function_body(callback));
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

        return '__DATE__' + _format_date(item, 'yyyy-MM-dd hh:mm:ss t');
    }

    return typeof (item) === 'undefined' ? '__UNDEFINED__' : item;
}

function _web_interface_eval(Script)
{
    ScriptWorker.WebInterfaceEval(Script)
}
