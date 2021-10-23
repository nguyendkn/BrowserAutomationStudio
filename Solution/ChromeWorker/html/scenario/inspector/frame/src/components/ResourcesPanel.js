window.ResourcesPanel = {
  name: 'ResourcesPanel',

  components: {
    PanelToolbar,
    TreeView
  },

  props: {
    title: {
      required: true,
      type: String
    },

    data: {
      required: true,
      type: Object
    }
  },

  data() {
    const filters = ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
      sortings = ['alphabetically', 'dateModified', 'dateCreated', 'frequency'];

    return {
      sortings: sortings.map((name, idx) => ({ name, active: idx === 0 })),
      filters: filters.map(name => ({ name, active: true })),
      query: ''
    };
  },

  computed: {
    isEmpty() {
      return !Object.keys(this.data).length;
    }
  },

  template: /*html*/`
    <div class="app-panel">
      <PanelToolbar :sortings.sync="sortings" :filters.sync="filters" :query.sync="query" />
      <div v-show="!isEmpty" class="app-panel-content">
        <TreeView :data="data" :filters="filters" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `
};
