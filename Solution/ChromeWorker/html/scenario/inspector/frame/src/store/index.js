'use strict';

const store = new Vuex.Store({
  state() {
    const state = Object.assign({}, parseJSON(bas.state));
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
    removeNode(state, { id, path }) {
      const pointer = JSON.stringify(path);
      delete state[id].nodes[pointer];
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
    BrowserAutomationStudio_SaveInterfaceJson(JSON.stringify({ variables, resources, callstack }));
  }
});
