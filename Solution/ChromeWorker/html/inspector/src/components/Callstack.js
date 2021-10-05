window.Callstack = {
  name: 'Callstack',

  components: {
    Toolbar
  },

  props: {
    source: {
      default: () => [],
      required: true,
      type: Array
    }
  },

  data() {
    return {
      filters: [
        'Functions',
        'Actions',
      ]
    }
  },

  computed: {
    isEmpty() {
      return this.source.length === 0;
    }
  },

  template: html`
    <div>
      <Toolbar :filters="filters" :sortings="[]" />
      <div v-show="!isEmpty" class="inspector-panel-data"></div>
      <div v-show="isEmpty" class="inspector-panel-info">
        <span>{{ $t('tabs.callstackEmpty') }}</span>
      </div>
    </div>
  `
};