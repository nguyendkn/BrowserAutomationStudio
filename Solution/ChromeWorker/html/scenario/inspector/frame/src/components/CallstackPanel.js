'use strict';

window.CallstackPanel = {
  name: 'CallstackPanel',

  components: {
    PanelToolbar,
    CallstackList,
  },

  props: {
    title: {
      required: true,
      type: String,
    },

    name: {
      required: true,
      type: String,
    },

    data: {
      required: true,
      type: Array,
    },
  },

  data() {
    const { filters } = this.$store.state[this.name];

    return {
      filters: ['functions', 'actions'].map(name => {
        return { name, active: filters.length ? filters.includes(name) : true };
      }),
    };
  },

  computed: {
    activeFilters() {
      return this.filters.filter(f => f.active).map(f => f.name);
    },

    isEmpty() {
      return !Object.keys(this.data).length;
    },
  },

  watch: {
    activeFilters(filters) {
      const { $store, name: id } = this;
      $store.commit('setFilters', { id, filters });
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <panel-toolbar :filters.sync="filters" :search="false" />
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
      <div v-show="!isEmpty" class="app-panel-content">
        <callstack-list :data="data" :filters="activeFilters" />
      </div>
    </div>
  `,
};
