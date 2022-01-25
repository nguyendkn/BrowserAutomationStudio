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
    const state = Object.assign({}, scriptStorage.get('state'));

    ['variables', 'resources', 'callstack'].forEach(id => {
      state[id] = Object.assign({}, state[id]);

      ['sortings', 'filters', 'options', 'groups', 'nodes'].forEach(key => {
        if (typeOf(state[id][key]) !== (key === 'nodes' ? 'object' : 'array')) {
          state[id][key] = key === 'nodes' ? {} : [];
        }
      });
    });

    return { ...state, diff: { variables: [], resources: [] }, toolbarVisible: false };
  },
  mutations: {
    setNodeCollapsed(state, { path, id }) {
      const pointer = JSON.stringify(path);
      state[id].nodes[pointer] = false;
    },
    setNodeExpanded(state, { path, id }) {
      const pointer = JSON.stringify(path);
      state[id].nodes[pointer] = true;
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
    setDiff(state, { diff, id }) {
      state.diff[id] = diff;
    },
    toggleToolbar(state) {
      state.toolbarVisible = !state.toolbarVisible;
    },
  },
});

store.subscribe(({ type }, { variables, resources, callstack }) => {
  if (type !== 'toggleToolbar' && type !== 'setDiff') {
    scriptStorage.set('state', { variables, resources, callstack });
  }
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
