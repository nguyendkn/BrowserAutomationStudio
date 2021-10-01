window.App = {
  template: /*html*/`
    <div>
      <nav>
        <li>
          <a v-on:click.prevent="setActive('variables')" :class="{ active: isActive('variables') }" href="#variables">Variables</a>
        </li>
        <li>
          <a v-on:click.preventt="setActive('resources')" :class="{ active: isActive('resources') }" href="#resources">Resources</a>
        </li>
        <li>
          <a v-on:click.prevent="setActive('callstack')" :class="{ active: isActive('callstack') }" href="#callstack">Callstack</a>
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