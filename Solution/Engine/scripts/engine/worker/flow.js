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
        var variables = list.reduce(function (acc, key) {
            if (key.indexOf('GLOBAL:') === 0) {
                acc[key] = JSON.parse(P('basglobal', key.slice(7)) || '"_UNDEFINED_"');
            } else {
                acc[key.slice(4)] = truncate_variable(GLOBAL[key]);
            }
            return acc;
        }, {});

        var callstack = CYCLES.Data.map(function (item) { return mapCycle(item, item._Info); })
            .filter(function (item) { return item.name; }).reverse().concat(mapCycle({}, {
                type: 'function',
                name: 'Main',
                id: 0
            }));

        Browser.DebugVariablesResult(JSON.stringify({
            resources: JSON.parse(ScriptWorker.PickResources()),
            variables: variables,
            callstack: callstack,
        }), _get_function_body(callback));
    };

    function mapCycle(item, info) {
        var options = {
            expression: info.expression || '',
            arguments: item._Arguments || {},
            iterator: item._Iterator || 0
        };
        return { type: info.type, name: info.name, id: info.id, options: options };
    }

    function truncate_variable(val) {
        if (val instanceof Object) {
            if (!(val instanceof Date)) {
                return Object.keys(val).slice(0, 100).reduce(function (acc, key) {
                    return (acc[key] = truncate_variable(val[key]), acc);
                }, Array.isArray(val) ? [] : {});
            }

            return '_DATE_' + _format_date(val, 'yyyy-MM-dd hh:mm:ss t');
        }

        return typeof val === 'undefined' ? '_UNDEFINED_' : val;
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
