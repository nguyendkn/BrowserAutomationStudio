'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  props: {
    valueFormatter: {
      default: v => v,
      type: Function
    },

    label: {
      required: true,
      type: [String, Number]
    },

    value: {
      required: true
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
        <slot name="label" :label="label">{{ label }}:&nbsp;</slot>
      </span>
      <span :style="{ color }" class="jt-node-value">
        <template v-if="type === 'undefined' || type === 'null'">
          {{ String(value) }}
        </template>
        <template v-else-if="type === 'string'">
          <span class="jt-quote">"</span>
          <span>{{ value }}</span>
          <span class="jt-quote">"</span>
        </template>
        <template v-else-if="type === 'object'">
          <span class="jt-bracket">{</span>
          <json-tree-node v-for="(val, key) in value" :key="key" :value="val" :label="key" />
          <span class="jt-bracket">}</span>
        </template>
        <template v-else-if="type === 'array'">
          <span class="jt-bracket">[</span>
          <json-tree-node v-for="(val, idx) in value" :key="idx" :value="val" :label="idx" />
          <span class="jt-bracket">]</span>
        </template>
        <template v-else>{{ value }}</template>
      </span>
    </span>
  `
};
