import rest from "../../restUtils";

const path = "/chat"

export default {
    namespace: true,
    state: {
    },

    actions: {
        async getChats() {
            try {
                let chats = await rest.doGet(`${path}`);
                return {
                    success: true,
                    data: chats
                };
            } catch (error) {
                return {
                    success: false,
                    data: error.response.data
                }
            }
        },

        async getChatHistory(context, id) {
            try {
                let messages = await rest.doGet(`${path}/${id}/message`);
                return {
                    success: true,
                    data: messages
                };
            } catch (error) {
                return {
                    success: false,
                    data: error.response.data
                }
            }
        },

        async createChat(context, name) {
            try {
                let chat = await rest.doPost(`${path}`, name);
                return {
                    success: true,
                    data: chat
                };
            } catch (error) {
                return {
                    success: false,
                    data: error.response.data
                }
            }
        },

        async deleteChat(context, id) {
            try {
                await rest.doDelete(`${path}/${id}`);
                return {
                    success: true,
                };
            } catch (error) {
                return {
                    success: false,
                    data: error.response.data
                }
            }
        },
    },

    mutations: {
    },

    getters: {
    }
};