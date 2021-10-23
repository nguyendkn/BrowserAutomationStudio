window.ResourcesPanel = {
  name: 'ResourcesPanel',

  components: {
    PanelToolbar,
    TreeView
  },

  props: {
    title: {
      required: true,
      type: String
    },

    data: {
      required: true,
      type: Object
    }
  },

  data() {
    const filters = ['undefined', 'boolean', 'object', 'string', 'number', 'array', 'date', 'null'],
      sortings = ['alphabetically', 'dateModified', 'dateCreated', 'frequency'];

    return {
      sortings: sortings.map((name, idx) => ({ name, active: idx === 0 })),
      filters: filters.map(name => ({ name, active: true })),
      query: ''
    };
  },

  computed: {
    isEmpty() {
      return !Object.keys(this.data).length;
    }
  },

  template: /*html*/`
    <div class="app-panel">
      <PanelToolbar :sortings.sync="sortings" :filters.sync="filters" :query.sync="query">
        <template #buttons>
          <button type="button" @click="$refs.view.addGroup()" style="border-left: 0;">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 3.5V2h-6v12h15V3.5h-9Zm8 9.5h-13V5h13v8Z" fill="#606060" />
              <path d="M7.5 12h1V9.5H11v-1H8.5V6h-1v2.5H5v1h2.5V12Z" fill="#606060" />
            </svg>
          </button>
        </template>
      </PanelToolbar>
      <div v-show="!isEmpty" class="app-panel-content">
        <TreeView ref="view" :data="data" :filters="filters" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="title"></div>
    </div>
  `
};
