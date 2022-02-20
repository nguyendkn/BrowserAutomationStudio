(function (self) {
    var fn = _get_function_body;
    const MAX_CHARS = 1000;
    const MAX_ITEMS = 100;
    const MAX_DEPTH = 10;

    self.request_variables = function (list, callback) {
        var variables = (Array.isArray(list) ? list : [list]).reduce(function (acc, key) {
            var path = JSON.parse(key), value = undefined;

            if (path.length) {
                var name = path[0], index = 1, length = path.length - 1;

                if (name.indexOf('GLOBAL:') === 0) {
                    value = global(name);
                } else {
                    value = local(name);
                }

                while (value != null && index < length) value = value[path[index++]];
            }

            return (acc[key] = value, acc);
        }, {});

        Browser.RequestVariablesResult(stringify(variables), fn(callback));
    };

    self.debug_variables = function (list, callback) {
        var result = {
            variables: list.reduce(function (acc, key) {
                if (key.indexOf('GLOBAL:') === 0) {
                    acc[key] = truncate(global(key));
                } else {
                    acc[key.slice(4)] = truncate(local(key));
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
            }, []).concat(cycle({ info: { id: 0, name: 'Main', type: 'function' } })),

            resources: JSON.parse(ScriptWorker.PickResources())
        };

        Browser.DebugVariablesResult(stringify(result), fn(callback));
    };

    function stringify(value) {
        return JSON.stringify(value, function (key) {
            var value = this[key];

            if (value instanceof Date) {
                return '__date__' + value.toJSON();
            }

            return typeof value === 'undefined' ? '__undefined__' : value;
        })
    }

    function truncate(value, depth) {
        var type = typeof value;

        if (type === 'object' && value) {
            var type = Object.prototype.toString.call(value), depth = depth || 0;

            if (type === '[object Object]') {
                if (depth >= MAX_DEPTH) return {};

                var keys = Object.keys(value), object = keys.slice(0, MAX_ITEMS).reduce(function (acc, key) {
                    return (acc[key] = truncate(value[key], depth + 1), acc);
                }, {});
                if (keys.length > 100) object.__length__ = keys.length;
                return object;
            }

            if (type === '[object Array]') {
                if (depth >= MAX_DEPTH) return [];

                var array = value.slice(0, MAX_ITEMS).map(function (value) {
                    return truncate(value, depth + 1);
                });
                if (value.length > 100) array.push(value.length);
                return array;
            }
        }

        return type === 'string' ? value.slice(0, MAX_CHARS) : value;
    }

    function global(name) {
        var value = P('basglobal', name.slice(7));
        return JSON.parse(value || '"__undefined__"');
    }

    function local(name) {
        var prefix = name.indexOf('VAR_') === 0;
        return self[(prefix ? '' : 'VAR_') + name];
    }

    function cycle(item) {
        var info = item.info, options = { expression: info.expression || '', iterator: item.iterator || 0 };

        options.arguments = Object.keys(item.arguments || {}).reduce(function (acc, key) {
            var value = item.arguments[key];
            return (acc[key] = value == null ? String(value) : JSON.stringify(value), acc);
        }, {});

        return { id: info.id, name: info.name, type: info.type, options: options };
    }
})(this);
