// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'font-awesome/css/font-awesome.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import 'trumbowyg/dist/ui/trumbowyg.css';

import './assets/styles';

// import $ from 'jquery'; window.$ = window.jQuery = $;
import Vue from 'vue'; Vue.config.productionTip = false;

import {ServerTable, ClientTable, Event} from 'vue-tables-2';
Vue.use(ClientTable, {
  perPageValues: [6, 10, 20, 50, 100],
  perPage: 6,
}, false);

import trumbowyg from 'vue-trumbowyg';
Vue.use(trumbowyg);

import CheckboxRadio from 'vue-checkbox-radio';
Vue.use(CheckboxRadio);

import { Sketch } from 'vue-color';
Vue.component('color-picker', Sketch);

import App from './App';
import api from './api'; window.api = api;
import store from './store';
import router from './router';

import './components';
import './layouts';

/* eslint-disable no-new */

api.init().then(() => {
  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
  });
}).catch((result) => {

  console.log('Api initialize failed');

  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
  });
});
