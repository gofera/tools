import Vue from 'vue';
import Router, {Route} from 'vue-router';
import Home from './views/Home.vue';
import Gds from './views/Gds.vue';
import Model from './views/Model.vue';
import TestCase from './views/Case.vue';
import Key from './views/Key.vue';
import Product from './views/Product.vue';
import User from './views/User.vue';
import ErrorPage from '@/views/Error.vue';
import Login from '@/views/Login.vue';
import store from '@/store';
import * as api from '@/api';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/testcase',
      children: [
        {
          path: 'gds',
          name: 'gds',
          component: Gds,
          props: (route: Route) => ({
            query: route.query,
          }),
        },
        {
          path: 'model',
          name: 'model',
          component: Model,
          props: (route: Route) => ({
            query: route.query,
          }),
        },
        {
          path: 'testcase',
          name: 'testcase',
          component: TestCase,
        },
        {
          path: 'user',
          name: 'user',
          component: User,
          beforeEnter: (to, from, next: () => void) => {
            const perm = store.state.auth.asPermission;
            if (perm >= api.Permission.Admin) {
              next();
            } else {
              // @ts-ignore
              console.log('need admin permission to enter user page');
            }
          },
        },
        {
          path: 'product',
          name: 'product',
          component: Product,
        },
        {
          path: 'key',
          name: 'key',
          component: Key,
          props: (route: Route) => ({
            query: route.query,
          }),
        },
      ],
    }, {
      path: '/error',
      name: 'error',
      component: ErrorPage,
    }, {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
