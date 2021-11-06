'use strict';

function html(raw, ...args) {
  return String.raw({ raw }, args);
}
