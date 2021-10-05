window.Toolbar = {
  name: 'Toolbar',

  props: {
    sortings: {
      required: true,
      type: Array
    },
    filters: {
      required: true,
      type: Array
    },
  },

  data() {
    return {
      selectedFilters: [],
      selectedSorting: '',
      query: '',
    }
  },

  methods: {
    updateSortings(sorting) {

    },

    updateFilters(filter) {

    },
  },

  template: html`
    <div class="inspector-tools">
      <div class="inspector-tools-panel">
        <input v-model.trim="query" type="text" class="inspector-tools-input" :placeholder="$t('toolbar.placeholder') + '...'">
        <div class="dropdown">
          <button data-toggle="dropdown" type="button" aria-expanded="false" aria-haspopup="true">
            <svg viewBox="0 0 16 16" height="16" width="16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="#606060" d="M15.0001 2L1 2V4L5.91452 10.5V15H9.91452V10.5L15.0001 4V2ZM8.91452 10.0855V14H6.91452V10.0855L2.4145 4H13.5861L8.91452 10.0855Z" />
            </svg>
          </button>
          <ul class="dropdown-menu dropdown-menu-right inspector-tools-menu">
            <li v-for="item in sortings" :key="item" @click="updateSortings(item)">
              <a href="#">{{ $t('toolbar.sortings.' + item) }}</a>
            </li>
            <li v-for="item in filters" :key="item" @click="updateFilters(item)">
              <a href="#">{{ $t('toolbar.filters.' + item) }}</a>
            </li>
          </ul>
        </div>
      </div>
      <button class="inspector-tools-toggle" type="button">
        <i class="fa fa-chevron-up"></i>
      </button>
    </div>
  `
};