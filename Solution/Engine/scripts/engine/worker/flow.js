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

var debug_variables = (function () {
    return function (list, callback) {
        var result = JSON.stringify({
            variables: list.reduce(function (acc, key) {
                if (key.indexOf('GLOBAL:') === 0) {
                    var val = P('basglobal', key.slice(7)) || '"__UNDEFINED__"';
                    acc[key] = truncate(JSON.parse(val), 100);
                } else {
                    acc[key.slice(4)] = truncate(GLOBAL[key], 100);
                }
                return acc;
            }, {}),

            callstack: CYCLES.Data.reduce(function (acc, val) {
                var item = val.toJSON(), name = item.info.name;
                return (name && acc.unshift(cycle(item)), acc);
            }, [cycle({ info: { type: 'function', name: 'Main', id: 0 } })]),

            resources: JSON.parse(ScriptWorker.PickResources())
        });

        Browser.DebugVariablesResult(result, _get_function_body(callback));
    };

    function truncate(val, limit) {
        if (val instanceof Object) {
            if (val instanceof Date) return '__DATE__' + val.toJSON();
            return Object.keys(val).slice(0, limit).reduce(function (acc, key) {
                return (acc[key] = truncate(val[key], limit), acc);
            }, Array.isArray(val) ? [] : {});
        }
        return typeof val === 'undefined' ? '__UNDEFINED__' : val;
    }

    function cycle(item) {
        var info = item.info, options = {
            expression: info.expression || '',
            arguments: item.arguments || {},
            iterator: item.iterator || 0,
        };
        return { type: info.type, name: info.name, id: info.id, options: options };
    }
})();

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

function _web_interface_eval(Script)
{
    ScriptWorker.WebInterfaceEval(Script)
}
