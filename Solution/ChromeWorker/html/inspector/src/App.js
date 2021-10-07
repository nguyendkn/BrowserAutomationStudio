window.App = {
  name: 'App',

  components: {
    Variables,
    Resources,
    Callstack
  },

  data() {
    return {
      tab: 'variables',
      variables: {},
      resources: {},
      callstack: [],
    }
  },

  destroyed() {
    window.removeEventListener('message', this.handleFrameEvent);
  },

  mounted() {
    window.addEventListener('message', this.handleFrameEvent);
  },

  methods: {
    handleFrameEvent(e) {
      // console.log(e);
    },

    hide() {
      window.parent.postMessage({ type: 'hide' }, '*');
    }
  },

  template: html`
    <div class="app-content">
      <div class="app-header">
        <ul class="app-tabs" role="tablist">
          <li v-for="t in ['variables', 'resources', 'callstack']" :key="t" class="app-tab" :class="{ active: tab === t }" role="presentation">
            <a @click.prevent="tab = t" href="#" role="tab">
              <img :src="'src/assets/icons/' + t + '.svg'" alt="icon">
              {{ $t('nav.' + t) }}
            </a>
          </li>
        </ul>
        <button @click="hide" type="button">
          <svg viewBox="0 0 16 16" height="16" width="16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#606060" d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" />
          </svg>
        </button>
      </div>
      <div class="app-panels">
        <Variables :source="variables" v-show="tab === 'variables'" class="app-panel" />
        <Resources :source="resources" v-show="tab === 'resources'" class="app-panel" />
        <Callstack :source="callstack" v-show="tab === 'callstack'" class="app-panel" />
      </div>
    </div>
  `
};