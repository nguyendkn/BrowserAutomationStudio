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
      toolbarProps: {
        items: [
          ...sortings.map((name, at) => ({ name, type: 'sorting', active: at === 0 })),
          ...filters.map(name => ({ name, type: 'filter', active: true }))
        ]
      }
    }
  },

  computed: {
    isEmpty() {
      return !Object.keys(this.source).length;
    }
  },

  template: String.raw`
    <div>
      <Toolbar v-bind="toolbarProps" />
      <div v-show="!isEmpty" class="app-panel-content">
        <!-- TODO -->
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.resourcesEmpty'"></div>
    </div>
  `
};