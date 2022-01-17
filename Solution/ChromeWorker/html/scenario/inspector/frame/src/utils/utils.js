'use strict';

const scale = (color, count = 6) => {
  return [...Array(count).keys()].map(n => {
    const [r, g, b] = [255, 0, 0].map((v, i) => {
      return Math.round(v + (color[i] - v) * (n / (count - 1)));
    });
    return `rgb(${r}, ${g}, ${b})`;
  });
};

const typeOf = (() => {
  const toString = Object.prototype.toString;

  return value => {
    if (value === null) return 'null';
    if (value !== Object(value)) return typeof value;
    return toString.call(value).slice(8, -1).toLowerCase();
  };
})();

const hasOwn = (() => {
  const has = Object.prototype.hasOwnProperty;
  return (object, key) => has.call(object, key);
})();
