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
      filters: ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
      sortings: [],
    }
  },

  computed: {
    isEmpty() {
      return Object.keys(this.source).length === 0;
    }
  },

  template: html`
    <div>
      <Toolbar :filters="filters" :sortings="sortings" />
      <div v-show="!isEmpty" class="inspector-panel-data"></div>
      <div v-show="isEmpty" class="inspector-panel-info">
        <span>{{ $t('tabs.variablesEmpty') }}</span>
      </div>
    </div>
  `
};