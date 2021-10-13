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
      options: [
        { name: 'functions', type: 'filter', active: true },
        { name: 'actions', type: 'filter', active: true }
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
      const filter = this.options.find(item => item.name.includes(type));
      return !!filter && filter.active;
    }
  },

  template: String.raw`
    <div>
      <Toolbar :items="options" :search="false" />
      <div v-show="!isEmpty" class="app-panel-content">
        <ul class="callstack-list">
          <CallstackItem v-for="item in source" v-show="isVisible(item.type)" :key="item.id" v-bind="item" />
        </ul>
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.callstackEmpty'"></div>
    </div>
  `
};