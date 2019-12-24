//----------------------------------------------------------------------------------------------------------------------
// Saber Browser API
//----------------------------------------------------------------------------------------------------------------------

import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';

//----------------------------------------------------------------------------------------------------------------------
// Vue Bootstrap
//----------------------------------------------------------------------------------------------------------------------

import './style/theme.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue);

//----------------------------------------------------------------------------------------------------------------------
// Font Awesome
//----------------------------------------------------------------------------------------------------------------------

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fab);
Vue.component('fa', FontAwesomeIcon);