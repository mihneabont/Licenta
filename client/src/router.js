import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard
    },
    {
      path: '/inregistrare',
      name: 'inregistrare',
      component: () => import('./views/Inregistrare')
    },
    {
      path: '/autentificare',
      name: 'autentificare',
      component: () => import('./views/Login')
    },
    {
      path: '/angajati',
      name: 'angajati',
      component: () => import('./views/Angajati')
    },
    {
      path: '/adaugare',
      name: 'adaugare',
      component: () => import('./views/AdaugareFisier')
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('./views/Calendar')
    },
  ]
})


export default router;
