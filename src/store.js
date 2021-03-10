import Vue from 'vue'
import Vuex from 'vuex'
import profile from '@/store/modules/profile.js';
import longPollingChat from '@/store/modules/longPollingChat.js';

import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,
    modules: {
        profile,
        longPollingChat
    },

    state: {
    },

    actions: {
    },

    mutations: {
    },

    getters: {
    },

    plugins: [createPersistedState({
        key: 'profile',
        paths: ['profile'],
        storage: {
            getItem: key => Cookies.get(key),
            setItem: (key, value) =>
                Cookies.set(key, value, {expires: 3}),
            removeItem: key => Cookies.remove(key)
        }
    })]
})
