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
      return !Object.keys(this.source).length;
    }
  },

  template: String.raw`
    <div>
      <Toolbar v-bind="toolbarOptions" />
      <div v-show="!isEmpty" class="app-panel-content">
        <ul class="callstack-list">
          <CallstackItem v-for="item in source" :key="item.id" v-bind="item" />
        </ul>
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.callstackEmpty'"></div>
    </div>
  `
};