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
// Vue HighlightJS
//----------------------------------------------------------------------------------------------------------------------

import bash from 'highlight.js/lib/languages/bash';
import javascript from 'highlight.js/lib/languages/javascript';
// import 'highlight.js/styles/hybrid.css';
import 'highlight.js/styles/obsidian.css'; // Best
// import 'highlight.js/styles/ocean.css';

import VueHighlightJS from 'vue-highlight.js';
Vue.use(
    VueHighlightJS,
    {
    // Register only languages that you want
    languages: {
        bash,
        javascript
    }
});

//----------------------------------------------------------------------------------------------------------------------
// Font Awesome
//----------------------------------------------------------------------------------------------------------------------

// Font Awesome
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// There is a weird timing issue with the auto-loading that causes the GitHub and Twitter icons to be of size 0
config.autoAddCss = false;

library.add(fab);
Vue.component('fa', FontAwesomeIcon);