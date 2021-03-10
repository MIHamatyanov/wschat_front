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
            <div class="chat-container" ref="chatContainer">
                <v-row no-gutters v-for="(message, index) in messages" :key="index"
                       :justify="message.username === user.name ? 'end' : 'start'">
                    <v-card
                        class="py-2 px-3"
                        :color="message.username === user.name ? 'blue-grey lighten-4' : 'blue-grey lighten-3'"
                    >
                        <span>{{ message.username }}: </span>
                        <span>{{ message.message }}</span>
                    </v-card>
                </v-row>
            </div>
            <div class="typer">
                <input type="text" placeholder="Введите сообщение" v-on:keyup.enter="send" v-model="sendMessage">
            </div>
        </v-main>
    </div>
</template>

<script>

export default {
    name: "LongPollingChat",
    data() {
        return {
            user: {},
            messages: [],
            sendMessage: null,
            connected: false,
            chatId: 0
        }
    },

    created() {
        this.user = this.$store.getters.currentUser;
        this.chatId = this.$route.params.id;
        this.connect();
    },

    beforeRouteLeave() {
        this.disconnect();
    },

    methods: {
        logout() {
            this.$store.dispatch("logout");
        },

        send() {
            const msg = {
                username: this.user.name,
                message: this.sendMessage
            };
            this.sendMessage = '';
            this.$store.dispatch("sendMessage", msg);
        },
        async connect() {
            let lastId = 0;
            if (this.messages.length > 1) {
                lastId = this.messages[this.messages.length - 1].id;
            }
            let response = await this.$store.dispatch("getMessages", lastId);
            if (response.success) {
                let newMessages = response.data;
                for (let i = 0; i < newMessages.length; i++) {
                    this.messages.push(newMessages[i]);
                }
                await this.connect();
            }
        },
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
            }
            this.connected = false;
        },

        tickleConnection() {
            this.connected ? this.disconnect() : this.connect();
        }
    }
}
</script>

<style scoped>
.scrollable {
    overflow-y: auto;
    height: 90vh;
}

.typer {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    bottom: 0;
    height: 4.9rem;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, .2);
}

.typer input[type=text] {
    position: absolute;
    left: 2.5rem;
    padding: 1rem;
    width: 80%;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.25rem;
}

.chat-container {
    box-sizing: border-box;
    height: calc(100vh - 9.5rem);
    overflow-y: auto;
    padding: 10px;
    background-color: #f2f2f2;
}

.message {
    margin-bottom: 3px;
}

.message.own {
    text-align: right;
}

.message.own .content {
    background-color: lightskyblue;
}

.chat-container .username {
    font-size: 18px;
    font-weight: bold;
}

.chat-container .content {
    padding: 8px;
    background-color: lightgreen;
    border-radius: 10px;
    display: inline-block;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
    max-width: 50%;
    word-wrap: break-word;
}

@media (max-width: 480px) {
    .chat-container .content {
        max-width: 60%;
    }
}
</style>