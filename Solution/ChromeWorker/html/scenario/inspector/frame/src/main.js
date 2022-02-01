'use strict';

Vue.use(window['v-click-outside']);
Vue.use(VueConfirmPlugin);
Vue.use(VuePromptPlugin);

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
