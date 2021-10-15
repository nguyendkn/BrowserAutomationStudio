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
    },

    query: {
      default: '',
      type: String
    }
  },

  data() {
    return {
      dropdown: false,
      visible: false
    }
  },

  methods: {
    updateSorting({ name }) {
      this.$emit('update:sortings', this.sortings.map(item => ({
        ...item,
        active: item.name === name
      })));
    },

    updateFilter({ name }) {
      this.$emit('update:filters', this.filters.map(item => ({
        ...item,
        active: item.name === name ? !item.active : item.active
      })));
    },

    updateQuery(event) {
      const query = event.target.value.trim();
      this.$emit('update:query', query.toLowerCase());
    },

    toggleDropdown() {
      this.dropdown = !this.dropdown;
    },

    toggleVisible() {
      this.visible = !this.visible;
    }
  },

  template: /*html*/`
    <div class="app-toolbar">
      <collapse-transition>
        <div v-show="visible" class="app-toolbar-panel">
          <input :value="query" :placeholder="$t('toolbar.placeholder')" :disabled="!search" class="app-toolbar-input" type="text" @input="updateQuery">
          <div :class="{ open: dropdown }" class="dropdown" v-click-outside="() => dropdown = false">
            <button :aria-expanded="dropdown.toString()" aria-haspopup="true" type="button" @click="toggleDropdown">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="#606060" d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" />
              </svg>
            </button>
            <transition name="fade">
              <ul v-show="dropdown" class="app-toolbar-menu">
                <li v-for="item in sortings" :key="item.name" :class="{ active: item.active }">
                  <a href="#" @click.prevent="updateSorting(item)">
                    <span v-t="'toolbar.sortings.' + item.name"></span>
                    <img src="src/assets/icons/arrows.svg" alt>
                  </a>
                </li>
                <li v-if="!!sortings.length">
                  <hr class="divider">
                </li>
                <li v-for="item in filters" :key="item.name" :class="{ active: item.active }">
                  <a href="#" @click.prevent="updateFilter(item)">
                    <span v-t="'toolbar.filters.' + item.name"></span>
                    <img src="src/assets/icons/check.svg" alt>
                  </a>
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </collapse-transition>
      <button class="app-toolbar-toggle" type="button" @click="toggleVisible">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: visible ? '' : 'rotate(180deg)' }">
          <path fill="#606060" d="M3.51482 9.79281L7.75743 5.55014L12.0001 9.79284L11.2931 10.5L7.75754 6.96435L4.22192 10.4999L3.51482 9.79281Z" />
        </svg>
      </button>
    </div>
  `
};