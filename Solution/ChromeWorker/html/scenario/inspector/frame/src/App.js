window.App = {
  name: 'App',

  data() {
    const tabs = [
      {
        component: ResourcesPanel,
        name: 'variables',
        options: {
          title: 'tabs.variablesEmpty',
          data: { ...json }
        }
      },
      {
        component: ResourcesPanel,
        name: 'resources',
        options: {
          title: 'tabs.resourcesEmpty',
          data: { ...json }
        }
      },
      {
        component: CallstackPanel,
        name: 'callstack',
        options: {
          title: 'tabs.callstackEmpty',
          data: []
        }
      }
    ];

    return { tabs, tab: tabs[0].name };
  },

  destroyed() {
    window.removeEventListener('message', this.handleMessage);
  },

  created() {
    window.addEventListener('message', this.handleMessage);
  },

  methods: {
    handleMessage({ data }) {
      if (data.payload != null) {
        for (const [key, val] of Object.entries(data.payload)) {
          const tab = this.tabs.find(t => t.name === key);
          if (tab) this.$set(tab.options, 'data', val);
        }
      }
    },

    show() {
      window.parent.postMessage({ type: 'show' }, '*');
    },

    hide() {
      window.parent.postMessage({ type: 'hide' }, '*');
    }
  },

  template: /*html*/`
    <div class="app-content">
      <div class="app-header">
        <ul class="app-tabs">
          <li v-for="t in tabs" :key="t.name" :class="{ active: tab === t.name }" class="app-tab">
            <a href="#" @click.prevent="tab = t.name">
              <img :src="'src/assets/icons/' + t.name + '.svg'" alt>
              {{ $t('nav.' + t.name) }}
            </a>
          </li>
        </ul>
        <button type="button" @click="hide">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#606060" d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" />
          </svg>
        </button>
      </div>
      <div class="app-panels">
        <template v-for="t in tabs">
          <component :is="t.component" v-show="tab === t.name" v-bind="t.options" />
        </template>
      </div>
    </div>
  `
};
