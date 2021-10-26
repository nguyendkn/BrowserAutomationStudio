window.CallstackPanel = {
  name: 'CallstackPanel',

  components: {
    PanelToolbar,
    CallstackList
  },

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
    isEmpty() {
      return !Object.keys(this.data).length;
    },

    activeFilters() {
      return this.filters.filter(item => item.active);
    }
  },

  template: /*html*/`
    <div class="app-panel">
      <panel-toolbar :filters.sync="filters" :search="false" />
      <div v-show="!isEmpty" class="app-panel-content">
        <callstack-list :data="data" :filters="activeFilters" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `
};
