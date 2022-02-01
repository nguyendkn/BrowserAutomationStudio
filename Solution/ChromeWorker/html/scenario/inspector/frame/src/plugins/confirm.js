'use strict';

const VueConfirmPlugin = {
  install(Vue, options = {}) {
    Vue.prototype.$confirm = (message, cb) => {
      window.addEventListener('message', ({ data }) => {
        if (data.type === 'confirm') {
          cb(data.payload.result);
        }
      }, { once: true });

      post('confirm', { message });
    };
  },
};
