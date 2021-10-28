window.TreeViewGroup = {
  name: 'TreeViewGroup',

  props: {
    primary: {
      required: true,
      type: Boolean
    },

    color: {
      required: true,
      type: String
    },

    name: {
      required: true,
      type: String
    },

    id: {
      required: true,
      type: String
    }
  },

  data() {
    const colors = ['#c0bd9b', '#9acbe6', '#8ec48f', '#d9d9d9', '#f69b93'];

    return {
      colors,
      editMode: false,
      expanded: false,
      newName: this.name,
      newColor: this.color
    };
  },

  computed: {
    style() {
      return { '--color': this.color };
    }
  },

  methods: {
    update() {
      this.$emit('update', this.id, {
        color: this.newColor,
        name: this.newName
      });
      this.editMode = false;
    },

    remove() {
      this.$emit('remove', this.id);
    },

    toggle() {
      this.expanded = !this.expanded;
    },

    edit() {
      this.editMode = !this.editMode;
    }
  },

  template: /*html*/`
    <li class="tree-view-group" :style="style">
      <div class="tree-view-group-header">
        <img src="src/assets/icons/folder.svg" alt>
        <input v-model="newName" :disabled="!editMode" style="flex: 1; margin-left: 8px;" type="text">
        <div v-if="!editMode" class="tree-view-group-controls">
          <template v-if="!primary">
            <button type="button" @click="remove">
              <icon-delete />
            </button>
            <button type="button" @click="edit">
              <icon-edit />
            </button>
          </template>
          <button type="button" @click="toggle">
            <icon-chevron :style="{ transform: expanded ? 'rotate(180deg)' : '' }" />
          </button>
        </div>
        <div v-else>
          <button type="button" @click="update">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.25 10.6002-3.55-3.55-.7.7 3.55 3.55.7.7 7.05-7.05-.7-.75-6.35 6.4Z" fill="#606060" />
            </svg>
          </button>
        </div>
      </div>
      <div v-show="!expanded" class="tree-view-group-content">
        <slot></slot>
      </div>
    </li>
  `
};
