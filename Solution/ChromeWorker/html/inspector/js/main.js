Vue.config.productionTip = false;

const app = new Vue({
  render: h => h(App),

  i18n: new VueI18n({
    messages: { ...window.locales },
    locale: new URL(location.href).searchParams.get('lang') || 'en',
    fallbackLocale: 'en'
    /* 
      'Data will be loaded at the next script pause': { ru: 'Данные будут загружены при следующей паузе сценария' },
      'Change the variable value': { ru: 'Изменить значение переменной' },
      'No variables': { ru: 'Нет переменных' },
      'No resources': { ru: 'Нет ресурсов' },
      'Update': { ru: 'Обновить' },
    */
  })
});

app.$mount('#app');