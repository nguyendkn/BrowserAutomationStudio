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

    function truncate(value) {
        if (value instanceof Object) {
            if (value instanceof Date) return "__date__" + value.toJSON();

            if (Array.isArray(value)) return value.slice(0, 100).map(function (value) {
                return truncate(value);
            });

            return Object.keys(value).slice(0, 100).reduce(function (acc, key) {
                return (acc[key] = truncate(value[key]), acc);
            }, {});
        }
        return typeof value === "undefined" ? "__undefined__" : value;
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

var request_variables = function () {
    var has = Object.prototype.hasOwnProperty;

    return function (list) {
        var variables = list.map(function (path) {
            path = JSON.parse(path);

            if (path.length) {
                var name = path[0], value = null;

                if (name.indexOf("GLOBAL:") === 0) {
                    value = JSON.parse(P("basglobal", name.slice(7)) || '"__undefined__"');
                } else {
                    value = GLOBAL[name];
                }

                return get(value, path.slice(1));
            }

            return "__undefined__";
        });
    };

    function get(obj, path) {
        for (var i = 0; i < path.length; i++) {
            if (typeof obj === 'object' && obj) {
                var key = path[i];

                if (!has.call(obj, key)) {
                    obj = "__undefined__";
                    break;
                }

                obj = obj[key];
            }
        }
        return obj;
    }
};

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
