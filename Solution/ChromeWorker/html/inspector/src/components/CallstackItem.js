window.CallstackItem = {
  name: 'CallstackItem',

  props: {
    data: {
      required: true,
      type: Object
    }
  },

  template: html`
    <li class="callstack-item">
      <div>
        <span class="callstack-item-name">{{ item.name }}:</span>
        <span v-if="type === 'action'" class="callstack-item-data text-truncate">
          {{ item.name === 'If' ? item.expression : item.iterator }}
        </span>
        <button v-else class="callstack-toggle-params" type="button">
          <i class="fa fa-minus"></i>
          <i class="fa fa-plus"></i>
        </button>
      </div>
      <ul class="callstack-item-params">
        <li v-for="arg in item.arguments" :key="arg.name" class="callstack-item-param">
          <span>{{ arg.name }}:</span>
          <span>{{ arg.value }}</span>
        </li>
      </ul>
    </li>
  `
};