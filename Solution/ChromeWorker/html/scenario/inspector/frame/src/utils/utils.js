'use strict';

const getType = (() => {
  const toString = Object.prototype.toString;

  return value => {
    if (value === null) return 'null';

    const type = typeof value;
    if (type !== 'object') return type;
    return toString.call(value).slice(8, -1).toLowerCase();
  };
})();

const hasOwn = (() => {
  const has = Object.prototype.hasOwnProperty;

  return (value, key) => {
    if (value == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    return has.call(Object(value), key);
  };
})();
