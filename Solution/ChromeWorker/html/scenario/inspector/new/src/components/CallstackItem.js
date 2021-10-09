window.CallstackItem = {
  name: 'CallstackItem',

  props: {
    item: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      preview: true
    }
  },

  computed: {
    hasArguments() {
      const { arguments } = this.item;
      return arguments && Object.keys(arguments).length > 0;
    },

    iconPath() {
      const { type } = this.item;
      return `src/assets/icons/${type === 'action' ? 'gear' : 'flash'}.svg`;
    },

    argValues() {
      return Object.values(this.item.arguments || {});
    },

    argKeys() {
      return Object.keys(this.item.arguments || {});
    }
  },

  template: html`
    <li class="callstack-item">
      <div class="callstack-item-title">
        <img class="callstack-item-icon" :src="iconPath">
        <span class="callstack-item-name">{{ item.name }}:</span>
        <span v-if="item.type === 'function'" class="callstack-item-data">
          <span class="callstack-item-bracket">[</span>
          <span class="callstack-item-preview">{{ argValues.join(', ') }}</span>
          <span class="callstack-item-bracket">]</span>
        </span>
        <span v-else class="callstack-item-data">
          <span>
            {{ item.name === 'If' ? item.expression : item.iterator }}
          </span>
        </span>
        <button v-else class="callstack-toggle-params" type="button">
          
        </button>
      </div>
      <ul v-if="hasArguments" v-show="!preview" class="callstack-item-params">
        <li v-for="(value, name) in item.arguments" :key="name" class="callstack-item-param">
          <span>{{ name }}:</span>
          <span>{{ value }}</span>
        </li>
      </ul>
    </li>
  `
};