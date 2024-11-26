<template>
    <div class="container mt-5 text-center">
        <h1>Bienvenue {{username}}</h1>
    </div>

    <v-container class="mt-5">
        <v-row>
            <v-col v-for="(event, index) in events" :key="index" cols="6" md="6">
                <v-card hover class="mx-auto event-card" max-width="500" elevation="0">
                    <v-img class="event-image" :src="event.image" alt="Event image" style="object-fit: cover;"></v-img>
                    <v-card-title style="white-space: normal;"><strong>{{ event.label }}</strong><br>par {{ event.owner }}</v-card-title>
                    <v-card-subtitle style="white-space: normal;">{{ event.place }}</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>

    <router-link to="/newevent">
        <button class="btn btn-primary btn-add-event">
            <v-icon>mdi-plus</v-icon>
        </button>
    </router-link>
</template>

<script>

import navbar from "../components/navbar.vue";
import axios from 'axios';

export default {
    name: 'Home',
    components: {
        navbar
    },
    data() {
        return {
            username: '',
            events: [],
        };
    },
    mounted() {
        this.username = JSON.parse(localStorage.getItem('user')).prenom || 'Utilisateur';
        
        axios.get(`${import.meta.env.APP_API_URL}/events`)
        .then((response) => {
            if (response.status === 200) {
                this.events = response.data;
            } else if (response.status === 201) {
                console.log("Erreur lors de la récupération du catalogue des événements :/");
            }
        });
    }
}
</script>

<style scoped>
.center-form {
    max-width: 400px;
    margin: 0 auto;
    padding-top: 100px;
}
.back-to-login {
    margin-top: 20px;
}

.event-card {
    border-radius: 30px;
    padding: 5px;
    background-color: rgba(255, 255, 255, .5);
}

.event-image {
    border-radius: 30px;
}

.v-card-title, .v-card-subtitle {
    padding: 10px 5px;
}

.v-card-title {
    font-weight: bold;
    font-size: .8rem;
}

.v-card-subtitle {
    font-size: .7rem;
    padding-top: 0;
}

.v-card-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.btn-add-event {
    position: fixed;
    bottom: 30px;
    right: 50%;
    transform: translateX(50%);
    box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.2);
}
</style> 