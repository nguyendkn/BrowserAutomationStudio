window.TreeView = {
  name: 'TreeView',

  components: {
    TreeViewGroup,
    TreeViewItem
  },

  props: {
    data: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      groups: [
        { name: 'Main', index: 0 }
      ]
    };
  },

  methods: {
    removeGroup(name) {
      const index = this.groups.findIndex(group => {
        return group.name === name;
      });

      this.groups.splice(index, 1);
    },

    addGroup() {
      const index = this.groups.length;
      this.groups.push({ name: `Group ${index + 1}`, index });
    },
  },

  template: /*html*/`
    <ul class="tree-view">
      <TreeViewGroup v-for="group in groups" :key="group.name" :name="group.name" @remove="removeGroup" @add="addGroup">
        <TreeViewItem v-for="(item, key) in data" :key="key" :label="key" :value="item" />
      </TreeViewGroup>
    </ul>
  `
};