'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  inject: ['id'],

  props: {
    value: {
      required: true,
      validator(value) {
        // prettier-ignore
        return [
          'null',
          'date',
          'array',
          'object',
          'number',
          'string',
          'boolean',
          'undefined',
        ].includes(typeOf(value));
      },
    },

    name: {
      type: String,
      required: true,
    },

    path: {
      type: Array,
      required: true,
    },
  },

  data() {
    const expand = this.$store.state[this.id].nodes[JSON.stringify(this.path)] || false;

    return {
      colors: {
        null: scale([133, 70, 188]),
        date: scale([206, 144, 74]),
        number: scale([208, 54, 208]),
        string: scale([45, 182, 105]),
        boolean: scale([37, 37, 204]),
        undefined: scale([128, 128, 128]),
      },
      counter: 5,
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
      const colors = this.colors[this.type];
      return colors && colors[this.counter];
    },

    keys() {
      const { value } = this;
      return value ? Object.keys(value) : [];
    },

    type() {
      return typeOf(this.value);
    },

    diff() {
      return this.$store.state.diff[this.id];
    },
  },

  watch: {
    diff(diff, { length }) {
      if (length) {
        for (const { path } of diff) {
          if (this.path.length === path.length) {
            if (this.path.every((key, idx) => key === path[idx].toString())) {
              return (this.counter = 0);
            }
          }
        }

        this.counter = Math.min(this.counter + 1, 5);
      }
    },
  },

  methods: {
    collapse() {
      this.$store.commit('setNodeCollapsed', {
        path: this.path,
        id: this.id,
      });
      this.isExpanded = false;
    },

    expand() {
      this.$store.commit('setNodeExpanded', {
        path: this.path,
        id: this.id,
      });
      this.isExpanded = true;
    },

    toggle() {
      if (this.isExpanded) {
        this.collapse();
      } else {
        this.expand();
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
      <span class="jt-node-label" style="display: inline-flex;"><slot name="label" :label="name">{{ name }}</slot>:&nbsp;</span>
      <span class="jt-node-value" :style="{ color }">
        <template v-if="type === 'undefined' || type === 'null'">{{ type }}</template>
        <template v-else-if="type === 'string'">"{{ value }}"</template>
        <template v-else-if="type === 'object'">
          <span class="jt-node-bracket">{</span>
          <template v-if="isExpanded">
            <json-tree-node
              v-for="key in keys"
              :key="key"
              :name="key"
              :value="value[key]"
              :path="path.concat(key)"
            />
          </template>
          <span v-else style="color: #606060a6;">{{ $tc('items', keys.length) }}</span>
          <span class="jt-node-bracket">}</span>
        </template>
        <template v-else-if="type === 'array'">
          <span class="jt-node-bracket">[</span>
          <template v-if="isExpanded">
            <json-tree-node
              v-for="key in keys"
              :key="key"
              :name="key"
              :value="value[key]"
              :path="path.concat(key)"
            />
          </template>
          <span v-else style="color: #606060a6;">{{ $tc('items', keys.length) }}</span>
          <span class="jt-node-bracket">]</span>
        </template>
        <template v-else-if="type === 'date'">{{ formatDate(value) }}</template>
        <template v-else>{{ value }}</template>
      </span>
      <div class="jt-node-actions">
        <button type="button" @click="edit">
          <icon-edit />
        </button>
        <button v-if="(type === 'object' || type === 'array') && keys.length" type="button" @click="toggle">
          <icon-chevron :style="{ transform: isExpanded ? '' : 'rotate(180deg)' }" />
        </button>
      </div>
    </div>
  `,
};
