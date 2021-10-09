window.Callstack = {
  name: 'Callstack',

  components: {
    Toolbar,
    CallstackItem
  },

  props: {
    source: {
      default: () => [],
      type: Array
    }
  },

  data() {
    return {
      toolbarOptions: {
        filters: ['functions', 'actions'],
        search: false
      }
    }
  },

  computed: {
    isEmpty() {
      return Object.keys(this.source).length === 0;
    }
  },

  template: html`
    <div>
      <Toolbar v-bind="toolbarOptions" />
      <div v-show="isEmpty" class="app-panel-info" v-t="'tabs.callstackEmpty'"></div>
      <div v-show="!isEmpty" class="app-panel-data">
        <ul class="callstack-list">
          <CallstackItem v-for="item in source" :key="item.id" :item="item" />
        </ul>
      </div>
    </div>
  `
};