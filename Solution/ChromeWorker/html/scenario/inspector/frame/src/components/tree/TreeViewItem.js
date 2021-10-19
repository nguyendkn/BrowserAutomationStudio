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
    const type = Object.prototype.toString.call(this.value).slice(8, -1);
    return { type };
  },

  template: /*html*/`
    <li class="tree-node">
      <span class="tree-node-label">{{ label }}:</span>
      <span class="tree-node-value">{{ value }}</span>
    </li>
  `
};