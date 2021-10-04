window.App = {
  name: 'App',

  data: () => ({
    activeTab: 'variables'
  }),

  destroyed() {
    window.removeEventListener('message', this.handleFrameEvent);
  },

  mounted() {
    window.addEventListener('message', this.handleFrameEvent);
  },

  methods: {
    isActive(tab) {
      return this.activeTab === tab;
    },

    setActive(tab) {
      this.activeTab = tab;
    },

    handleFrameEvent(e) {
      const { data } = e;
      // console.log(e);
    },

    hide() {
      window.parent.postMessage({ type: 'hide' }, '*');
    }
  },

  template: html`
    <div class="inspector-content">
      <div class="inspector-header">
        <ul class="inspector-tabs" role="tablist">
          <li class="inspector-tab" :class="{ active: isActive('variables') }" role="presentation">
            <a @click.prevent="setActive('variables')" href="#variables" role="tab">
              <img src="src/assets/icons/variables.svg" alt="icon">
              {{ $t('nav.variables') }}
            </a>
          </li>
          <li class="inspector-tab" :class="{ active: isActive('resources') }" role="presentation">
            <a @click.prevent="setActive('resources')" href="#resources" role="tab">
              <img src="src/assets/icons/resources.svg" alt="icon">
              {{ $t('nav.resources') }}
            </a>
          </li>
          <li class="inspector-tab" :class="{ active: isActive('callstack') }" role="presentation">
            <a @click.prevent="setActive('callstack')" href="#callstack" role="tab">
              <img src="src/assets/icons/callstack.svg" alt="icon">
              {{ $t('nav.callstack') }}
            </a>
          </li>
        </ul>
        <button @click="hide()" type="button">
          <svg viewBox="0 0 16 16" height="16" width="16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#606060" d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" />
          </svg>
        </button>
      </div>
      <div class="inspector-content">
        <div v-show="isActive('variables')" id="variables">
          Variables content
        </div>
        <div v-show="isActive('resources')" id="resources">
          Resources content
        </div>
        <div v-show="isActive('callstack')" id="callstack">
          Call stack content
        </div>
      </div>
      <div class="inspector-notice" v-show="false">
        <span>Data will be loaded at the next script pause</span>
      </div>
    </div>
  `
};