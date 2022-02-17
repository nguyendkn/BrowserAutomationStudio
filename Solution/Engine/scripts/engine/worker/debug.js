;(function (self) {
    self.request_variables = function (list, callback) {
        var variables = list.reduce(function (acc, key) {
            var path = JSON.parse(key);

            if (path.length) {
                var name = path[0], value = null;

                if (name.indexOf("GLOBAL:") === 0) {
                    value = global(name);
                } else {
                    value = GLOBAL[name];
                }

                return (acc[key] = get(value, path.slice(1)), acc);
            }

            return (acc[key] = undefined, acc);
        }, {});

        Browser.RequestVariablesResult(stringify(variables), _get_function_body(callback));
    };

    self.debug_variables = function (list, callback) {
        var result = {
            variables: list.reduce(function (acc, key) {
                if (key.indexOf("GLOBAL:") === 0) {
                    acc[key] = truncate(global(key));
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

        Browser.DebugVariablesResult(stringify(result), _get_function_body(callback));
    };

    function stringify(value) {
        return JSON.stringify(value, function (key) {
            if (this[key] instanceof Date) return "__date__" + this[key].toJSON();
            return typeof this[key] === "undefined" ? "__undefined__" : this[key];
        })
    }

    function truncate(value) {
        var type = Object.prototype.toString.call(value);

        if (type === "[object Object]") {
            return Object.keys(value).slice(0, 100).reduce(function (acc, key) {
                return (acc[key] = truncate(value[key]), acc);
            }, {});
        }

        if (type === "[object Array]") {
            return value.slice(0, 100).map(function (value) {
                return truncate(value);
            });
        }

        return value;
    }

    function get(obj, path) {
        for (var i = 0; i < path.length; i++) {
            if (typeof obj === "object" && obj) {
                var key = path[i];

                if (!obj || !obj.hasOwnProperty(key)) {
                    obj = undefined;
                    break;
                }

                obj = obj[key];
            }
        }
        return obj;
    }

    function global(name) {
        var value = P("basglobal", name.slice(7));
        return JSON.parse(value || '"__undefined__"');
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
