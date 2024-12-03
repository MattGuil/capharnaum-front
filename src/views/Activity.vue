<template>
    <v-card class="elevation-0 w-100 pa-10">
        <h1 v-if="activity">{{ activity.title }}</h1>
        <img :src="srcImage" alt="">
    </v-card>
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
        const srcImage = ref('');

        const loadImage = () => {
            let imageSrc = '';
            try {
                imageSrc = new URL(`../assets/${activity.value.discipline.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.jpg`, import.meta.url).href;
            } catch (error) {
                console.error('Image not found:', error);
            }
            return imageSrc;
        }

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

            srcImage.value = loadImage();
        });

        return {
            activity,
            srcImage
        };
    }
};
</script>


<style scoped>

.v-card {
    width: 100%;
    height: 80vh;
    margin-top: 12vh;
    padding-bottom: 8vh;
    background: rgba(255, 255, 255, .8);
    border-radius: 20px 20px 0 0;
}

h1 {
    margin-bottom: 20px;
}

img {
    width: 100%;
}

</style>