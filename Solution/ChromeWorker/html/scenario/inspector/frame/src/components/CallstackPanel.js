'use strict';

window.CallstackPanel = {
  name: 'CallstackPanel',

  components: {
    PanelToolbar,
    CallstackList
  },

  inheritAttrs: false,

  props: {
    title: {
      required: true,
      type: String
    },

    data: {
      required: true,
      type: Array
    }
  },

  data() {
    return {
      filters: [
        { name: 'functions', active: true },
        { name: 'actions', active: true }
      ]
    };
  },

  computed: {
    activeFilters() {
      return this.filters.filter(f => f.active).map(f => f.name);
    },

    isEmpty() {
      return !Object.keys(this.data).length;
    }
  },

  template: /*html*/`
    <div class="app-panel">
      <panel-toolbar :filters.sync="filters" :search="false" />
      <div v-if="isEmpty" class="app-panel-title" v-t="title"></div>
      <div v-else class="app-panel-content">
        <callstack-list :data="data" :filters="activeFilters" />
      </div>
    </div>
  `
};
