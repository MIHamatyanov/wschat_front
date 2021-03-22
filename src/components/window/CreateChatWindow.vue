<template>
    <v-dialog
        v-model="dialog"
        persistent
        max-width="360"
    >
        <v-card>
            <v-card-title>Создать чат</v-card-title>

            <v-row no-gutters class="ml-7">
                <v-col cols="12">
                    <div>Название</div>
                </v-col>
                <v-col cols="12" md="9" lg="10">
                    <v-text-field
                        class="rounded-lg mt-1"
                        :flat="true"
                        v-model="chatName"
                        outlined
                        height="50"
                    ></v-text-field>
                </v-col>
            </v-row>

            <div class="px-9 pb-6">
                <v-btn width="45%" class="mr-5" height="45" elevation="5" @click="closeWindow">
                    Отмена
                </v-btn>
                <v-btn width="45%" color="primary" dark height="45" elevation="5" @click="createChat">
                    Создать
                </v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "CreateChatWindow",
    props: ['dialog'],
    data() {
        return {
            chatName: ''
        }
    },
    methods: {
        closeWindow() {
            this.$emit('closeWindow');
        },
        createChat() {
            this.$emit('createChat', this.chatName);
            this.closeWindow()
            this.chatName = '';
        }
    }
}
</script>

<style scoped>
</style>