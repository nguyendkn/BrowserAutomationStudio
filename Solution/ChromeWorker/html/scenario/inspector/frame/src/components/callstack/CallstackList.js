'use strict';

window.CallstackList = {
  name: 'CallstackList',

  components: {
    CallstackItem
  },

  props: {
    filters: {
      required: true,
      type: Array
    },

    data: {
      required: true,
      type: Array
    }
  },

  methods: {
    isVisible({ type }) {
      return this.filters.some(f => f.includes(type));
    }
  },

  template: html`
    <ul class="callstack-list">
      <callstack-item v-for="item in data" v-show="isVisible(item)" :key="item.id" v-bind="item" />
    </ul>
  `
};
