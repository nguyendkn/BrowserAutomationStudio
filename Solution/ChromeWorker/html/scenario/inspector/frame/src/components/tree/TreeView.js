window.TreeView = {
  name: 'TreeView',

  components: {
    draggable: window['vuedraggable'],
    TreeViewGroup,
    TreeViewItem
  },

  props: {
    filters: {
      required: true,
      type: Array
    },

    data: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      groups: [{ name: 'Main', id: uniqueId(), color: '#c0bd9b', primary: true }]
    };
  },

  computed: {
    draggableDisabled() {
      return this.groups.length === 1;
    }
  },

  methods: {
    updateGroup(id, data) {
      const index = this.getGroupIndex(id);
      Object.assign(this.groups[index], data);
    },

    removeGroup(id, data) {
      const index = this.getGroupIndex(id);
      this.groups.splice(index, 1);
    },

    getGroupIndex(id) {
      return this.groups.findIndex(group => {
        return group.id === id;
      });
    },

    addGroup() {
      this.groups.push({
        id: uniqueId(),
        name: 'Group',
        color: '#c0bd9b',
        primary: false
      });
    }
  },

  template: /*html*/`
    <draggable
      :disabled="draggableDisabled"
      class="tree-view"
      :list="groups"
      tag="ul"
    >
      <tree-view-group
        v-for="group in groups"
        :key="group.id"
        :id="group.id"
        :name="group.name"
        :color="group.color"
        :primary="group.primary"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <tree-view-item
          v-for="(item, key) in data"
          :key="key"
          :label="key"
          :value="item"
        />
      </tree-view-group>
    </draggable>
  `
};
