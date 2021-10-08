window.CallstackItem = {
  name: 'CallstackItem',

  props: {
    item: {
      required: true,
      type: Object
    }
  },

  computed: {
    hasArguments() {
      const { arguments } = this.item;
      return arguments && Object.keys(arguments).length > 0;
    }
  },

  template: html`
    <li class="callstack-item">
      <div>
        <span class="callstack-item-name">{{ item.name }}:</span>
        <span v-if="item.type === 'action'" class="callstack-item-data text-truncate">
          {{ item.name === 'If' ? item.expression : item.iterator }}
        </span>
        <button v-else class="callstack-toggle-params" type="button">
          <i class="fa fa-minus"></i>
          <i class="fa fa-plus"></i>
        </button>
      </div>
      <ul v-if="hasArguments" class="callstack-item-params">
        <li v-for="(value, name) in item.arguments" :key="name" class="callstack-item-param">
          <span>{{ name }}:</span>
          <span>{{ value }}</span>
        </li>
      </ul>
    </li>
  `
};