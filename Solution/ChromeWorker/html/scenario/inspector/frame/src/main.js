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
  state() {
    const state = Object.assign({}, scriptStorage.getItem('state'));

    ['variables', 'resources', 'callstack'].forEach(id => {
      state[id] = Object.assign({}, state[id]);

      ['sortings', 'filters', 'options', 'groups', 'items'].forEach(key => {
        if (typeOf(state[id][key]) !== (key === 'items' ? 'object' : 'array')) {
          state[id][key] = key === 'items' ? {} : [];
        }
      });
    });

    return { ...state, toolbarVisible: false };
  },
  mutations: {
    setCollapsedItem(state, { path, id }) {
      state[id].items[path.join('|')] = false;
    },
    setExpandedItem(state, { path, id }) {
      state[id].items[path.join('|')] = true;
    },
    setSortings(state, { sortings, id }) {
      state[id].sortings = sortings;
    },
    setFilters(state, { filters, id }) {
      state[id].filters = filters;
    },
    setOptions(state, { options, id }) {
      state[id].options = options;
    },
    setGroups(state, { groups, id }) {
      state[id].groups = groups;
    },
    toggleToolbar(state, payload) {
      state.toolbarVisible = !state.toolbarVisible;
    },
  },
});

store.subscribe(({ type }, { variables, resources, callstack }) => {
  if (type !== 'toggleToolbar') {
    scriptStorage.setItem('state', { variables, resources, callstack });
  }
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
