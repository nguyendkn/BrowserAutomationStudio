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
        { name: 'Main', index: 0, color: '#c0bd9b' }
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

    updateGroup(name, data) {
      const index = this.groups.findIndex(group => {
        return group.name === name;
      });

      Object.assign(this.groups[index], data);
    },

    addGroup() {
      const index = this.groups.length;
      this.groups.push({ name: `Group ${index + 1}`, index, color: '#c0bd9b' });
    },
  },

  template: /*html*/`
    <ul class="tree-view">
      <TreeViewGroup v-for="group in groups"
        :key="group.index"
        :name="group.name"
        :color="group.color"
        @remove="removeGroup"
        @update="updateGroup"
        @add="addGroup"
      >
        <TreeViewItem v-for="(item, key) in data" :key="key" :label="key" :value="item" />
      </TreeViewGroup>
    </ul>
  `
};