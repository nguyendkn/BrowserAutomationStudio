window.Variables = {
  name: 'Variables',

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
          ...filters.map(name => ({ name, type: 'filter', active: true })),
          ...sortings.map((name, at) => ({ name, type: 'sorting', active: at == 0 }))
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
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.variablesEmpty'"></div>
    </div>
  `
};