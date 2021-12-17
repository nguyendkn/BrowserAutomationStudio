'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  props: {
    value: {
      required: true,
    },

    name: {
      required: true,
      type: [String, Number],
    },

    path: {
      required: true,
      type: Array,
    },
  },

  data() {
    const colors = {
      undefined: '#8546bc',
      boolean: '#2525cc',
      number: '#d036d0',
      string: '#2db669',
      date: '#ce904a',
      null: '#808080',
    };

    return { colors, isExpanded: false };
  },

  computed: {
    keys() {
      const { value } = this;
      return value == null ? [] : Object.keys(value);
    },

    color() {
      return this.colors[this.type];
    },

    type() {
      return getType(this.value);
    },
  },

  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
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

  template: html`
    <span class="jt-node">
      <span class="jt-node-label">
        <slot name="label" :label="name">{{ name }}</slot><span>:&nbsp;</span>
      </span>
      <span :style="{ color }" class="jt-node-value">
        <template v-if="type === 'undefined' || type === 'null'">
          {{ String(value) }}
        </template>
        <template v-else-if="type === 'string'">
          <span>"{{ value }}"</span>
        </template>
        <template v-else-if="type === 'object'">
          <span class="jt-bracket">{</span>
          <json-tree-node
            v-for="key in keys"
            v-show="isExpanded"
            :key="key"
            :name="key"
            :value="value[key]"
            :path="path.concat(key)"
          />
          <span v-show="!isExpanded">{{ $tc('items', keys.length) }}</span>
          <span class="jt-bracket">}</span>
        </template>
        <template v-else-if="type === 'array'">
          <span class="jt-bracket">[</span>
          <json-tree-node
            v-for="key in keys"
            v-show="isExpanded"
            :key="key"
            :name="key"
            :value="value[key]"
            :path="path.concat(key)"
          />
          <span v-show="!isExpanded">{{ $tc('items', keys.length) }}</span>
          <span class="jt-bracket">]</span>
        </template>
        <template v-else-if="type === 'date'">{{ formatDate(value) }}</template>
        <template v-else>{{ value }}</template>
      </span>
      <div style="position: absolute; display: flex; right: 0; top: 0;">
        <button type="button" @click="edit">
          <icon-edit style="display: block;" />
        </button>
        <button v-if="(type === 'object' || type  === 'array') && keys.length" type="button" style="margin-left: 12px;" @click="toggle">
          <icon-chevron :style="{ transform: isExpanded ? '' : 'rotate(180deg)' }" style="display: block;" />
        </button>
      </div>
    </span>
  `,
};
