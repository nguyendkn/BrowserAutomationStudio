window.Callstack = {
  name: 'Callstack',

  components: {
    Toolbar
  },

  props: {
    source: {
      default: () => [],
      type: Array
    }
  },

  data() {
    return {
      filters: ['functions', 'actions']
    }
  },

  computed: {
    isEmpty() {
      return Object.keys(this.source).length === 0;
    }
  },

  template: html`
    <div>
      <Toolbar :filters="filters" :sortings="[]" :search="false" />
      <div v-show="isEmpty" class="app-panel-info">{{ $t('tabs.callstackEmpty') }}</div>
      <div v-show="!isEmpty" class="app-panel-data"></div>
    </div>
  `
};