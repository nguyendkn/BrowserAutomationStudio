'use strict';

window.PanelToolbar = {
  name: 'PanelToolbar',

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
      panelVisible: false,
      menuVisible: false
    };
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

    togglePanel() {
      this.panelVisible = !this.panelVisible;
    },

    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    }
  },

  template: /*html*/`
    <div class="app-toolbar">
      <div v-show="panelVisible" class="app-toolbar-panel">
        <input :value="query" :disabled="!search" :placeholder="$t('toolbar.placeholder')" class="app-toolbar-input" type="text" @input="updateQuery">
        <div :class="{ open: menuVisible }" class="dropdown" v-click-outside="() => menuVisible = false">
          <button type="button" @click="toggleMenu">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#606060" d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" />
            </svg>
          </button>
          <ul v-show="menuVisible" class="app-toolbar-menu">
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
        </div>
        <slot name="controls"></slot>
      </div>
      <button class="app-toolbar-toggle" type="button" @click="togglePanel">
        <icon-chevron :style="{ transform: panelVisible ? '' : 'rotate(180deg)' }" />
      </button>
    </div>
  `
};
