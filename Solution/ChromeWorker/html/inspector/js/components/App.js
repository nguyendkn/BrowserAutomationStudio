window.App = {
  template: /*html*/`
    <div>
      <nav>
        <li :class="{ active: isActive('variables') }">
          <a v-on:click.prevent="setActive('variables')" href="#variables">
            {{ $t('nav.variables') }}
          </a>
        </li>
        <li :class="{ active: isActive('resources') }">
          <a v-on:click.prevent="setActive('resources')" href="#resources">
            {{ $t('nav.resources') }}
          </a>
        </li>
        <li :class="{ active: isActive('callstack') }">
          <a v-on:click.prevent="setActive('callstack')" href="#callstack">
            {{ $t('nav.callstack') }}
          </a>
        </li>
      </nav>
      <div>
        <div v-show="isActive('variables')" id="variables">Variables</div>
        <div v-show="isActive('resources')" id="resources">Resources</div>
        <div v-show="isActive('callstack')" id="callstack">Call stack</div>
      </div>
    </div>
  `,
  name: 'App',
  components: {},
  data() {
    return {
      activeTab: 'variables'
    };
  },
  methods: {
    isActive(tab) {
      return this.activeTab === tab;
    },
    setActive(tab) {
      this.activeTab = tab;
    },
    handleFrameEvent({ data }) {
      console.log(data)
    },
  },
  mounted() {
    window.addEventListener('message', this.handleFrameEvent);
  }
};