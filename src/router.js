import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store';
import constants from '@/constants';

import Login from './views/Login';
import Main from './views/Main';
import Chat from './views/Chat';
import LongPollingChat from "@/views/LongPollingChat";

Vue.use(Router);

const checkAuth = async (to, from, next) => {
    let auth = await store.dispatch('isAuthenticated');

    if (!auth) {
        localStorage.setItem(constants.SESSION_STORAGE_REDIRECT, to.path);
        next({name: 'Login'});
        return;
    }

    next();
};

const checkNoAuth = async (next) => {
    let auth = await store.dispatch('isAuthenticated');
    if (auth) {
        next({name: 'Main'});
        return;
    }
    next();
};


export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [

        {
            path: '/',
            name: 'Login',
            component: Login,
            beforeEnter: (to, from, next) => {
                checkNoAuth(next);
            }
        },

        {
            path: '/main',
            name: 'Main',
            component: Main,
            beforeEnter: (to, from, next) => {
                checkAuth(to, from, next)
            }
        },

        {
            path: '/long-polling',
            name: 'LongPollingChat',
            component: LongPollingChat,
            beforeEnter: (to, from, next) => {
                checkAuth(to, from, next)
            }
        },

        {
            path: '/chat/:id',
            name: 'Chat',
            props: true,
            component: Chat,
            beforeEnter: (to, from, next) => {
                checkAuth(to, from, next)
            }
        },

        {
            path: '/*',
            redirect: '/'
        }
    ]
})


