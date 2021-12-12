'use strict';

Vue.use(window['v-click-outside']);

const i18n = new VueI18n({
  pluralizationRules: {
    ru(choice, choicesLength) {
      if (choice === 0) return 0;

      const teen = choice > 10 && choice < 20;
      if (!teen && choice % 10 === 1) return 1;

      return choicesLength < 4 || (!teen && choice % 10 >= 2 && choice % 10 <= 4) ? 2 : 3;
    },
  },
  locale: new URL(window.location.href).searchParams.get('lang'),
  messages: { ...window.locales },
});

const store = new Vuex.Store({
  state: () => ({
    toolbarVisible: false,
  }),
  mutations: {
    toggleToolbar(state) {
      state.toolbarVisible = !state.toolbarVisible;
    },
  },
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
});

app.$mount('#app');
