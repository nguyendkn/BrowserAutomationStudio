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
        var result = {
            variables: list.reduce(function (acc, key) {
                if (key.indexOf("GLOBAL:") === 0) {
                    var val = P("basglobal", key.slice(7)) || '"__undefined__"';
                    acc[key] = truncate(JSON.parse(val));
                } else {
                    acc[key.slice(4)] = truncate(GLOBAL[key]);
                }
                return acc;
            }, {}),

            callstack: CYCLES.Data.reduceRight(function (acc, val) {
                if (val._Info.name && val._Info.type) {
                    acc.push(cycle({
                        arguments: val._Arguments,
                        iterator: val._Iterator,
                        info: val._Info,
                    }));
                }
                return acc;
            }, []).concat(cycle({ info: { id: 0, name: "Main", type: "function" } })),

            resources: JSON.parse(ScriptWorker.PickResources())
        };

        Browser.DebugVariablesResult(JSON.stringify(result), _get_function_body(callback));
    };

    function truncate(obj) {
        if (obj instanceof Object) {
            if (obj instanceof Date) return "__date__" + obj.toJSON();
            if (Array.isArray(obj)) return obj.slice(0, 100);
            return Object.keys(obj).slice(0, 100).reduce(function (acc, key) {
                var value = truncate(obj[key]);
                return (acc[key] = value, acc);
            }, {});
        }
        return typeof obj === "undefined" ? "__undefined__" : obj;
    }

    function cycle(item) {
        var info = item.info, options = truncate({
            expression: info.expression || "",
            arguments: item.arguments || {},
            iterator: item.iterator || 0,
        });
        return { id: info.id, name: info.name, type: info.type, options: options };
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
