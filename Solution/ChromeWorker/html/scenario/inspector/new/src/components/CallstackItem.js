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

  methods: {
    togglePreview() {
      this.preview = !this.preview;
    }
  },

  template: String.raw`
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
        <button @click="togglePreview" class="callstack-toggle-params" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: !preview ? '' : 'rotate(180deg)' }">
            <path fill="#606060" d="M3.51482 9.79281L7.75743 5.55014L12.0001 9.79284L11.2931 10.5L7.75754 6.96435L4.22192 10.4999L3.51482 9.79281Z" />
          </svg>
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