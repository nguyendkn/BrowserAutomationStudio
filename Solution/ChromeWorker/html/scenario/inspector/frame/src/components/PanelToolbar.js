'use strict';

window.PanelToolbar = {
  name: 'PanelToolbar',

  model: {
    prop: 'query',
  },

  props: {
    sortings: {
      type: Array,
      default: () => [],
    },

    filters: {
      type: Array,
      default: () => [],
    },

    search: {
      type: Boolean,
      default: true,
    },

    order: {
      type: String,
      default: '',
    },

    query: {
      type: String,
      default: '',
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
    toggleSorting(item) {
      if (item.active) this.$emit('update:order', this.order === 'descending' ? 'asending' : 'descending');
      const sortings = this.sortings.map(({ name, active }) => ({
        active: name === item.name,
        name,
      }));
      this.$emit('update:sortings', sortings);
    },

    toggleFilter(item) {
      const filters = this.filters.map(({ name, active }) => ({
        active: name === item.name ? !active : active,
        name,
      }));
      this.$emit('update:filters', filters);
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

  template: /*html*/ `
    <div class="app-toolbar">
      <div v-show="panelVisible" class="app-toolbar-panel">
        <input :value="query" :disabled="!search" :placeholder="$t('toolbar.placeholder')" class="app-toolbar-input" spellcheck="false" type="text" @input="$emit('input', $event.target.value)">
        <slot name="controls"></slot>
        <div :class="{ open: menuVisible }" class="dropdown" v-click-outside="hideMenu">
          <button type="button" @click="toggleMenu">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" fill="#606060" />
            </svg>
          </button>
          <div v-show="menuVisible" class="app-toolbar-menu-wrapper">
            <ul class="app-toolbar-menu">
              <li v-for="item in sortings" :key="item.name" :class="{ active: item.active }">
                <a href="#" @click.prevent="toggleSorting(item)">
                  <span v-t="'toolbar.sortings.' + item.name"></span>
                  <img :style="{ transform: order === 'descending' ? 'rotate(180deg)' : '' }" src="src/assets/icons/arrows.svg" alt>
                </a>
              </li>
              <li v-if="!!sortings.length">
                <hr class="divider">
              </li>
              <li v-for="item in filters" :key="item.name" :class="{ active: item.active }">
                <a href="#" @click.prevent="toggleFilter(item)">
                  <span v-t="'toolbar.filters.' + item.name"></span>
                  <img src="src/assets/icons/check.svg" alt>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button type="button" class="app-toolbar-toggle" @click="$store.commit('toggleToolbar')">
        <icon-chevron :style="{ transform: panelVisible ? '' : 'rotate(180deg)' }" />
      </button>
    </div>
  `,
};
