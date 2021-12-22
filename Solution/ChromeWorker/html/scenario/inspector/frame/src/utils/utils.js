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

const html = (raw, ...args) => String.raw({ raw }, args);

const code = (raw, ...args) => String.raw({ raw }, args);
