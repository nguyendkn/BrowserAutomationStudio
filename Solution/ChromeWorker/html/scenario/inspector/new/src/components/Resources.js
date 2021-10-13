window.Resources = {
  name: 'Resources',

  components: {
    Toolbar
  },

  props: {
    source: {
      default: () => { },
      type: Object
    }
  },

  data() {
    const filters = ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'];
    const sortings = ['alphabetically', 'dateModified', 'dateCreated', 'frequency'];

    return {
      sortings: sortings.map((name, i) => ({ name, active: i === 0 })),
      filters: filters.map(name => ({ name, active: true })),
      searchQuery: ''
    }
  },

  computed: {
    isEmpty() {
      return !Object.keys(this.source).length;
    }
  },

  methods: {
    isVisible(type) {
      const filter = this.options.find(item => item.name.includes(type));
      return !!filter && filter.active;
    }
  },

  template: String.raw`
    <div>
      <Toolbar :filters.sync="filters" :sortings.sync="sortings" :query.sync="searchQuery" />
      <div v-show="!isEmpty" class="app-panel-content">
        <!-- TODO -->
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.resourcesEmpty'"></div>
    </div>
  `
};