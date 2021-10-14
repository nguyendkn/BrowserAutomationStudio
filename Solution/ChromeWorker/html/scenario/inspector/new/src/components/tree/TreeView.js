window.TreeView = {
  name: 'TreeView',

  props: {
    data: {
      required: true,
      type: [Array, Object]
    }
  },

  data() {
    return {};
  },

  template: String.raw`
    <ul class="tree-view">

    </ul>
  `
};