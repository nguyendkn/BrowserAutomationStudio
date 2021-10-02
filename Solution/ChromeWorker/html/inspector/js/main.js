Vue.config.productionTip = false;

const app = new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: {
      /* 
      'Data will be loaded at the next script pause': { ru: 'Данные будут загружены при следующей паузе сценария' },
      'Change the variable value': { ru: 'Изменить значение переменной' },
      'No variables': { ru: 'Нет переменных' },
      'No resources': { ru: 'Нет ресурсов' },
      'Rename': { ru: 'Переименовать' },
      'Update': { ru: 'Обновить' },
      */
      en: window.locales.en,
      ru: window.locales.ru,
    },
    locale: new URL(location.href).searchParams.get('lang') || 'en',
    fallbackLocale: 'en'
  })
});

app.$mount('#app');