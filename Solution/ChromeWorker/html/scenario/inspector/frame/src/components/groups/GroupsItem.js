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

    items: {
      required: true,
      type: Array,
    },

    name: {
      required: true,
      type: String,
    },

    id: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      colors: {
        brown: '192, 189, 155',
        green: '142, 196, 143',
        blue: '154, 203, 230',
        gray: '217, 217, 217',
        red: '246, 155, 147',
      },
      editMode: false,
      expanded: false,
      newName: this.name,
      newColor: this.color,
    };
  },

  computed: {
    isEmpty() {
      return !this.items.length;
    },

    style() {
      return {
        '--color-rgb': this.colors[this.newColor],
      };
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
      this.editMode = true;
      this.$nextTick(() => this.$refs.input.focus());
    },
  },

  template: html`
    <li class="group-item" :style="style">
      <div class="group-item-header" :style="editMode ? { '--opacity': 1.0 } : {}">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3.5v-2H0v12H16v-10H6Z" fill="#606060" stroke="#606060" />
        </svg>
        <input ref="input" v-model="newName" :disabled="!editMode" maxlength="30" spellcheck="false" type="text" @keydown.enter="update" @blur="() => {}">
        <div v-if="editMode" class="group-item-controls">
          <ul class="group-item-swatches">
            <li v-for="(value, key) in colors" class="group-item-swatch" :style="{ borderColor: newColor === key ? 'rgb(' + value + ')' : 'transparent' }" @click="newColor = key">
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                <circle cx="6" cy="6" r="6" :fill="'rgb(' + value + ')'" />
              </svg>
            </li>
          </ul>
          <button type="button" style="background: #fff; padding: 4px;" @click="update">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.25 10.6002-3.55-3.55-.7.7 3.55 3.55.7.7 7.05-7.05-.7-.75-6.35 6.4Z" fill="#606060" />
            </svg>
          </button>
        </div>
        <div v-else class="group-item-controls">
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
      </div>
      <draggable v-show="!expanded" class="group-item-content" :list="items" group="items" :disabled="true">
        <template v-if="isEmpty" slot="header">
          <div class="group-item-title" v-t="'groups.empty'"></div>
        </template>
        <slot v-else></slot>
      </draggable>
    </li>
  `,
};
