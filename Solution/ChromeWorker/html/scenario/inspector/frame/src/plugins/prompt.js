'use strict';

const VuePromptPlugin = {
  install(Vue, options = {}) {
    Vue.prototype.$prompt = (message, cb) => {
      window.addEventListener('message', ({ data }) => {
        if (data.type === 'prompt') {
          cb(data.payload.result);
        }
      }, { once: true });

      post('prompt', { message });
    };
  },
};
