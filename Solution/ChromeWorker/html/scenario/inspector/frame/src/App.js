window.App = {
  name: 'App',

  components: {
    ResourcesPanel,
    CallstackPanel
  },

  data() {
    const json = {
      NEW_VARIABLE1: 0,
      NEW_VARIABLE2: false,
      NEW_VARIABLE3: ['STR1', 'STR2'],
      NEW_VARIABLE4: { a: 2, b: 3, c: { d: 4 } }
    };

    return {
      data: {
        variables: { ...json },
        resources: { ...json },
        callstack: []
      },
      tab: 'variables'
    };
  },

  destroyed() {
    window.removeEventListener('message', this.handleMessage);
  },

  mounted() {
    window.addEventListener('message', this.handleMessage);
  },

  methods: {
    handleMessage({ data }) {
      if (data.json) {
        for (const [key, val] of Object.entries(data.json)) {
          this.$set(this.data, key, val);
        }
      }
    },

    hide() {
      window.parent.postMessage({ type: 'hide' }, '*');
    },

    show() {
      window.parent.postMessage({ type: 'show' }, '*');
    }
  },

  template: /*html*/`
    <div class="app-content">
      <div class="app-header">
        <ul class="app-tabs">
          <li v-for="t in ['variables', 'resources', 'callstack']" :key="t" :class="{ active: tab === t }" class="app-tab">
            <a href="#" @click.prevent="tab = t">
              <img :src="'src/assets/icons/' + t + '.svg'" alt>
              {{ $t('nav.' + t) }}
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
        <ResourcesPanel
          v-show="tab === 'variables'"
          title="tabs.variablesEmpty"
          :data="data.variables"
        />
        <ResourcesPanel
          v-show="tab === 'resources'"
          title="tabs.resourcesEmpty"
          :data="data.resources"
        />
        <CallstackPanel
          v-show="tab === 'callstack'"
          :data="data.callstack"
        />
      </div>
    </div>
  `
};