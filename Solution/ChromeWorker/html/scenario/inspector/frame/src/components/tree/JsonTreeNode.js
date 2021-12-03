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
    const type = getType(this.value);

    const colors = {
      undefined: '#8546bc',
      boolean: '#2525cc',
      number: '#d036d0',
      string: '#2db669',
      date: '#ce904a',
      null: '#808080',
    };

    return { color: colors[type], type, isExpanded: false };
  },

  computed: {
    keys() {
      const { value } = this;
      return value == null ? [] : Object.keys(value);
    },
  },

  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },

    edit() {
      const message = {
        json: {
          value: this.value,
          type: this.type,
          path: this.path,
          mode: this.$root.$children[0].tab.name.slice(0, -1) // TODO: use normal mode detection!
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
    <span class="jt-node" style="position: relative;">
      <span class="jt-node-label">
        <slot name="label" :name="name">{{ name }}</slot>
      </span>
      <span class="jt-node-colon">:&nbsp;</span>
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
        <button @click="edit">
          <icon-edit />
        </button>
        <button v-if="type === 'object' || type  === 'array'" @click="toggle" style="margin-left: 12px;">
          <icon-chevron :style="{ transform: isExpanded ? '' : 'rotate(180deg)' }" />
        </button>
      </div>
    </span>
  `,
};
