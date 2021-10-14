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
      editName: this.name,
      palette: [
        '#D9D9D9',
        '#C9C7B0',
        '#9BC4DE',
        '#EC8A82',
        '#8EC38E',
      ]
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

    removeGroup() {
      this.$emit('remove', this.name);
    },

    addGroup() {
      this.$emit('add', this.name);
    },
  },

  template: String.raw`
    <li :style="style" class="tree-view-group">
      <div class="tree-view-group-header">
        <img src="src/assets/icons/folder.svg" alt>
        <input v-model="editName" :disabled="!editMode" style="flex: 1; margin-left: 8px;" type="text">
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
        </div>
        <div v-else>
          <div>
            <div class="tree-view-group-palette">
              <!-- <input v-for="color in palette" name="palette" type="radio"> -->
            </div>
          </div>
        </div>
      </div>
      <div class="tree-view-group-content">
        Group content
      </div>
    </li>
  `
};