<template>
    <div>
        <v-app-bar
            color="deep-purple accent-4"
            dense
            dark
        >
            <v-toolbar-title><a href="/main" class="logo_link">WSChat</a></v-toolbar-title>

            <v-spacer></v-spacer>

            <v-toolbar-title>{{ user.name }}</v-toolbar-title>

            <v-btn icon @click="logout">
                <v-icon>mdi-exit-to-app</v-icon>
            </v-btn>
        </v-app-bar>
        <v-main>
            <div class="chat-container" ref="chatContainer">
                <v-row no-gutters v-for="(message, index) in messages" :key="index"
                       :justify="message.ownerId === user.id ? 'end' : 'start'">
                    <v-card
                        class="py-2 px-3"
                        :color="message.ownerId === user.id ? 'blue-grey lighten-4' : 'blue-grey lighten-3'"
                    >
                        <span>{{ message.ownerName }}: </span>
                        <span>{{ message.message }}</span>
                        <Media v-if="message.link" :message="message"/>
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
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import Media from "@/components/Media";

export default {
    name: "Chat",
    components: {Media},
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
        this.getChatHistory();
    },

    beforeRouteLeave() {
        this.disconnect();
    },

    methods: {
        logout() {
            this.$store.dispatch("logout");
        },

        async getChatHistory() {
            let response = await this.$store.dispatch("getChatHistory", this.chatId);
            if (response.success) {
                this.messages = response.data;
            }
        },

        send() {
            if (this.stompClient && this.stompClient.connected) {
                const msg = {
                    username: this.user.name,
                    message: this.sendMessage
                };
                this.sendMessage = '';
                let token = this.$store.getters.token;
                this.stompClient.send(`/ws/send/${this.chatId}`, JSON.stringify(msg), {Authorization: token});
            }
        },
        connect() {
            this.socket = new SockJS("http://localhost:8080/connect");
            this.stompClient = Stomp.over(this.socket);
            let token = this.$store.getters.token;
            this.stompClient.connect(
                {Authorization: token},
                // eslint-disable-next-line no-unused-vars
                frame => {
                    this.connected = true;
                    this.stompClient.subscribe(`/topic/chat/${this.chatId}`, tick => {
                        this.messages.push(JSON.parse(tick.body));
                    });
                },
                // eslint-disable-next-line no-unused-vars
                error => {
                    this.connected = false;
                }
            );
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

.logo_link {
    color: #fff;
    text-decoration: none;
}
</style>