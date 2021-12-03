'use strict';

window.GroupsList = {
  name: 'GroupsList',

  components: {
    GroupsItem,
    JsonTreeNode,
  },

  props: {
    source: {
      required: true,
      type: Object,
    },
  },

  data() {
    const main = {
      id: uniqueId(),
      name: 'Main',
      color: '#c0bd9b',
      primary: true,
      source: { ...this.source },
    };

    return { groups: [main] };
  },

  computed: {
    draggableDisabled() {
      return true;
      // return this.groups.length <= 1;
    },
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
        source: {},
      });
    },
  },

  template: html`
    <draggable
      handle=".group-item-header"
      :disabled="draggableDisabled"
      class="group-list"
      :list="groups"
      tag="ul"
    >
      <groups-item
        v-for="group in groups"
        :key="group.id"
        :id="group.id"
        :name="group.name"
        :color="group.color"
        :source="group.source"
        :primary="group.primary"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <json-tree-node
          v-for="(val, key) in group.source"
          :key="key"
          :name="key"
          :path="[key]"
          :value="val"
        >
          <template #label="{ name }">{{ name }}</template>
        </json-tree-node>
      </groups-item>
    </draggable>
  `,
};
