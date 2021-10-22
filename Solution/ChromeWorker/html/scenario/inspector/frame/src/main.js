Vue.use(window['v-click-outside']);

new Vue({
  i18n: new VueI18n({
    locale: new URL(window.location.href).searchParams.get('lang') || 'en',
    messages: { ...window.locales },
    fallbackLocale: 'en'
  }),
  render: h => h(App)
}).$mount('#app');
