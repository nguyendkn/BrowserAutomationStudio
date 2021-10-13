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
      filters: [
        { name: 'functions', active: true },
        { name: 'actions', active: true }
      ]
    }
  },

  computed: {
    isEmpty() {
      return !Object.keys(this.source).length;
    }
  },

  methods: {
    isVisible(type) {
      const filter = this.filters.find(item => item.name.includes(type));
      return !!filter && filter.active;
    }
  },

  template: String.raw`
    <div>
      <Toolbar :filters.sync="filters" :search="false" />
      <div v-show="!isEmpty" class="app-panel-content">
        <ul class="callstack-list">
          <CallstackItem v-for="item in source" v-show="isVisible(item.type)" :key="item.id" v-bind="item" />
        </ul>
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.callstackEmpty'"></div>
    </div>
  `
};