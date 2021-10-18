window.CallstackItem = {
  name: 'CallstackItem',

  props: {
    options: {
      required: true,
      type: Object
    },

    type: {
      required: true,
      type: String
    },

    name: {
      required: true,
      type: String
    },

    id: {
      required: true,
      type: Number
    }
  },

  data() {
    return {
      preview: true
    };
  },

  computed: {
    hasArguments() {
      return Object.keys(this.options.arguments).length > 0;
    },

    argValues() {
      return Object.values(this.options.arguments);
    },

    argKeys() {
      return Object.keys(this.options.arguments);
    }
  },

  methods: {
    togglePreview() {
      this.preview = !this.preview;
    }
  },

  template: /*html*/`
    <li class="callstack-item" :class="{ preview }">
      <div class="callstack-item-title">
        <img :src="'src/assets/icons/' + (type === 'action' ? 'gear' : 'flash') + '.svg'">
        <span class="callstack-item-name">{{ name }}:</span>
        <span v-if="type === 'function'" class="callstack-item-data">
          <span class="callstack-item-bracket">[</span>
          <span class="callstack-item-preview">{{ argValues.join(', ') }}</span>
          <span class="callstack-item-bracket">]</span>
        </span>
        <span v-else class="callstack-item-data">
          <span>{{ name === 'If' ? options.expression : options.iterator }}</span>
        </span>
        <button v-if="hasArguments" class="callstack-toggle-params" type="button" @click="togglePreview">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: !preview ? '' : 'rotate(180deg)' }">
            <path fill="#606060" d="M3.51482 9.79281L7.75743 5.55014L12.0001 9.79284L11.2931 10.5L7.75754 6.96435L4.22192 10.4999L3.51482 9.79281Z" />
          </svg>
        </button>
      </div>
      <ul v-if="hasArguments" v-show="!preview" class="callstack-item-params">
        <li v-for="(value, name) in options.arguments" :key="name" class="callstack-item-param">
          <span>{{ name }}:</span>
          <span>{{ value }}</span>
        </li>
      </ul>
    </li>
  `
};