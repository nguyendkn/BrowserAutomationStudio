'use strict';

window.GroupsItem = {
  name: 'GroupsItem',

  props: {
    primary: {
      required: true,
      type: Boolean,
    },

    color: {
      required: true,
      type: String,
    },

    name: {
      required: true,
      type: String,
    },

    data: {
      required: true,
      type: Object,
    },

    id: {
      required: true,
      type: String,
    },
  },

  data() {
    const colors = ['#c0bd9b', '#9acbe6', '#8ec48f', '#d9d9d9', '#f69b93'];

    return {
      colors,
      editMode: false,
      expanded: false,
      newName: this.name,
      newColor: this.color,
    };
  },

  computed: {
    style() {
      return { '--group-color': this.color };
    },

    isEmpty() {
      return !Object.keys(this.data).length;
    },
  },

  methods: {
    update() {
      this.$emit('update', this.id, {
        color: this.newColor,
        name: this.newName,
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
    },
  },

  template: html`
    <li class="group-item" :style="style">
      <div class="group-item-header">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.00024 3.5v-2H.00024414v12H16.0002v-10H6.00024Z" fill="#606060" stroke="#606060" />
        </svg>
        <input v-model="newName" :disabled="!editMode" maxlength="30" type="text">
        <div v-if="!editMode" class="group-item-controls">
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
        <div v-else class="group-item-controls">
          <button type="button" @click="update">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.25 10.6002-3.55-3.55-.7.7 3.55 3.55.7.7 7.05-7.05-.7-.75-6.35 6.4Z" fill="#606060" />
            </svg>
          </button>
        </div>
      </div>
      <div v-show="!expanded" class="group-item-content">
        <slot v-if="!isEmpty"></slot>
        <div v-else class="group-item-title">
          <span>This group is empty.</span>
          <span>Drag the elements here.</span>
        </div>
      </div>
    </li>
  `,
};
