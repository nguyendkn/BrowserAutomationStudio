window.TreeViewItem = {
  name: 'TreeViewItem',

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
    const type = Object.prototype.toString.call(this.value).slice(8, -1).toLowerCase();

    const colors = {
      undefined: '#8546bc',
      boolean: '#2525cc',
      number: '#d036d0',
      string: '#2db669',
      date: '#ce904a',
      null: '#808080',
    };

    return { color: colors[type], type };
  },

  template: /*html*/`
    <li class="tree-node">
      <span class="tree-node-label">{{ label }}:</span>
      <span :style="{ color: color }" class="tree-node-value">
        {{ value }}
      </span>
    </li>
  `
};