import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import ErrorPage from '@/views/Error.vue';
import Search from '@/views/Search.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/search',
      children: [
        {
          path: 'search',
          name: 'search',
          component: Search,
        },
      ],
    }, {
      path: '/error',
      name: 'error',
      component: ErrorPage,
    },
  ],
});
