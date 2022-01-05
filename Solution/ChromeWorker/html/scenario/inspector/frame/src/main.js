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
  state: () => {
    const state = Object.assign({}, scriptStorage.getItem('state'));

    if (!state.sortings || typeOf(state.sortings) !== 'object') {
      state.sortings = {};
    }

    if (!state.filters || typeOf(state.filters) !== 'object') {
      state.filters = {};
    }

    if (!state.groups || typeOf(state.groups) !== 'object') {
      state.groups = {};
    }

    if (!state.items || typeOf(state.items) !== 'array') {
      state.items = [];
    }

    return { ...state, toolbarVisible: false };
  },
  mutations: {
    setSortings(state, { sortings, id }) {
      // state.sortings[id] = sortings;
    },
    setFilters(state, { filters, id }) {
      // state.filters[id] = filters;
    },
    setCollapsedItem(state, { path }) {
      // state.items[path.join('|')] = false;
    },
    setExpandedItem(state, { path }) {
      // state.items[path.join('|')] = true;
    },
    setGroups(state, { groups, id }) {
      // state.groups[id] = groups;
    },
    toggleToolbar(state, payload) {
      state.toolbarVisible = !state.toolbarVisible;
    },
  },
});

store.subscribe((mutation, { groups, items }) => {
  if (mutation.type !== 'toggleToolbar') {
    scriptStorage.setItem('state', {
      groups,
      items,
    });
  }
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
