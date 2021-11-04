'use strict';

const getType = (() => {
  const toString = Object.prototype.toString;

  return value => {
    const type = typeof value;
    if (type !== 'object') return type;
    if (value === null) return 'null';
    return toString.call(value).slice(8, -1).toLowerCase();
  };
})();
