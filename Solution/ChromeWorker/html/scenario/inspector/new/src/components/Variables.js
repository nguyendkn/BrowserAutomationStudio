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
    return {
      toolbarOptions: {
        filters: ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
        sortings: ['alphabetically', 'dateModified', 'dateCreated', 'frequency']
      }
    }
  },

  computed: {
    isEmpty() {
      return Object.keys(this.source).length === 0;
    }
  },

  template: String.raw`
    <div>
      <Toolbar v-bind="toolbarOptions" />
      <div v-show="isEmpty" class="app-panel-info" v-t="'tabs.variablesEmpty'"></div>
      <div v-show="!isEmpty" class="app-panel-data"></div>
    </div>
  `
};