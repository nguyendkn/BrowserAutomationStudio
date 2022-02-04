'use strict';

window.PanelToolbar = {
  name: 'PanelToolbar',

  model: {
    prop: 'query',
  },

  props: {
    search: {
      type: Boolean,
      default: true,
    },

    query: {
      type: String,
      default: '',
    },
  },

  computed: {
    panelVisible() {
      return this.$store.state.toolbarVisible;
    },
  },

  template: /*html*/ `
    <div v-show="panelVisible" class="app-toolbar">
      <input :value="query" :disabled="!search" :placeholder="$t('toolbar.placeholder')" class="app-toolbar-input" spellcheck="false" type="text" @input="$emit('input', $event.target.value)" @keydown.esc="$emit('input', '')">
      <button type="button" @click="$emit('input', '')">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.87348 12.2583L3.93414 13.3189L8 9.25305L12.0659 13.3189L13.1265 12.2583L9.06066 8.19239L13.1265 4.12652L12.0659 3.06586L8 7.13173L3.93414 3.06586L2.87348 4.12652L6.93934 8.19239L2.87348 12.2583Z" fill="#606060" />
        </svg>
      </button>
    </div>
  `,
};
