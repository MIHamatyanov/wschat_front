<template>
    <div>
        <v-app-bar
            color="deep-purple accent-4"
            dense
            dark
        >
            <v-toolbar-title>WSChat</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-title>{{ user.name }}</v-toolbar-title>

            <v-btn icon @click="logout">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-container fluid>
                <v-row dense>
                    <v-col
                        v-for="card in cards"
                        :key="card.title"
                        :cols="card.flex"
                    >
                        <v-card>
                            <v-img
                                :src="card.src"
                                class="white--text align-end"
                                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                                height="200px"
                            >
                                <v-card-title v-text="card.title"></v-card-title>
                            </v-img>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn @click="connectToChat(card)">
                                    Подключиться
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </div>
</template>

<script>
export default {
    name: "Main",
    data() {
        return {
            user: {},
            messages: [],
            sendMessage: null,
            connected: false,
            cards: [
                { id: 1, type: 'ws', title: 'Чат 1', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', flex: 3 },
                { id: 2, type: 'ws', title: 'Чат 2', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', flex: 3 },
                { id: 3, type: 'ws', title: 'Чат 3', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 3 },
                { id: 4, type: 'long-polling', title: 'Long polling', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', flex: 3 },
            ]
        }
    },

    created() {
        this.user = this.$store.getters.currentUser;
    },

    methods: {
        logout() {
            this.$store.dispatch("logout");
        },

        connectToChat(card) {
            if (card.type === 'ws') {
                this.$router.push({name: 'Chat', params: {id: card.id}});
            } else {
                this.$router.push({name: "LongPollingChat"});
            }
        },
    }
}
</script>

<style scoped>

</style>