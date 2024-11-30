<template>
    <v-container class="d-flex flex-column align-center bg-transparent">
        <v-card class="pa-4 bg-transparent elevation-0 w-100">
            <h2 class="text-center">Créer un nouvel événement</h2>

            <v-form @submit.prevent="createEvent">
                <v-text-field
                v-model="label"
                label="Nom de l'événement"
                required
                ></v-text-field>

                <v-text-field
                v-model="category"
                label="Catégorie"
                required
                ></v-text-field>

                <v-text-field
                v-model="date"
                label="Date"
                type="date"
                required
                ></v-text-field>

                <v-text-field
                v-model="time"
                label="Horaire"
                required
                ></v-text-field>

                <v-text-field
                v-model="place"
                label="Lieu"
                required
                ></v-text-field>

                <v-btn type="submit" color="#3c4798" class="mt-4" block>
                Créer
                </v-btn>
            </v-form>

            <v-alert
                v-if="errorMessage"
                type="error"
                class="mt-4"
                dismissible
            >
                {{ errorMessage }}
            </v-alert>

            <v-snackbar v-model="snackbarVisible" :timeout="3000" location="bottom right">
                Événement créé avec succès !
            </v-snackbar>
        </v-card>
    </v-container>
</template>

<script>
import navbar from "../components/navbar.vue";
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: 'CreateActivity',
    components: {
        navbar
    },
    setup() {
        const label = ref('');
        const category = ref('');
        const date = ref('');
        const time = ref('');
        const place = ref('');
        const errorMessage = ref('');
        const snackbarVisible = ref(false);
        const router = useRouter();

        const createEvent = () => {
        axios.post(`${import.meta.env.APP_API_URL}/events/add`, {
            label: label.value,
            category: category.value,
            owner: JSON.parse(localStorage.getItem('user')).prenom + " " + JSON.parse(localStorage.getItem('user')).nom,
            date: date.value,
            time: time.value,
            place: place.value,
            image: 'https://sgu.ovh/matt/capharnaum/event.jpg'
        })
        .then((response) => {
            if (response.status === 200 || response.status === 201) {
                snackbarVisible.value = true; // Afficher la snackbar
                setTimeout(() => {
                    router.push('/explore'); // Rediriger après 3 secondes
                }, 3000);
            } else {
                errorMessage.value = "Erreur lors de la création de l'événement.";
            }
        })
        .catch((error) => {
            errorMessage.value = error.response?.data || "Erreur lors de la création de l'événement.";
        });
        };

        return {
            label,
            category,
            date,
            time,
            place,
            errorMessage,
            snackbarVisible,
            createEvent
        };
    }
}
</script>

<style scoped>
.v-container {
    background: rgba(255, 255, 255, .8) !important;
}

h2 {
    margin-bottom: 25px;
}
</style>  