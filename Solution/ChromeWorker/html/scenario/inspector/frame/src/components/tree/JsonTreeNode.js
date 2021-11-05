'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  props: {
    label: {
      required: true,
      type: String
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

  template: /*html*/`
    <li class="jt-node">
      <span class="jt-node-label">
        <slot name="label" :label="label">
          {{ label }}:
        </slot>
      </span>
      <span :style="{ color: color }" class="jt-node-value">
        {{ value }}
      </span>
    </li>
  `
};
