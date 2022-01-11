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

    ['sortings', 'filters', 'groups', 'items'].forEach(prop => {
      if (!state[prop] || typeOf(state[prop]) !== 'object') {
        state[prop] = {
          variables: prop === 'items' ? {} : [],
          resources: prop === 'items' ? {} : [],
        };
      }
    });

    return { ...state, toolbarVisible: false };
  },
  mutations: {
    setCollapsedItem(state, { path, id }) {
      state.items[id][path.join('|')] = false;
    },
    setExpandedItem(state, { path, id }) {
      state.items[id][path.join('|')] = true;
    },
    setSortings(state, { sortings, id }) {
      state.sortings[id] = sortings;
    },
    setFilters(state, { filters, id }) {
      state.filters[id] = filters;
    },
    setGroups(state, { groups, id }) {
      state.groups[id] = groups;
    },
    toggleToolbar(state, payload) {
      state.toolbarVisible = !state.toolbarVisible;
    },
  },
});

store.subscribe(({ type }, { sortings, filters, groups, items }) => {
  if (type !== 'toggleToolbar') {
    scriptStorage.setItem('state', { sortings, filters, groups, items });
  }
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
