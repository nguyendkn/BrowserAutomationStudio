window.Variables = {
  name: 'Variables',

  components: {
    Toolbar,
    TreeView
  },

  props: {
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

  methods: {
    isVisible({ type }) {
      const filter = this.filters.find(item => item.name.includes(type));
      return !!filter && filter.active;
    }
  },

  template: /*html*/`
    <div class="app-panel">
      <Toolbar :sortings.sync="sortings" :filters.sync="filters" :query.sync="query" />
      <div v-show="!isEmpty" class="app-panel-content">
        <TreeView :data="data" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.variablesEmpty'"></div>
    </div>
  `
};