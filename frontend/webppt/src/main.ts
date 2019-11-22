import ElementUI from 'element-ui';
import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import App from './App.vue';
import router from './router';
import store from './store';
import {Cmd} from './store/frame';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import 'swiper/dist/css/swiper.css';
import locale from 'element-ui/lib/locale/lang/en';
import './element-variables.scss';
import './styles/index.scss';

Vue.use(VueAwesomeSwiper);
Vue.config.productionTip = false;
Vue.config.devtools = true;
Vue.use(ElementUI, {locale});
Vue.config.productionTip = false;

axios.interceptors.request.use((config) => {
  store.dispatch(Cmd.SET_LOADING);
  return config;
});
axios.interceptors.response.use((response) => {
  store.dispatch(Cmd.CLEAR_LOADING);
  return response;
}, (error) => {
  store.dispatch(Cmd.CLEAR_LOADING);
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
