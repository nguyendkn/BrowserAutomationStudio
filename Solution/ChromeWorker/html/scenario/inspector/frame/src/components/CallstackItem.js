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
    return { preview: true };
  },

  computed: {
    hasArguments() {
      return this.size > 0;
    },

    size() {
      return Object.keys(this.options.arguments).length;
    }
  },

  methods: {
    togglePreview() {
      this.preview = !this.preview;
    },

    focusAction() {
      window.top.postMessage({
        type: 'focusAction',
        json: { id: this.id }
      }, '*');
    }
  },

  template: /*html*/`
    <li class="callstack-item" :class="{ preview }">
      <div class="callstack-item-title">
        <img :src="'src/assets/icons/' + (type === 'action' ? 'gear' : 'flash') + '.svg'" alt>
        <span class="callstack-item-name" @click="focusAction">{{ name }}:</span>
        <span v-if="type === 'function'" class="callstack-item-data">
          <span v-show="preview">[{{ $tc('items', size) }}]</span>
        </span>
        <span v-else class="callstack-item-data">
          <span>{{ name === 'If' ? options.expression : options.iterator }}</span>
        </span>
        <button v-if="hasArguments" class="callstack-toggle-params" type="button" @click="togglePreview">
          <icon-chevron :style="{ transform: preview ? 'rotate(180deg)' : '' }" />
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
