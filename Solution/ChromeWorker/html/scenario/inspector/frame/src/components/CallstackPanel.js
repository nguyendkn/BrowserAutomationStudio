'use strict';

window.CallstackPanel = {
  name: 'CallstackPanel',

  components: {
    PanelToolbar,
    CallstackList,
  },

  props: {
    title: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    data: {
      type: Array,
      required: true,
    },
  },

  data() {
    const { filters } = this.$store.state[this.name];

    return {
      filters: ['functions', 'actions'].map(name => {
        const filter = filters.find(item => item.name === name);
        return { name, active: filter ? filter.active : true };
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
    filters(filters) {
      this.$store.commit('setFilters', { id: this.name, filters });
    },
  },

  template: /*html*/ `
    <div class="app-panel">
      <panel-toolbar :filters.sync="filters" :search="false" />
      <div v-show="!isEmpty" class="app-panel-content">
        <callstack-list :data="data" :filters="activeFilters" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `,
};
