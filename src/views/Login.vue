<template>
    <v-container class="d-flex flex-column align-center justify-space-between bg-transparent" fluid>
        <img src="../../public/favicon.png" alt="Capharnaüm Logo" />

        <v-card class="pa-4 bg-transparent elevation-0 w-100">
            <v-card-title class="text-center pb-5">
                <h2>Connexion</h2>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="login">
                    <v-text-field
                        v-model="email"
                        label="Email"
                        type="email"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        label="Mot de passe"
                        type="password"
                        required
                    ></v-text-field>
                    <v-btn type="submit" color="#3c4798" block>
                        Me connecter
                    </v-btn>
                </v-form>
                <p v-if="errorMessage" class="text-danger" style="margin-top: 10px; text-align: center;">
                    {{ errorMessage }}
                </p>
                <p v-if="$route.query.error" class="text-danger" style="margin-top: 10px; text-align: center;">
                    {{ $route.query.error }}
                </p>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <v-text class="register-link" @click="navigateToRegister">
                    Vous n'avez pas de compte ?<br>
                    Inscrivez-vous ici
                </v-text>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'Login',
    setup() {
        const email = ref('');
        const password = ref('');
        const errorMessage = ref('');
        const router = useRouter();

        axios.defaults.withCredentials = true;

        const login = () => {
            axios
                .post(`${import.meta.env.APP_API_URL}/user/login`, {
                    email: email.value,
                    password: password.value
                })
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('userId', response.data.userId);
                        router.push('/explore');
                    } else if (response.status === 201) {
                        errorMessage.value = response.data;
                    }
                })
                .catch((error) => {
                    errorMessage.value = error.response?.data || "Erreur lors de la connexion.";
                });
        };

        return {
            email,
            password,
            errorMessage,
            login
        };
    },
    methods: {
        navigateToRegister() {
            this.$router.push('/register');
        },
    },
}
</script>

<style scoped>

.v-container {
    background: rgba(255, 255, 255, .8) !important;
}

img {
    width: 50px;
    height: fit-content;
}

.register-link {
    text-align: center;
    text-decoration: underline;
    color: #3c4798;
    cursor: pointer;
    position: absolute;
}
</style>