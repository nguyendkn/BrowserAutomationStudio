window.Callstack = {
  name: 'Callstack',

  components: {
    Toolbar
  },

  props: {
    source: {
      default: () => [],
      required: true,
      type: Array,
    }
  },

  data() {
    return {}
  },

  computed: {
    isEmpty() {
      return this.source.length === 0;
    }
  },

  template: html`
    <div class="inspector-panel">
      <div v-show="!isEmpty" class="inspector-panel-data"></div>
      <div v-show="isEmpty" class="inspector-panel-info">
        <span>Call stack is empty</span>
      </div>
    </div>
  `
};