<template>
    <div class="login_main">
        <v-row style="height: 100vh" align="center" no-gutters>
            <v-row no-gutters justify="center">
                <v-col cols="4">
                    <v-row no-gutters justify="center">
                        <span class="logo_text">WSChat</span>
                    </v-row>
                    <v-card class="py-12">
                        <v-text-field
                            class="mx-15"
                            label="Имя"
                            v-model="name"
                        ></v-text-field>
                        <v-row no-gutters align="center" justify="center">
                            <v-btn
                                class="mt-4"
                                @click="login"
                                width="150px"
                                color="primary"
                            >
                                Войти
                            </v-btn>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </v-row>
    </div>
</template>

<script>
const apiUrl = process.env.VUE_APP_GLOBAL_URL;
const frontUrl = process.env.VUE_APP_FRONT_GLOBAL_URL;

export default {
    name: "Login",
    data() {
        return {
            name: '',
            apiUrl: apiUrl,
            frontUrl: frontUrl
        }
    },

    methods: {
        login() {
            let user = {
                name: this.name
            }
            this.$store.dispatch("login", user);
        }
    }
}
</script>

<style scoped>
.login_main {
    background-color: #6200EA;
}
.logo_text {
    color: #fff;
    font-weight: bold;
    font-size: 60px;
}
</style>