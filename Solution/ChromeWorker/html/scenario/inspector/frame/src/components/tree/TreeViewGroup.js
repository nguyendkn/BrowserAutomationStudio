window.TreeViewGroup = {
  name: 'TreeViewGroup',

  props: {
    name: {
      required: true,
      type: String
    }
  },

  data() {
    return {
      color: '#c0bd9B',
      editMode: false,
      newName: this.name,
      palette: [
        '#D9D9D9',
        '#C9C7B0',
        '#9BC4DE',
        '#EC8A82',
        '#8EC38E',
      ],
      expanded: false
    }
  },

  computed: {
    style() {
      return { '--color': this.color };
    }
  },

  methods: {
    editGroup() {
      this.editMode = !this.editMode;
    },

    updateGroup() {
      this.$emit('update', this.name);
    },

    removeGroup() {
      this.$emit('remove', this.name);
    },

    addGroup() {
      this.$emit('add', this.name);
    },

    toggle() {
      this.expanded = !this.expanded;
    }
  },

  template: /*html*/`
    <li :style="style" class="tree-view-group">
      <div class="tree-view-group-header">
        <img src="src/assets/icons/folder.svg" alt>
        <input v-model="newName" :disabled="!editMode" style="flex: 1; margin-left: 8px;" type="text">
        <div v-if="!editMode" class="tree-view-group-controls">
          <button type="button" @click="removeGroup">
            <img src="src/assets/icons/delete.svg">
          </button>
          <button type="button" @click="editGroup">
            <img src="src/assets/icons/edit.svg">
          </button>
          <button type="button" @click="addGroup">
            <img src="src/assets/icons/plus.svg">
          </button>
          <button type="button" @click="toggle">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" :style="{ transform: expanded ? 'rotate(180deg)' : '' }">
              <path fill="#606060" d="M3.51482 9.79281L7.75743 5.55014L12.0001 9.79284L11.2931 10.5L7.75754 6.96435L4.22192 10.4999L3.51482 9.79281Z" />
            </svg>
          </button>
        </div>
        <div v-else>
          <div>
            <div class="tree-view-group-palette"></div>
          </div>
        </div>
      </div>
      <collapse-transition>
        <div v-show="!expanded" class="tree-view-group-content">
          Group content
        </div>
      </collapse-transition>
    </li>
  `
};