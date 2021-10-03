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
      console.log(e);
    },

    hide() {
      window.parent.postMessage({ type: 'hide' }, '*');
    }
  },

  template: html`
    <div class="inspector-content">
      <div class="inspector-header">
        <ul class="inspector-tabs" role="tablist">
          <li class="inspector-tab" :class="{ active: isActive('variables') }">
            <a @click.prevent="setActive('variables')" href="#variables">
              {{ $t('nav.variables') }}
            </a>
          </li>
          <li class="inspector-tab" :class="{ active: isActive('resources') }">
            <a @click.prevent="setActive('resources')" href="#resources">
              {{ $t('nav.resources') }}
            </a>
          </li>
          <li class="inspector-tab" :class="{ active: isActive('callstack') }">
            <a @click.prevent="setActive('callstack')" href="#callstack">
              {{ $t('nav.callstack') }}
            </a>
          </li>
        </ul>
        <button @click="hide()" type="button" style="min-width: 28px; border: none; background: #fafafa;">
          <svg viewBox="0 0 12 12" height="12" width="12" fill="#000" style="vertical-align: middle;">
            <path d="M12 1.0501l-1.05-1.05L6 4.9501 1.05.0001 0 1.0501l4.95 4.95-4.95 4.95 1.05 1.05L6 7.0501l4.95 4.95 1.05-1.05-4.95-4.95 4.95-4.95z" />
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
        <span>"Data will be loaded at the next script pause"</span>
      </div>
    </div>
  `
};