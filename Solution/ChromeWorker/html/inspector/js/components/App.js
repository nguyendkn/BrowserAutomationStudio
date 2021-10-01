window.App = {
  template: /*html*/`
    <div>
      <nav>
        <li :class="{ active: isActive('variables') }">
          <a v-on:click.prevent="setActive('variables')" href="#variables">Variables</a>
        </li>
        <li :class="{ active: isActive('resources') }">
          <a v-on:click.prevent="setActive('resources')" href="#resources">Resources</a>
        </li>
        <li :class="{ active: isActive('callstack') }">
          <a v-on:click.prevent="setActive('callstack')" href="#callstack">Callstack</a>
        </li>
      </nav>
      <div>
        <div v-show="isActive('variables')" id="variables">Variables</div>
        <div v-show="isActive('resources')" id="resources">Resources</div>
        <div v-show="isActive('callstack')" id="callstack">Callstack</div>
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
    }
  }
};