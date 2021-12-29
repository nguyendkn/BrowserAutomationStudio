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
  messages: { ...window.locales },
  locale: new URLSearchParams(window.location.search).get('lang'),
});

const store = new Vuex.Store({
  state: () => ({
    ...(scriptStorage.getItem('state') || {}),
    toolbarVisible: false,
  }),
  mutations: {
    toggleToolbar(state, payload) {
      state.toolbarVisible = !state.toolbarVisible;
    },
    setExpandedItem(state, { path }) {
      state.items[path] = true;
    },
    setCollapsedItem(state, { path }) {
      state.items[path] = false;
    },
  },
});

store.subscribe((mutation, state) => {
  if (mutation.type !== 'toggleToolbar') {
    scriptStorage.setItem('state', {
      items: state.items
    });
  }
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
