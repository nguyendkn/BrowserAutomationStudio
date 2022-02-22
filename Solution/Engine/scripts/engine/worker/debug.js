(function (self) {
    var fn = _get_function_body;
    const MAX_CHARS = 300;
    const MAX_ITEMS = 100;
    const MAX_DEPTH = 10;

    self.request_variables = function (list, callback) {
        var variables = (Array.isArray(list) ? list : [list]).reduce(function (acc, key) {
            var path = JSON.parse(key), value = undefined;

            if (path.length) {
                var name = path[0], path = path.slice(1), index = 0, length = path.length;

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

            resources: JSON.parse(ScriptWorker.PickResources()),
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
        });
    }

    function truncate(value, depth) {
        var type = typeof value;

        if (type === 'object' && value) {
            var type = Object.prototype.toString.call(value), depth = depth || 1;

            if (type === '[object Object]') {
                if (depth > MAX_DEPTH) return {};

                var keys = Object.keys(value), object = keys.slice(0, MAX_ITEMS).reduce(function (acc, key) {
                    return (acc[key] = truncate(value[key], depth + 1), acc);
                }, {});
                if (keys.length > 100) object.__length__ = keys.length;
                return object;
            }

            if (type === '[object Array]') {
                if (depth > MAX_DEPTH) return [];

                var array = value.slice(0, MAX_ITEMS).map(function (value) {
                    return truncate(value, depth + 1);
                });
                if (value.length > 100) array.push(value.length);
                return array;
            }
        }

        return type === 'string' && value.length > MAX_CHARS ? value.slice(0, MAX_CHARS) + '...' : value;
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

    var microdiff = (function () {
        var richTypes = { Date: true, RegExp: true, String: true, Number: true };

        return function diff(obj, newObj, options, _stack) {
            if (options === void 0) options = { cyclesFix: true };
            if (_stack === void 0) _stack = [];
            var diffs = [];
            var isObjArray = Array.isArray(obj);

            for (var key in obj) {
                var objKey = obj[key];
                var path = isObjArray ? +key : key;
                if (!(key in newObj)) {
                    diffs.push({
                        type: 'REMOVE',
                        path: [path],
                        oldValue: obj[key],
                    });
                    continue;
                }
                var newObjKey = newObj[key];
                var areObjects = typeof objKey === 'object' && typeof newObjKey === 'object';
                if (
                    objKey &&
                    newObjKey &&
                    areObjects &&
                    !richTypes[Object.getPrototypeOf(objKey).constructor.name] &&
                    (!options.cyclesFix || _stack.indexOf(objKey) < 0)
                ) {
                    var nestedDiffs = diff(objKey, newObjKey, options, options.cyclesFix ? _stack.concat([objKey]) : []);
                    diffs.push.apply(
                        diffs,
                        nestedDiffs.map(function (difference) {
                            difference.path.unshift(path);
                            return difference;
                        })
                    );
                } else if (
                    objKey !== newObjKey &&
                    !(areObjects && (isNaN(objKey) ? objKey + '' === newObjKey + '' : +objKey === +newObjKey))
                ) {
                    diffs.push({
                        path: [path],
                        type: 'CHANGE',
                        value: newObjKey,
                        oldValue: objKey,
                    });
                }
            }

            var isNewObjArray = Array.isArray(newObj);
            for (var key in newObj) {
                if (!(key in obj)) {
                    diffs.push({
                        type: 'CREATE',
                        path: [isNewObjArray ? +key : key],
                        value: newObj[key],
                    });
                }
            }
            return diffs;
        };
    })();
})(this);
