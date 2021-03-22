<template>
    <div class="login_main">
        <v-row style="height: 100vh" align="center" no-gutters>
            <v-row no-gutters justify="center">
                <v-col cols="4">
                    <v-row no-gutters justify="center">
                        <span class="logo_text">WSChat</span>
                    </v-row>
                    <v-card class="py-12">
<!--                        <v-text-field
                            class="mx-15"
                            label="Имя"
                            v-model="name"
                        ></v-text-field>-->
                        <v-row no-gutters align="center" justify="center">
                            <v-btn
                                class="mt-4"
                                @click="login('google')"
                                width="200px"
                                color="primary"
                            >
                                Войти через Google
                            </v-btn>
                        </v-row>
                        <v-row no-gutters align="center" justify="center">
                            <v-btn
                                class="mt-4"
                                @click="login('github')"
                                width="200px"
                                color="primary"
                            >
                                Войти через GitHub
                            </v-btn>
                        </v-row>

                        <v-row no-gutters align="center" justify="center">
                            <v-btn
                                class="mt-4"
                                @click="login('yandex')"
                                width="200px"
                                color="primary"
                            >
                                Войти через Яндекс
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

    async created() {
        if (this.$route.query.provider) {
            if (this.$route.query.code) {
                let data = {
                    provider: this.$route.query.provider,
                    code: this.$route.query.code
                };
                await this.$store.dispatch("getAccessToken", data);
                this.$router.push({name: "Main"});
            }
        }
    },

    methods: {
        async login(provider) {
            let response = await this.$store.dispatch("getLoginHref", provider);
            if (response.success) {
                window.open(response.data, "_self");
            }
        },
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