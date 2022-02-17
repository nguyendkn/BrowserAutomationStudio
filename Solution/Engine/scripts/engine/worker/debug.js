;(function (self) {
    var has = Object.prototype.hasOwnProperty, fn = _get_function_body;

    self.request_variables = function (list, callback) {
        var variables = list.reduce(function (acc, key) {
            key = JSON.parse(key);

            if (key.length) {
                var name = key[0], value = null;

                if (name.indexOf("GLOBAL:") === 0) {
                    value = JSON.parse(P("basglobal", name.slice(7)) || '"__undefined__"');
                } else {
                    value = GLOBAL[name];
                }

                return (acc[key] = get(value, key.slice(1)), acc);
            }

            return (acc[key] = "__undefined__", acc);
        }, {});

        Browser.RequestVariablesResult(JSON.stringify(variables), fn(callback));
    };

    self.debug_variables = function (list, callback) {
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

        Browser.DebugVariablesResult(JSON.stringify(result), fn(callback));
    };

    function get(obj, path) {
        for (var i = 0; i < path.length; i++) {
            if (typeof obj === "object" && obj) {
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
})(this);
