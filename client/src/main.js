import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import VueApexCharts from 'vue-apexcharts'
import axios from 'axios'
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  created () {
    const userString = localStorage.getItem('user') // grab user data from local storage
    if (userString) { // check to see if there is indeed a user
      const userData = JSON.parse(userString) // parse user data into JSON
      this.$store.commit('SET_USER_DATA', userData) // restore user data with Vuex
    }
    axios.interceptors.response.use(
      response => response, // simply return the response 
      error => {
        if (error.response.status === 401) { // if we catch a 401 error
          this.$store.commit('LOGOUT');
          this.$router.push("/autentificare");
        }
        return Promise.reject(error) // reject the Promise, with the error as the reason
      }
    )
  },
  render: h => h(App)
}).$mount('#app')
