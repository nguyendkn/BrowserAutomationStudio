'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  inject: ['id'],

  props: {
    value: {
      required: true,
    },

    name: {
      required: true,
      type: String,
    },

    path: {
      required: true,
      type: Array,
    },
  },

  data() {
    const expand = this.$store.state[this.id].items[this.path.join('|')] || false;

    return {
      colors: {
        null: '#8546bc',
        date: '#ce904a',
        number: '#d036d0',
        string: '#2db669',
        boolean: '#2525cc',
        undefined: '#808080',
      },
      scaled: {
        null: scale([133, 70, 188]),
        date: scale([206, 144, 74]),
        number: scale([208, 54, 208]),
        string: scale([45, 182, 105]),
        boolean: scale([37, 37, 204]),
        undefined: scale([128, 128, 128]),
      },
      isHovered: false,
      isExpanded: expand,
    };
  },

  computed: {
    indent() {
      const depth = this.path.length;
      return `${24 * (depth - 1)}px`;
    },

    color() {
      return this.colors[this.type];
    },

    scale() {
      return this.scaled[this.type];
    },

    keys() {
      const { value } = this;
      return value ? Object.keys(value) : [];
    },

    type() {
      return typeOf(this.value);
    },
  },

  methods: {
    collapse(signal = false) {
      const { id, path, $refs } = this;

      if (signal && $refs.node) {
        $refs.node.forEach(ref => ref.collapse(true));
      }

      this.$store.commit('setCollapsedItem', { id, path });
      this.isExpanded = false;
    },

    expand(signal = false) {
      const { id, path, $refs } = this;

      if (signal && $refs.node) {
        $refs.node.forEach(ref => ref.expand(true));
      }

      this.$store.commit('setExpandedItem', { id, path });
      this.isExpanded = true;
    },

    toggle(signal = true) {
      if (this.isExpanded) {
        this.collapse(signal);
      } else {
        this.expand(signal);
      }
    },

    edit() {
      const message = {
        payload: {
          value: this.value,
          type: this.type,
          path: this.path,
          mode: this.id,
        },
        type: 'edit',
      };
      window.top.postMessage(message, '*');
    },

    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss [UTC]Z');
    },
  },

  template: /*html*/ `
    <div class="jt-node" :class="{ hovered: isHovered, expanded: isExpanded }" :style="{ '--indent': indent }" @mouseover.stop="isHovered = true" @mouseout.stop="isHovered = false">
      <span class="jt-node-label"><slot name="label" :label="name">{{ name }}</slot>:&nbsp;</span>
      <span class="jt-node-value" :style="{ color }">
        <template v-if="type === 'undefined' || type === 'null'">{{ String(value) }}</template>
        <template v-else-if="type === 'string'">"{{ value }}"</template>
        <template v-else-if="type === 'object'">
          <span class="jt-node-bracket">{</span>
          <json-tree-node
            v-for="key in keys"
            v-show="isExpanded"
            ref="node"
            :key="key"
            :name="key"
            :value="value[key]"
            :path="path.concat(key)"
          />
          <span v-show="!isExpanded" style="color: #606060a6;">{{ $tc('items', keys.length) }}</span>
          <span class="jt-node-bracket">}</span>
        </template>
        <template v-else-if="type === 'array'">
          <span class="jt-node-bracket">[</span>
          <json-tree-node
            v-for="key in keys"
            v-show="isExpanded"
            ref="node"
            :key="key"
            :name="key"
            :value="value[key]"
            :path="path.concat(key)"
          />
          <span v-show="!isExpanded" style="color: #606060a6;">{{ $tc('items', keys.length) }}</span>
          <span class="jt-node-bracket">]</span>
        </template>
        <template v-else-if="type === 'date'">{{ formatDate(value) }}</template>
        <template v-else>{{ value }}</template>
      </span>
      <div class="jt-node-actions">
        <button type="button" @click="edit">
          <icon-edit />
        </button>
        <button v-if="(type === 'object' || type === 'array') && keys.length" type="button" @click="toggle($event.ctrlKey)">
          <icon-chevron :style="{ transform: isExpanded ? '' : 'rotate(180deg)' }" />
        </button>
      </div>
    </div>
  `,
};
