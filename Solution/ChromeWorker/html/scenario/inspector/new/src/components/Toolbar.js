window.Toolbar = {
  name: 'Toolbar',

  props: {
    search: {
      default: true,
      type: Boolean
    },

    items: {
      required: true,
      type: Array
    }
  },

  data() {
    return {
      dropdown: false,
      visible: false,
      query: ''
    }
  },

  computed: {
    sortings() {
      return this.items.filter(item => item.type === 'sorting');
    },
    
    filters() {
      return this.items.filter(item => item.type === 'filter');
    }
  },

  methods: {
    setActiveItem(item, inclusive) {
      if (!inclusive) this.items.forEach(v => {
        if (v.type === item.type && v.name !== item.name) v.active = false;
      });

      item.active = !item.active;
    },

    toggleDropdown() {
      this.dropdown = !this.dropdown;
    },

    toggleVisible() {
      this.visible = !this.visible;
    }
  },

  template: String.raw`
    <div class="app-toolbar">
      <CollapseTransition>
        <div v-show="visible" class="app-toolbar-panel">
          <input v-model.trim="query" type="text" class="app-toolbar-input" :placeholder="$t('toolbar.placeholder')" :disabled="!search">
          <div v-click-outside="() => (dropdown = false)" class="dropdown" :class="{ open: dropdown }">
            <button @click="toggleDropdown" type="button" :aria-expanded="dropdown.toString()" aria-haspopup="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#606060" d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" />
              </svg>
            </button>
            <transition name="fade">
              <ul v-show="dropdown" class="app-toolbar-menu" role="menu">
                <li v-for="item in sortings" :key="item.name" :class="{ active: item.active }" role="presentation">
                  <a @click.prevent="setActiveItem(item, false)" href="#" role="menuitem">
                    <span v-t="'toolbar.sortings.' + item.name"></span>
                    <img src="src/assets/icons/arrows.svg" alt="icon">
                  </a>
                </li>
                <li v-if="!!sortings.length">
                  <hr class="divider">
                </li>
                <li v-for="item in filters" :key="item.name" :class="{ active: item.active }" role="presentation">
                  <a @click.prevent="setActiveItem(item, true)" href="#" role="menuitem">
                    <span v-t="'toolbar.filters.' + item.name"></span>
                    <img src="src/assets/icons/check.svg" alt="icon">
                  </a>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </CollapseTransition>
      <button @click="toggleVisible" class="app-toolbar-toggle" type="button">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: visible ? '' : 'rotate(180deg)' }">
          <path fill="#606060" d="M3.51482 9.79281L7.75743 5.55014L12.0001 9.79284L11.2931 10.5L7.75754 6.96435L4.22192 10.4999L3.51482 9.79281Z" />
        </svg>
      </button>
    </div>
  `
};