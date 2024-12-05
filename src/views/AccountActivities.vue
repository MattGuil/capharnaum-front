<template>
    <div class="activities-list">
        <h1>Mes activités</h1>
        <p v-for="activity in activities">{{ activity.title }}</p>
    </div>
</template>

<script>
import axios from 'axios';
import { ref, onMounted, onUnmounted } from 'vue';

export default {
    name: 'AccountActivities',
    setup() {
        const activities = ref([]);

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity/user/${localStorage.getItem('userId')}`);
                if (response.status === 200) {
                    activities.value = response.data;
                } else {
                    console.log("Erreur lors de la récupération des activités animées par l'utilisateur");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        })

        return { activities }
    }
};
</script>

<style scoped>

.activities-list {
    padding: 20px;
    padding-bottom: 10vh;
}

</style>