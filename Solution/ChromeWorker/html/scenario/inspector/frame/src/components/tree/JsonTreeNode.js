'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

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
    const scale = (color, count = 6) => {
      return [...Array(count).keys()].map(idx => {
        const [r, g, b] = [255, 0, 0].map((v, i) => {
          return Math.round((color[i] - v) * (idx / (count - 1)) + v);
        });
        return `rgb(${r}, ${g}, ${b})`;
      });
    };

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
      isExpanded: false,
    };
  },

  computed: {
    keys() {
      const { value } = this;
      return value ? Object.keys(value) : [];
    },

    color() {
      return this.colors[this.type];
    },

    type() {
      return typeOf(this.value);
    },
  },

  methods: {
    collapse(signal = false) {
      if (signal && (this.type === 'array' || this.type === 'object')) {
        this.$refs.node.forEach(ref => ref.collapse(signal));
      }
      this.isExpanded = false;
      // this.$store.commit('setCollapsedItem', { path: this.path });
    },

    expand(signal = false) {
      if (signal && (this.type === 'array' || this.type === 'object')) {
        this.$refs.node.forEach(ref => ref.expand(signal));
      }
      this.isExpanded = true;
      // this.$store.commit('setExpandedItem', { path: this.path });
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
          mode: this.$root.$children[0].tab.name.slice(0, -1), // TODO: use normal mode detection!
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
    <div class="jt-node" :class="{ hovered: isHovered, expanded: isExpanded }" :style="{ '--indent': 24 * (path.length - 1) + 'px' }" @mouseover.stop="isHovered = true" @mouseout.stop="isHovered = false">
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
