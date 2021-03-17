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
        login({commit}, token) {
            commit('AUTH_SUCCESS', token);
            router.push({name: 'Main'});
        },

        async getGoogleLoginHref() {
            try {
                let href = await rest.doGet(`/login`);
                return {
                    success: true,
                    data: href
                };
            } catch (error) {
                return {
                    success: false,
                    data: error.response.data
                }
            }
        },

        async getGoogleAccessToken({commit}, token) {
            try {
                let tokenData = await rest.doPost(`/login`, token);
                commit('AUTH_SUCCESS', tokenData);
                let userInfo = await rest.doGet("/user");
                commit('SET_USER_NAME', userInfo);
            } catch (error) {
                return {
                    success: false,
                    data: error.response.data
                }
            }
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
            let tokenFromStorage = localStorage.getItem(constants.SESSION_STORAGE_TOKEN);
            return !!tokenFromStorage;
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
        AUTH_SUCCESS(state, token) {
            //state.token = user.token;
            state.token = token;
            localStorage.setItem(constants.SESSION_STORAGE_TOKEN, token);
        },

        SET_USER_NAME(state, username) {
            state.user.name = username;
            localStorage.setItem(constants.SESSION_STORAGE_NAME, username);
        },

        LOGOUT(state) {
            state.token = '';
            localStorage.removeItem(constants.SESSION_STORAGE_TOKEN);
        },

        LOAD_USER_DATA(state, payload) {
            Object.assign(state.user, payload);
        }
    },

    getters: {
        currentUser: state => state.user,
        token: state => state.token,
    }
};