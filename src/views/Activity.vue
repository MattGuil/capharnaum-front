<template>
    <h1 v-if="activity">{{ activity.title }}</h1>
    <p v-else>Chargement de l'activité...</p>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: 'Activity',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const activity = ref(null);

        onMounted(async () => {
            try {
                const response = await axios.get(`${import.meta.env.APP_API_URL}/activity/${props.id}`);
                
                if (response.status === 200) {
                    activity.value = response.data;
                    console.log(activity);
                } else {
                    console.log("Erreur lors de la récupération de l'activité");
                }
            } catch (error) {
                console.error("Erreur de connexion ou autre :", error);
            }
        });

        return {
            activity
        };
    }
};
</script>


<style scoped>



</style>