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
      const filter = this.filters.find(item => item.name.includes(type));
      return !!filter && filter.active;
    }
  },

  template: /*html*/`
    <ul class="callstack-list">
      <callstack-item v-for="item in data" v-show="isVisible(item)" :key="item.id" v-bind="item" />
    </ul>
  `
};
