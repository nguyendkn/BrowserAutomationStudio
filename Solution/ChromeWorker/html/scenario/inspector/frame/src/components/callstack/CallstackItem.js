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
    return { preview: true, isOverflowing: false };
  },

  created() {
    window.addEventListener('resize', this.handleResize);
  },

  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },

  activated() {
    this.$nextTick().then(this.handleResize);
  },

  computed: {
    hasArguments() {
      return this.size > 0;
    },

    size() {
      return Object.keys(this.options.arguments).length;
    },
  },

  methods: {
    handleResize() {
      if (!this.$refs.preview) return;
      const { offsetWidth, scrollWidth } = this.$refs.preview;
      this.isOverflowing = offsetWidth < scrollWidth;
    },

    togglePreview() {
      this.preview = !this.preview;
    },

    focusAction() {
      window.top.postMessage({
        type: 'focusAction',
        json: { id: this.id }
      }, '*');
    },
  },

  template: html`
    <li class="callstack-item" :class="{ preview }">
      <div class="callstack-item-title">
        <img :src="'src/assets/icons/' + (type === 'action' ? 'gear' : 'flash') + '.svg'" alt>
        <span class="callstack-item-name" @click="focusAction">{{ name }}:</span>
        <span ref="preview" class="callstack-item-data">
          <template v-if="type === 'function'">
            <span v-show="preview">[{{ size > 0 ? $tc('items', size) : '' }}]</span>
          </template>
          <template v-else>
            <span>{{ name === 'If' ? options.expression : options.iterator }}</span>
          </template>
        </span>
        <button v-show="hasArguments || isOverflowing" class="callstack-toggle-params" type="button" @click="togglePreview">
          <icon-chevron :style="{ transform: preview ? 'rotate(180deg)' : '' }" />
        </button>
      </div>
      <ul v-if="hasArguments" v-show="!preview" class="callstack-item-params">
        <li v-for="(value, name) in options.arguments" :key="name" class="callstack-item-param">
          <span>{{ name }}</span>:
          <span>{{ value }}</span>
        </li>
      </ul>
    </li>
  `,
};
