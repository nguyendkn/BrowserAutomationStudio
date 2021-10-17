window.Variables = {
  name: 'Variables',

  components: {
    TreeView,
    Toolbar
  },

  props: {
    data: {
      default: () => { },
      type: Object
    }
  },

  data() {
    const filters = ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
      sortings = ['alphabetically', 'dateModified', 'dateCreated', 'frequency'];

    return {
      sortings: sortings.map((name, at) => ({ name, active: at === 0 })),
      filters: filters.map(name => ({ name, active: true })),
      query: ''
    }
  },

  computed: {
    isEmpty() {
      return false;
      // return !Object.keys(this.data).length;
    }
  },

  methods: {
    isVisible({ type }) {
      const filter = this.filters.find(item => item.name.includes(type));
      return !!filter && filter.active;
    }
  },

  template: /*html*/`
    <div class="app-panel">
      <Toolbar :filters.sync="filters" :sortings.sync="sortings" :query.sync="query" />
      <div v-show="!isEmpty" class="app-panel-content">
        <TreeView :data="data" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.variablesEmpty'"></div>
    </div>
  `
};