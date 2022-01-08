'use strict';

window.CallstackItem = {
  name: 'CallstackItem',

  props: {
    options: {
      required: true,
      type: Object,
    },

    type: {
      required: true,
      type: String,
    },

    name: {
      required: true,
      type: String,
    },

    id: {
      required: true,
      type: Number,
    },
  },

  data() {
    return {
      preview: true,
      overflow: false,
      overflowWidth: -1,
      overflowHeight: -1,
    };
  },

  computed: {
    hasArguments() {
      return this.size > 0;
    },

    isFunction() {
      return this.type === 'function';
    },

    isAction() {
      return this.type === 'action';
    },

    size() {
      const args = this.options.arguments;
      return Object.keys(args).length;
    },
  },

  mounted() {
    this.$nextTick(() => this.handleResize.call(this));
  },

  created() {
    window.addEventListener('resize', this.handleResize);
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

  methods: {
    handleResize() {
      if (this.isAction) {
        const { offsetHeight, scrollHeight } = this.$refs.preview;
        if (offsetHeight < scrollHeight && this.preview) {
          this.overflowHeight = scrollHeight;
        }
  
        const { offsetWidth, scrollWidth } = this.$refs.preview;
        if (offsetWidth < scrollWidth && this.preview) {
          this.overflowWidth = scrollWidth;
        }
  
        this.overflow = offsetHeight < this.overflowHeight || offsetWidth < this.overflowWidth;
        if (!this.overflow) this.preview = true;
      }
    },

    focusAction() {
      const message = {
        type: 'focusAction',
        payload: { id: this.id },
      };
      window.top.postMessage(message, '*');
    },
  },

  template: /*html*/ `
    <li class="callstack-item" :class="{ preview, action: isAction, function: isFunction }">
      <div class="callstack-item-title">
        <img :src="'src/assets/icons/' + (isAction ? 'gear' : 'flash') + '.svg'" alt>
        <span class="callstack-item-name" @click="focusAction">{{ name + (hasArguments || isAction ? ':' : '') }}</span>
        <span ref="preview" class="callstack-item-data">
          <template v-if="isAction"><span>{{ name === 'If' ? options.expression : options.iterator }}</span></template>
          <template v-else-if="hasArguments"><span v-show="preview">[{{ $tc('items', size) }}]</span></template>
        </span>
        <button v-show="hasArguments || overflow" type="button" class="callstack-toggle-params" @click="preview = !preview">
          <icon-chevron :style="{ transform: preview ? 'rotate(180deg)' : '' }" />
        </button>
      </div>
      <ul v-if="hasArguments" v-show="!preview" class="callstack-item-params">
        <li v-for="(value, name) in options.arguments" :key="name" class="callstack-item-param">
          <span class="callstack-item-param-name">{{ name }}:</span>
          <span class="callstack-item-param-value">{{ value }}</span>
        </li>
      </ul>
    </li>
  `,
};
