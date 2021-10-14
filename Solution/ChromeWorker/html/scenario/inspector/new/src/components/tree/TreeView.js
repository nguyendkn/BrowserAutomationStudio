window.TreeView = {
  name: 'TreeView',

  props: {
    data: {
      required: true,
      type: [Array, Object]
    }
  },

  template: String.raw`
    <div class="tree-view">

    </div>
  `
};