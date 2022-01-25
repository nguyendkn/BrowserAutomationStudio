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
    const counters = { variables: {}, resources: {} };
    const diff = { variables: [], resources: [] };

    ['variables', 'resources', 'callstack'].forEach(id => {
      state[id] = Object.assign({}, state[id]);

      ['sortings', 'filters', 'options', 'groups', 'nodes'].forEach(key => {
        if (typeOf(state[id][key]) !== (key === 'nodes' ? 'object' : 'array')) {
          state[id][key] = key === 'nodes' ? {} : [];
        }
      });
    });

    return { ...state, diff, counters, toolbarVisible: false };
  },
  mutations: {
    setNodeCounter(state, { id, path, counter }) {
      const pointer = JSON.stringify(path);
      state.counters[id][pointer] = counter;
    },
    setNodeCollapsed(state, { id, path }) {
      const pointer = JSON.stringify(path);
      state[id].nodes[pointer] = false;
    },
    setNodeExpanded(state, { id, path }) {
      const pointer = JSON.stringify(path);
      state[id].nodes[pointer] = true;
    },
    setSortings(state, { id, sortings }) {
      state[id].sortings = sortings;
    },
    setFilters(state, { id, filters }) {
      state[id].filters = filters;
    },
    setOptions(state, { id, options }) {
      state[id].options = options;
    },
    setGroups(state, { id, groups }) {
      state[id].groups = groups;
    },
    setDiff(state, { id, diff }) {
      state.diff[id] = diff;
    },
    toggleToolbar(state) {
      state.toolbarVisible = !state.toolbarVisible;
    },
  },
});

store.subscribe(({ type }, { variables, resources, callstack }) => {
  if (type !== 'toggleToolbar' && type !== 'setDiff' && type !== 'setNodeCounter') {
    scriptStorage.set('state', { variables, resources, callstack });
  }
});

const app = new Vue({
  i18n,
  store,
  render: h => h(App),
}).$mount('#app');
