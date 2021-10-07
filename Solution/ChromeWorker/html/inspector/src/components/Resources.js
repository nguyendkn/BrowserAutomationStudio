window.Resources = {
  name: 'Resources',

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
      <div v-show="isEmpty" class="app-panel-info">{{ $t('tabs.resourcesEmpty') }}</div>
      <div v-show="!isEmpty" class="app-panel-data"></div>
    </div>
  `
};