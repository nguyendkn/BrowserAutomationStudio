'use strict';

const scaleColor = (color, size = 6) => {
  const scale = _.compose(color2K.parseToRgba, color2K.getScale('#ff0000', color));
  return _.range(size).map(n => `rgb(${scale(n / (size - 1)).slice(0, -1).join(', ')})`);
};

const html = (raw, ...args) => String.raw({ raw }, args);

const uniqueId = (() => {
  let counter = 0;

  return (prefix = '') => {
    const id = ++counter;
    return (prefix == null ? '' : prefix + '') + id;
  };
})();

const getType = (() => {
  const toString = Object.prototype.toString;

  return value => {
    if (value === null) return 'null';

    const type = typeof value;
    if (type !== 'object') return type;

    return toString.call(value).slice(8, -1).toLowerCase();
  };
})();
