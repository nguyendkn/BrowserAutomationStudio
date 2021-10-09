window.Toolbar = {
  name: 'Toolbar',

  props: {
    sortings: {
      default: () => [],
      type: Array
    },

    filters: {
      default: () => [],
      type: Array
    },

    search: {
      default: true,
      type: Boolean
    }
  },

  data() {
    return {
      dropdown: false,
      visible: true,
      query: ''
    }
  },

  methods: {
    updateSortings(sorting) {
      // TODO
    },

    updateFilters(filter) {
      // TODO
    },

    toggleDropdown() {
      this.dropdown = !this.dropdown;
    }
  },

  template: html`
    <div class="app-toolbar">
      <CollapseTransition>
        <div v-show="visible" class="app-toolbar-panel">
          <input v-model.trim="query" type="text" class="app-toolbar-input" :placeholder="$t('toolbar.placeholder')" :disabled="!search">
          <div class="dropdown" :class="{ open: dropdown }">
            <button @click="toggleDropdown" type="button" :aria-expanded="dropdown.toString()" aria-haspopup="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#606060" d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" />
              </svg>
            </button>
            <transition name="fade">
              <ul v-show="dropdown" class="dropdown-menu app-toolbar-menu" role="menu">
                <li v-for="item in sortings" :key="item" role="presentation">
                  <a v-t="'toolbar.sortings.' + item" @click.prevent="updateSortings(item)" href="#" role="menuitem"></a>
                </li>
                <li v-for="item in filters" :key="item" role="presentation">
                  <a v-t="'toolbar.filters.' + item" @click.prevent="updateFilters(item)" href="#" role="menuitem"></a>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </CollapseTransition>
      <button class="app-toolbar-toggle" type="button" @click="visible = !visible">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: visible ? '' : 'rotate(180deg)' }">
          <path fill="#606060" d="M3.51482 9.79281L7.75743 5.55014L12.0001 9.79284L11.2931 10.5L7.75754 6.96435L4.22192 10.4999L3.51482 9.79281Z" />
        </svg>
      </button>
    </div>
  `
};