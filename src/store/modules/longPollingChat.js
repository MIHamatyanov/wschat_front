import rest from "../../restUtils";

const path = "/long-polling"

export default {
    namespace: true,
    state: {
    },

    actions: {
        async getMessages(context, id) {
            try {
                let messages = await rest.doGet(`${path}?id=${id}`);
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

        async sendMessage(context, data) {
            try {
                await rest.doPost(`${path}`, data);
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