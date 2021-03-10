import constants from '@/constants';
import rest from "../../restUtils";
import router from '@/router';


const emptyUser = {
};

export default {
    namespace: true,
    state: {
        user: Object.assign({}, emptyUser),
        token: '',
        role: ''
    },

    actions: {
        login({commit}, user) {
            commit('AUTH_SUCCESS', user);
            router.push({name: 'Main'});
        },

        async authorization({commit, dispatch}, user) {
            try {
                let tokenData = await rest.doPost(
                    `/auth/login`,
                    {
                        email: user.email,
                        password: user.password
                    });
                commit('AUTH_SUCCESS', tokenData);
            } catch (error) {
                commit('AUTH_ERROR');
                return error;
            }
            try {
                await dispatch('loadCurrentUserData');
                dispatch('redirectAfterLogin');
            } catch (error) {
                dispatch('logout');
                router.push({name: 'Main'});
            }
        },

        async isAuthenticated() {
           /* let authenticated = false;
            let tokenFromStorage = localStorage.getItem(constants.SESSION_STORAGE_TOKEN);
            if (tokenFromStorage) {
                authenticated = await dispatch('loadCurrentUserData');
            }
            return !!authenticated;*/
            let nameFromStorage = localStorage.getItem(constants.SESSION_STORAGE_NAME);
            return !!nameFromStorage;
        },


        async loadCurrentUserData({commit, dispatch}) {
            let success;
            try {
                let userData = await rest.doGet(`/user`);
                commit('LOAD_USER_DATA', userData);

                success = true;
            } catch (error) {
                success = false;
                dispatch('logout');
            }

            return success;
        },

        async logout({commit}) {
            commit('LOGOUT');
            router.push({name: "Login"});
        },
    },

    mutations: {
        AUTH_SUCCESS(state, user) {
            //state.token = user.token;
            state.user = user;
            localStorage.setItem(constants.SESSION_STORAGE_NAME, user.name);
        },

        LOGOUT(state) {
            state.user = Object.assign({}, emptyUser);
            localStorage.removeItem(constants.SESSION_STORAGE_NAME);
        },

        LOAD_USER_DATA(state, payload) {
            Object.assign(state.user, payload);
        }
    },

    getters: {
        currentUser: state => state.user
    }
};