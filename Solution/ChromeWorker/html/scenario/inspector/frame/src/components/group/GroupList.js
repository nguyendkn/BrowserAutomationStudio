'use strict';

window.GroupList = {
  name: 'GroupList',

  components: {
    draggable: window['vuedraggable'],
    GroupItem,
    TreeViewItem
  },

  props: {
    filters: {
      required: true,
      type: Array
    },

    query: {
      required: true,
      type: String
    },

    data: {
      required: true,
      type: Object
    }
  },

  data() {
    const main = {
      id: uniqueId(),
      name: 'Main',
      color: '#c0bd9b',
      primary: true,
      content: { ...this.data }
    };

    return { groups: [main] };
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
      return this.groups.findIndex(group => group.id === id);
    },

    addGroup() {
      this.groups.push({
        id: uniqueId(),
        name: 'Group',
        color: '#c0bd9b',
        primary: false,
        content: {}
      });
    },

    isVisible(val, key) {
      const type = getType(val).toLowerCase();
      const query = this.query.toLowerCase();
      return this.filters.some(f => f.includes(type)) && key.toLowerCase().includes(query);
    }
  },

  template: /*html*/`
    <draggable
      handle=".group-item-header"
      :disabled="draggableDisabled"
      class="tree-view"
      :list="groups"
      tag="ul"
    >
      <group-item
        v-for="group in groups"
        :key="group.id"
        :id="group.id"
        :data="group.content"
        :name="group.name"
        :color="group.color"
        :primary="group.primary"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <tree-view-item
          v-for="(val, key) in group.content"
          v-show="isVisible(val, key)"
          :key="key"
          :label="key"
          :value="val"
        />
      </group-item>
    </draggable>
  `
};
