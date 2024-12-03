<template>
    <v-container class="d-flex flex-column align-center justify-space-between bg-transparent" fluid>
        <img src="../../public/favicon.png" alt="Capharnaüm Logo" />

        <v-card class="pa-4 bg-transparent elevation-0 w-100">
            <v-card-title class="text-center pb-5">
                <h2>Inscription</h2>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="register">
                    <v-text-field
                        v-model="prenom"
                        label="Prénom"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="nom"
                        label="Nom"
                        required
                    ></v-text-field>
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
                        M'inscrire
                    </v-btn>
                </v-form>
                <p v-if="errorMessage" class="text-danger" style="margin-top: 10px; text-align: center;">
                    {{ errorMessage }}
                </p>
            </v-card-text>
            <v-card-actions class="d-flex justify-center">
                <v-text class="register-link" @click="navigateToLogin">
                Vous avez déjà un compte ?<br />
                Connectez-vous ici
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
    name: 'Register',
    setup() {
        const prenom = ref('');
        const nom = ref('');
        const email = ref('');
        const password = ref('');
        const errorMessage = ref('');
        const router = useRouter();

        const register = async () => {
        try {
            const response = await axios.post(`${import.meta.env.APP_API_URL}/user/register`, {
                prenom: prenom.value,
                nom: nom.value,
                email: email.value,
                password: password.value
            });
            
            if (response.status === 201) {
                router.push('/login');
            }
        } catch (error) {
            errorMessage.value = error.response?.data?.error || "Une erreur s'est produite.";
        }
        };

        const navigateToLogin = () => {
            router.push('/login');
        };

        return {
            prenom,
            nom,
            email,
            password,
            errorMessage,
            register,
            navigateToLogin
        };
    }
    }
    </script>

<style scoped>

.v-container {
    height: 100vh;
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