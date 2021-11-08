'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  props: {
    value: {
      required: true
    },

    name: {
      required: true,
      type: [String, Number]
    },

    path: {
      required: true,
      type: Array
    }
  },

  data() {
    const type = getType(this.value);

    const colors = {
      undefined: '#8546bc',
      boolean: '#2525cc',
      number: '#d036d0',
      string: '#2db669',
      date: '#ce904a',
      null: '#808080'
    };

    return { color: colors[type], type };
  },

  template: html`
    <span class="jt-node">
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
          <json-tree-node v-for="(val, key) in value" :key="key" :value="val" :name="key" :path="path.concat(key)" />
          <span class="jt-bracket">}</span>
        </template>
        <template v-else-if="type === 'array'">
          <span class="jt-bracket">[</span>
          <json-tree-node v-for="(val, idx) in value" :key="idx" :value="val" :name="idx" :path="path.concat(idx)" />
          <span class="jt-bracket">]</span>
        </template>
        <template v-else>{{ value }}</template>
      </span>
    </span>
  `
};
