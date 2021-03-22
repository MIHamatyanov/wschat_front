<template>
    <div>
        <v-app-bar
            color="deep-purple accent-4"
            dense
            dark
        >
            <v-toolbar-title>WSChat</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn class="mr-10" @click="createChatDialog = true">Создать чат</v-btn>
            <v-toolbar-title>{{ user.name }}</v-toolbar-title>

            <v-btn icon @click="logout">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-container fluid>
                <v-row dense>
                    <v-col
                        v-for="chat in chats"
                        :key="chat.id"
                        cols="3"
                    >
                        <v-card>
                            <v-img
                                src="https://source.unsplash.com/random"
                                class="white--text align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                height="200px"
                            >
                                <v-card-title v-text="chat.name"></v-card-title>
                            </v-img>

                            <v-card-actions>
                                <v-btn v-if="user.id === chat.ownerId" @click="deleteChat(chat)" color="red" dark>
                                    Удалить
                                </v-btn>

                                <v-spacer></v-spacer>

                                <v-btn @click="connectToChat(chat)">
                                    Подключиться
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
        <CreateChatWindow v-if="createChatDialog" :dialog="createChatDialog" @closeWindow="createChatDialog = false" @createChat="createChat"/>
    </div>
</template>

<script>
import CreateChatWindow from "../components/window/CreateChatWindow";
export default {
    name: "Main",
    components: {CreateChatWindow},
    data() {
        return {
            user: {},
            messages: [],
            sendMessage: null,
            connected: false,
            chats: [],
            createChatDialog: false
        }
    },

    created() {
        this.user = this.$store.getters.currentUser;
        this.getChats();
    },

    methods: {
        logout() {
            this.$store.dispatch("logout");
        },

        async getChats() {
            let response = await this.$store.dispatch('getChats');
            if (response.success) {
                this.chats = response.data;
                this.chats.push({
                    id: 0,
                    type: 'long-polling',
                    name: 'Long polling',
                    src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg',
                });
            }
        },

        connectToChat(card) {
            if (card.type && card.type === 'long-polling') {
                this.$router.push({name: "LongPollingChat"});
            } else {
                this.$router.push({name: 'Chat', params: {id: card.id}});
            }
        },

        async createChat(chatName) {
            let response = await this.$store.dispatch('createChat', chatName);
            if (response.success) {
                this.getChats();
            }
        },

        async deleteChat(chat) {
            let response = await this.$store.dispatch('deleteChat', chat.id);
            if (response.success) {
                this.getChats();
            }
        }
    }
}
</script>

<style scoped>

</style>