'use strict';

window.PanelToolbar = {
  name: 'PanelToolbar',

  props: {
    sortings: {
      default: () => [],
      type: Array,
    },

    filters: {
      default: () => [],
      type: Array,
    },

    search: {
      default: true,
      type: Boolean,
    },

    query: {
      default: '',
      type: String,
    },
  },

  data() {
    return { menuVisible: false };
  },

  computed: {
    panelVisible() {
      return this.$store.state.toolbarVisible;
    },
  },

  methods: {
    updateSortings(name) {
      const sortings = this.sortings.map(item => ({
        ...item,
        active: item.name === name,
      }));
      this.$emit('update:sortings', sortings);
    },

    updateFilters(name) {
      const filters = this.filters.map(item => ({
        ...item,
        active: item.name === name ? !item.active : item.active,
      }));
      this.$emit('update:filters', filters);
    },

    updateQuery(event) {
      const { value } = event.target;
      this.$emit('update:query', value.trim());
    },

    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },

    hideMenu() {
      this.menuVisible = false;
    },

    showMenu() {
      this.menuVisible = true;
    },
  },

  template: `
    <div class="app-toolbar">
      <div v-show="panelVisible" class="app-toolbar-panel">
        <input :value="query" :disabled="!search" :placeholder="$t('toolbar.placeholder')" class="app-toolbar-input" spellcheck="false" type="text" @input="updateQuery">
        <slot name="controls"></slot>
        <div :class="{ open: menuVisible }" class="dropdown" v-click-outside="hideMenu">
          <button type="button" @click="toggleMenu">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" fill="#606060" />
            </svg>
          </button>
          <ul v-show="menuVisible" class="app-toolbar-menu">
            <li v-for="{ name, active } in sortings" :key="name" :class="{ active }">
              <a href="#" @click.prevent="updateSortings(name)">
                <span v-t="'toolbar.sortings.' + name"></span>
                <img src="src/assets/icons/arrows.svg" alt>
              </a>
            </li>
            <li v-if="!!sortings.length">
              <hr class="divider">
            </li>
            <li v-for="{ name, active } in filters" :key="name" :class="{ active }">
              <a href="#" @click.prevent="updateFilters(name)">
                <span v-t="'toolbar.filters.' + name"></span>
                <img src="src/assets/icons/check.svg" alt>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <button type="button" class="app-toolbar-toggle" @click="$store.commit('toggleToolbar')">
        <icon-chevron :style="{ transform: panelVisible ? '' : 'rotate(180deg)' }" />
      </button>
    </div>
  `,
};
