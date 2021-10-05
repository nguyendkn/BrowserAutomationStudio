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

  template: html`
    <div class="inspector-tools">
      <div class="inspector-tools-panel">
        <input v-model="query" type="search" class="inspector-tools-input" :placeholder="$t('toolbar.placeholder') + '...'">
        <div class="dropdown">
          <button data-toggle="dropdown" type="button" aria-expanded="false" aria-haspopup="true">
            <i class="fa fa-filter"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-right inspector-tools-menu">
            <li v-for="item in sortings" :key="item" @click="selectedSorting = item">
              <a href="#">{{ $t('toolbar.sorting.' + item) }}</a>
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