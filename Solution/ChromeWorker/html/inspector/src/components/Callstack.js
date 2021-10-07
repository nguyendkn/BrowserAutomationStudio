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
      filters: [
        'functions',
        'actions'
      ]
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
      <div v-show="!isEmpty" class="inspector-panel-data"></div>
      <div v-show="isEmpty" class="inspector-panel-info">{{ $t('tabs.callstackEmpty') }}</div>
    </div>
  `
};